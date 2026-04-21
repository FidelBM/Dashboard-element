import { requireAuth } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/components/dashboard-shell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAuth();
  const company = session.user.companyId
    ? await prisma.company.findUnique({
        where: { id: session.user.companyId }
      })
    : null;

  return (
    <DashboardShell userName={session.user.name ?? "Usuario"} role={session.user.role} companyName={company?.name}>
      {children}
    </DashboardShell>
  );
}
