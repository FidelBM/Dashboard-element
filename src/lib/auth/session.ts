import { redirect } from "next/navigation";
import { RoleCode } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/prisma";
import { canViewGlobalAccounts } from "@/lib/services/access";

export async function getCurrentSession() {
  return getServerSession(authOptions);
}

export async function requireAuth() {
  const session = await getCurrentSession();
  if (!session?.user) {
    redirect("/login");
  }

  return session;
}

export async function requireRole(roles: RoleCode[]) {
  const session = await requireAuth();
  if (!roles.includes(session.user.role)) {
    redirect("/dashboard");
  }

  return session;
}

export async function requireUserSession() {
  return requireAuth();
}

export async function requireCompanyAccess(companyId: string) {
  const session = await requireAuth();
  if (canViewGlobalAccounts(session.user.role)) {
    return session;
  }

  if (session.user.companyId !== companyId) {
    redirect("/dashboard");
  }

  return session;
}

export async function getCurrentUserRecord() {
  const session = await requireAuth();
  return prisma.user.findUniqueOrThrow({
    where: { id: session.user.id },
    include: {
      role: true,
      company: true
    }
  });
}
