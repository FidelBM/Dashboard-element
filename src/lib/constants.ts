import {
  Award,
  BarChart3,
  Gift,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Truck,
  Users
} from "lucide-react";

export const tierRanges = {
  BASE: { min: 0, max: 40, label: "Base", color: "bg-slate-500" },
  PARTNER: { min: 41, max: 60, label: "Socio", color: "bg-blue-600" },
  ELITE: { min: 61, max: 80, label: "Élite", color: "bg-cyan-500" },
  STRATEGIC: { min: 81, max: 100, label: "Estratégico", color: "bg-emerald-500" }
} as const;

export const tierOrder = ["BASE", "PARTNER", "ELITE", "STRATEGIC"] as const;

export const navigation = [
  { href: "/dashboard", label: "Panel principal", icon: LayoutDashboard, roles: ["ALL"] },
  { href: "/fleet", label: "Mi Flota", icon: Truck, roles: ["ALL"] },
  { href: "/benefits", label: "Beneficios", icon: Gift, roles: ["ALL"] },
  { href: "/analytics", label: "Análisis", icon: BarChart3, roles: ["ALL"] },
  { href: "/incentives", label: "Incentivos", icon: Award, roles: ["ALL"] },
  {
    href: "/users",
    label: "Usuarios",
    icon: Users,
    roles: ["SUPER_ADMIN", "ADMIN_ELEMENT"]
  },
  {
    href: "/admin/users-access",
    label: "Acceso admin",
    icon: Users,
    roles: ["SUPER_ADMIN", "ADMIN_ELEMENT"]
  },
  {
    href: "/settings",
    label: "Configuración",
    icon: Settings,
    roles: ["SUPER_ADMIN", "ADMIN_ELEMENT"]
  },
  {
    href: "/customers",
    label: "Cuentas",
    icon: ShieldCheck,
    roles: ["SUPER_ADMIN", "ADMIN_ELEMENT", "ANALYST_OPERATIONS"]
  }
] as const;

export const roleLabels = {
  SUPER_ADMIN: "Superadministrador",
  ADMIN_ELEMENT: "Admin Element",
  FLEET_MANAGER: "Gestor de flota",
  ANALYST_OPERATIONS: "Operaciones / Analista"
} as const;
