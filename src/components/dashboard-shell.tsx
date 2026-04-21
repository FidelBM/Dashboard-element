"use client";

import { useState } from "react";
import { RoleCode } from "@prisma/client";
import { usePathname } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";

type DashboardShellProps = {
  userName: string;
  role: RoleCode;
  companyName?: string | null;
  children: React.ReactNode;
};

export function DashboardShell({ userName, role, companyName, children }: DashboardShellProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#f3f7fb]">
      <AppSidebar role={role} open={open} onToggle={() => setOpen((current) => !current)} />
      <div className="lg:pl-72">
        <AppHeader
          pathname={pathname}
          userName={userName}
          role={role}
          companyName={companyName}
          onMenuClick={() => setOpen(true)}
        />
        <main className="px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
