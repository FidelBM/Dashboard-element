import { NextResponse } from "next/server";
import { requireApiRole } from "@/lib/api/auth";
import { handleRouteError, ok } from "@/lib/http";
import { createAuditLog } from "@/lib/services/audit";
import { adminPageAccessSchema } from "@/lib/validators/admin";
import {
  ADMIN_USERS_ACCESS_COOKIE,
  ADMIN_USERS_ACCESS_MAX_AGE,
  getAdminPagePassword,
  getAdminUsersAccessCookieValue
} from "@/lib/admin-access";

export async function POST(request: Request) {
  try {
    const session = await requireApiRole(["SUPER_ADMIN", "ADMIN_ELEMENT"]);
    const body = adminPageAccessSchema.parse(await request.json());
    const success = body.password === getAdminPagePassword();

    await createAuditLog({
      actorId: session.user.id,
      actorName: session.user.name ?? null,
      action: success ? "ADMIN_USERS_ACCESS_GRANTED" : "ADMIN_USERS_ACCESS_FAILED",
      entityType: "AdminUsersAccess",
      entityId: session.user.id,
      metadata: {
        role: session.user.role
      }
    });

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_ADMIN_PAGE_PASSWORD",
            message: "La contraseña adicional es incorrecta."
          }
        },
        { status: 401 }
      );
    }

    const response = ok({ granted: true });
    response.cookies.set(ADMIN_USERS_ACCESS_COOKIE, getAdminUsersAccessCookieValue(session.user.id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/admin",
      maxAge: ADMIN_USERS_ACCESS_MAX_AGE
    });

    return response;
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE() {
  try {
    const session = await requireApiRole(["SUPER_ADMIN", "ADMIN_ELEMENT"]);
    const response = ok({ cleared: true });
    response.cookies.set(ADMIN_USERS_ACCESS_COOKIE, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/admin",
      maxAge: 0
    });

    await createAuditLog({
      actorId: session.user.id,
      actorName: session.user.name ?? null,
      action: "ADMIN_USERS_ACCESS_CLEARED",
      entityType: "AdminUsersAccess",
      entityId: session.user.id
    });

    return response;
  } catch (error) {
    return handleRouteError(error);
  }
}
