"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { RoleCode } from "@prisma/client";
import { Menu } from "lucide-react";
import { navigation } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type AppSidebarProps = {
  role: RoleCode;
  open: boolean;
  onToggle: () => void;
};

export function AppSidebar({ role, open, onToggle }: AppSidebarProps) {
  const pathname = usePathname();
  const items = navigation.filter((item) => {
    const allowedRoles = item.roles as readonly string[];
    return allowedRoles.includes("ALL") || allowedRoles.includes(role);
  });

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-30 bg-slate-950/50 transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onToggle}
      />
      <aside
        className={cn(
          "panel-dark fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-white/10 px-5 py-6 text-white shadow-[0_30px_80px_rgba(2,6,23,0.45)] transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="mb-10 flex items-center justify-between">
          <div>
            <p className="font-display text-2xl font-bold tracking-[0.15em] text-cyan-300">Element</p>
            <p className="mt-1 text-sm text-slate-300">Lealtad+ / Elite Fleet</p>
          </div>
          <Button variant="ghost" className="lg:hidden text-white hover:bg-white/10" onClick={onToggle}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        <nav className="grid gap-2.5">
          {items.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-gradient-to-r from-white to-slate-100 text-slate-950 shadow-[0_12px_32px_rgba(255,255,255,0.12)]"
                    : "text-slate-300 hover:bg-white/8 hover:text-white"
                )}
              >
                <Icon className={cn("h-4 w-4 transition-transform group-hover:scale-105", active ? "text-primary" : "text-slate-400")} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto rounded-[1.75rem] border border-cyan-400/20 bg-gradient-to-br from-cyan-400/12 to-blue-500/8 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Ruta a 2026</p>
          <p className="mt-2 text-sm text-slate-200">
            Campañas del Mundial activas y recompensas exclusivas listas para demostración ejecutiva.
          </p>
        </div>
      </aside>
    </>
  );
}
