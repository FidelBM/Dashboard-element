"use client";

import { useMemo, useState } from "react";
import { Building2, ChevronRight, Menu, ShieldCheck } from "lucide-react";
import { RoleCode } from "@prisma/client";
import { pageMeta } from "@/lib/page-meta";
import { getRoleLabel } from "@/lib/presentation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogoutButton } from "@/components/logout-button";

type AppHeaderProps = {
  pathname: string;
  userName: string;
  role: RoleCode;
  companyName?: string | null;
  onMenuClick: () => void;
};

export function AppHeader({ pathname, userName, role, companyName, onMenuClick }: AppHeaderProps) {
  const [open, setOpen] = useState(false);
  const meta = pageMeta[pathname] ?? {
    title: "Panel Element Loyalty+",
    subtitle: "Gestión ejecutiva de lealtad y flotillas."
  };

  const breadcrumbs = useMemo(() => {
    const parts = pathname.split("/").filter(Boolean);
    const labels: Record<string, string> = {
      dashboard: "Panel",
      fleet: "Mi flota",
      benefits: "Beneficios",
      analytics: "Análisis",
      incentives: "Incentivos",
      users: "Usuarios",
      settings: "Configuración",
      customers: "Cuentas",
      admin: "Administración",
      "users-access": "Acceso",
      "admin-users": "Administración"
    };

    return parts.map((part, index) => ({
      label: labels[part] ?? decodeURIComponent(part),
      href: `/${parts.slice(0, index + 1).join("/")}`
    }));
  }, [pathname]);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/78 backdrop-blur-2xl">
      <div className="flex items-center justify-between gap-4 px-4 py-5 md:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Button variant="outline" className="lg:hidden" onClick={onMenuClick}>
            <Menu className="h-4 w-4" />
          </Button>
          <div className="min-w-0">
            <div className="mb-1 flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              <span>Element Lealtad+</span>
              {breadcrumbs.map((crumb, index) => (
                <span key={crumb.href} className="flex items-center gap-2">
                  <ChevronRight className="h-3 w-3" />
                  <span className={index === breadcrumbs.length - 1 ? "text-slate-900" : ""}>
                    {crumb.label}
                  </span>
                </span>
              ))}
            </div>
            <h1 className="truncate font-display text-[2rem] font-bold tracking-[0.01em] text-primary">{meta.title}</h1>
            <p className="truncate text-sm leading-6 text-muted-foreground">{meta.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-3 rounded-[1.35rem] border border-slate-200/80 bg-white/90 px-4 py-3 shadow-[0_10px_28px_rgba(15,23,42,0.06)] md:flex">
            <Building2 className="h-4 w-4 text-slate-500" />
            <div className="text-right">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Contexto</p>
              <p className="text-sm font-semibold text-slate-900">{companyName ?? "Vista global de Element"}</p>
            </div>
          </div>
          <div className="relative">
            <button
              type="button"
              className="flex items-center gap-3 rounded-[1.35rem] border border-slate-200/80 bg-white/92 px-4 py-3 shadow-[0_10px_28px_rgba(15,23,42,0.06)]"
              onClick={() => setOpen((current) => !current)}
            >
              <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-primary to-cyan-600 text-sm font-bold text-white">
                {userName
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-semibold text-slate-900">{userName}</p>
                <div className="mt-1 flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-cyan-500" />
                  <span className="text-xs text-muted-foreground">{getRoleLabel(role)}</span>
                </div>
              </div>
            </button>
            {open ? (
              <div className="absolute right-0 top-[calc(100%+0.5rem)] w-64 rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-panel">
                <p className="text-sm font-semibold text-slate-900">{userName}</p>
                <Badge className="mt-2" variant="outline">
                  {getRoleLabel(role)}
                </Badge>
                <p className="mt-3 text-sm text-muted-foreground">{companyName ?? "Acceso corporativo global"}</p>
                <div className="mt-4">
                  <LogoutButton />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
