import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { RoleCode } from "@prisma/client";
import { requireRole } from "@/lib/auth/session";

export const ADMIN_USERS_ACCESS_COOKIE = "element_admin_users_access";
export const ADMIN_USERS_ACCESS_MAX_AGE = 60 * 30;

export function getAdminPagePassword() {
  // Demo/development fallback. In production this should be replaced with ADMIN_PAGE_PASSWORD.
  return process.env.ADMIN_PAGE_PASSWORD || "contraseña123";
}

export function getAdminUsersAccessCookieValue(userId: string) {
  return `granted:${userId}`;
}

export async function hasAdminUsersPageAccess(userId: string) {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_USERS_ACCESS_COOKIE)?.value === getAdminUsersAccessCookieValue(userId);
}

export async function requireAdminPageAccess() {
  const session = await requireRole([RoleCode.SUPER_ADMIN, RoleCode.ADMIN_ELEMENT]);
  const allowed = await hasAdminUsersPageAccess(session.user.id);

  if (!allowed) {
    redirect("/admin/users-access");
  }

  return session;
}
