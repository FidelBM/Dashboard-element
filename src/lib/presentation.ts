import { LoyaltyTier, RoleCode, UserStatus } from "@prisma/client";
import { roleLabels, tierRanges } from "@/lib/constants";

export function getTierLabel(tier: LoyaltyTier | string) {
  return tierRanges[tier as LoyaltyTier]?.label ?? tier;
}

export function getTierTone(tier: LoyaltyTier | string) {
  switch (tier) {
    case "BASE":
      return "slate";
    case "PARTNER":
      return "blue";
    case "ELITE":
      return "cyan";
    case "STRATEGIC":
      return "green";
    default:
      return "outline";
  }
}

export function getStatusTone(status: UserStatus | "ACTIVE" | "INACTIVE") {
  return status === "ACTIVE" ? "green" : "slate";
}

export function getRoleLabel(role: RoleCode | string) {
  return roleLabels[role as RoleCode] ?? role;
}

export function getActivityTypeLabel(type: string) {
  const labels: Record<string, string> = {
    EARNED: "Puntos obtenidos",
    ADJUSTMENT: "Ajuste manual",
    REDEMPTION: "Redención",
    BONUS: "Bono",
    PURCHASE: "Compra",
    PURCHASE_AMOUNT: "Compra por monto",
    VEHICLE_ADDITION: "Alta de vehículos",
    EARLY_RENEWAL: "Renovación anticipada",
    MULTI_PRODUCT: "Uso multiproducto",
    POSITIVE_BEHAVIOR: "Comportamiento positivo",
    ECOSYSTEM_USAGE: "Uso del ecosistema",
    STANDARD: "Estándar",
    WORLD_CUP: "Mundial",
    PENDING: "Pendiente",
    APPROVED: "Aprobada",
    FULFILLED: "Completada",
    REJECTED: "Rechazada",
    ACTIVE: "Activo",
    INACTIVE: "Inactivo"
  };

  return labels[type] ?? type;
}

export function getPillarSignal(value: number) {
  if (value >= 75) return "ALTO";
  if (value >= 45) return "MEDIO";
  return "BAJO";
}
