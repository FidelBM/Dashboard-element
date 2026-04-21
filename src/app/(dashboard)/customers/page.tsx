import Link from "next/link";
import { RoleCode } from "@prisma/client";
import { requireRole } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { PageContainer } from "@/components/page-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { TierBadge } from "@/components/tier-badge";
import { Button } from "@/components/ui/button";
import { getTierLabel } from "@/lib/presentation";

export default async function CustomersPage() {
  await requireRole([RoleCode.SUPER_ADMIN, RoleCode.ADMIN_ELEMENT, RoleCode.ANALYST_OPERATIONS]);
  const companies = await prisma.company.findMany({
    include: {
      loyaltyProfile: true,
      fleet: true
    },
    orderBy: { name: "asc" }
  });

  return (
    <PageContainer>
      <Card>
        <CardHeader>
          <CardTitle>Cuentas activas</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            rows={companies}
            columns={[
              {
                key: "name",
                title: "Empresa",
                render: (company) => (
                  <div>
                    <p className="font-semibold text-slate-900">{company.name}</p>
                    <p className="text-xs text-muted-foreground">{company.industry}</p>
                  </div>
                )
              },
              {
                key: "tier",
                title: "Nivel",
                render: (company) => (
                  <div className="flex items-center gap-3">
                    <TierBadge tier={company.loyaltyProfile?.tier ?? "BASE"} />
                    <span className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                      {getTierLabel(company.loyaltyProfile?.tier ?? "BASE")}
                    </span>
                  </div>
                )
              },
              {
                key: "score",
                title: "Puntaje",
                render: (company) => company.loyaltyProfile?.loyaltyScore ?? 0
              },
              {
                key: "fleet",
                title: "Flota activa",
                render: (company) => company.fleet?.activeVehicles ?? 0
              },
              {
                key: "actions",
                title: "Detalle",
                render: (company) => (
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/customers/${company.id}`}>Ver cuenta</Link>
                  </Button>
                )
              }
            ]}
          />
        </CardContent>
      </Card>
    </PageContainer>
  );
}
