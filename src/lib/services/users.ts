import { hash } from "bcryptjs";
import { RoleCode } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { AppError } from "@/lib/errors";
import { createAuditLog } from "@/lib/services/audit";
import { canManageUsers } from "@/lib/services/access";
import {
  UpdateUserSchema,
  createUserSchema,
  listUsersSchema,
  updateUserSchema
} from "@/lib/validators/user";

type Actor = {
  id: string;
  name?: string | null;
  role: RoleCode;
};

function assertCanManageUsers(actor: Actor) {
  if (!canManageUsers(actor.role)) {
    throw new AppError("Forbidden.", 403, "FORBIDDEN");
  }
}

function assertRoleAssignment(actor: Actor, targetRole: RoleCode) {
  if (actor.role !== RoleCode.SUPER_ADMIN && targetRole === RoleCode.SUPER_ADMIN) {
    throw new AppError("Only Super Admin can assign Super Admin role.", 403, "FORBIDDEN_ROLE_ASSIGNMENT");
  }
}

export async function createUser(actor: Actor, rawInput: unknown) {
  assertCanManageUsers(actor);
  const input = createUserSchema.parse(rawInput);
  assertRoleAssignment(actor, input.roleCode);

  const existingUser = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase() }
  });
  if (existingUser) {
    throw new AppError("A user with this email already exists.", 409, "USER_EMAIL_EXISTS");
  }

  const role = await prisma.role.findUniqueOrThrow({
    where: { code: input.roleCode }
  });
  const passwordHash = await hash(input.password, 12);

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email.toLowerCase(),
      passwordHash,
      companyId: input.companyId ?? null,
      status: input.status,
      roleId: role.id
    },
    include: {
      role: true,
      company: true
    }
  });

  await createAuditLog({
    actorId: actor.id,
    actorName: actor.name ?? null,
    action: "USER_CREATED",
    entityType: "User",
    entityId: user.id,
    metadata: {
      email: user.email,
      role: user.role.code,
      companyId: user.companyId
    }
  });

  return user;
}

export async function updateUser(actor: Actor, userId: string, rawInput: unknown) {
  assertCanManageUsers(actor);
  const input = updateUserSchema.parse(rawInput);

  if (input.roleCode) {
    assertRoleAssignment(actor, input.roleCode);
  }

  const existingUser = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    include: { role: true }
  });

  if (existingUser.role.code === RoleCode.SUPER_ADMIN && actor.role !== RoleCode.SUPER_ADMIN) {
    throw new AppError("Only Super Admin can modify another Super Admin.", 403, "FORBIDDEN_ROLE_ASSIGNMENT");
  }

  if (input.email && input.email.toLowerCase() !== existingUser.email) {
    const duplicate = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() }
    });
    if (duplicate) {
      throw new AppError("A user with this email already exists.", 409, "USER_EMAIL_EXISTS");
    }
  }

  const nextRoleId = input.roleCode
    ? (
        await prisma.role.findUniqueOrThrow({
          where: { code: input.roleCode }
        })
      ).id
    : undefined;

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      name: input.name,
      email: input.email?.toLowerCase(),
      companyId: input.companyId,
      status: input.status,
      roleId: nextRoleId
    },
    include: {
      role: true,
      company: true
    }
  });

  await createAuditLog({
    actorId: actor.id,
    actorName: actor.name ?? null,
    action: input.status === "INACTIVE" ? "USER_DEACTIVATED" : "USER_UPDATED",
    entityType: "User",
    entityId: updatedUser.id,
    metadata: {
      previousRole: existingUser.role.code,
      nextRole: updatedUser.role.code,
      companyId: updatedUser.companyId,
      status: updatedUser.status
    }
  });

  if (existingUser.role.code !== updatedUser.role.code) {
    await createAuditLog({
      actorId: actor.id,
      actorName: actor.name ?? null,
      action: "USER_ROLE_CHANGED",
      entityType: "User",
      entityId: updatedUser.id,
      metadata: {
        previousRole: existingUser.role.code,
        nextRole: updatedUser.role.code
      }
    });
  }

  return updatedUser;
}

export async function deactivateUser(actor: Actor, userId: string) {
  return updateUser(actor, userId, {
    status: "INACTIVE"
  } satisfies UpdateUserSchema);
}

export async function listUsers(actor: Actor, rawFilters: unknown) {
  assertCanManageUsers(actor);
  const filters = listUsersSchema.parse(rawFilters);

  return prisma.user.findMany({
    where: {
      OR: filters.q
        ? [
            {
              name: {
                contains: filters.q,
                mode: "insensitive"
              }
            },
            {
              email: {
                contains: filters.q,
                mode: "insensitive"
              }
            }
          ]
        : undefined,
      status: filters.status,
      companyId: filters.companyId,
      role: filters.roleCode ? { code: filters.roleCode } : undefined
    },
    include: {
      role: true,
      company: true
    },
    orderBy: { createdAt: "desc" }
  });
}
