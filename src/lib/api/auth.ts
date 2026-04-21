import { getServerSession } from "next-auth";
import { RoleCode } from "@prisma/client";
import { authOptions } from "@/lib/auth/options";
import { AppError } from "@/lib/errors";
import { canViewGlobalAccounts } from "@/lib/services/access";

export async function requireApiAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new AppError("Unauthorized.", 401, "UNAUTHORIZED");
  }

  return session;
}

export async function requireApiRole(roles: RoleCode[]) {
  const session = await requireApiAuth();
  if (!roles.includes(session.user.role)) {
    throw new AppError("Forbidden.", 403, "FORBIDDEN");
  }

  return session;
}

export async function requireApiCompanyAccess(companyId: string) {
  const session = await requireApiAuth();
  if (canViewGlobalAccounts(session.user.role)) {
    return session;
  }

  if (session.user.companyId !== companyId) {
    throw new AppError("Forbidden company access.", 403, "FORBIDDEN_COMPANY_ACCESS");
  }

  return session;
}
