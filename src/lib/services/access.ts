import { RoleCode } from "@prisma/client";

export function canManageUsers(role: RoleCode) {
  return role === RoleCode.SUPER_ADMIN || role === RoleCode.ADMIN_ELEMENT;
}

export function canViewGlobalAccounts(role: RoleCode) {
  return (
    role === RoleCode.SUPER_ADMIN ||
    role === RoleCode.ADMIN_ELEMENT ||
    role === RoleCode.ANALYST_OPERATIONS
  );
}

export function canManageSystem(role: RoleCode) {
  return role === RoleCode.SUPER_ADMIN || role === RoleCode.ADMIN_ELEMENT;
}

export function canAdjustPoints(role: RoleCode) {
  return role === RoleCode.SUPER_ADMIN || role === RoleCode.ADMIN_ELEMENT;
}

export function canRedeemRewards(role: RoleCode) {
  return role === RoleCode.FLEET_MANAGER || role === RoleCode.ADMIN_ELEMENT || role === RoleCode.SUPER_ADMIN;
}
