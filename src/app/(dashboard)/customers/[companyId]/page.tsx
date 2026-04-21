import { notFound } from "next/navigation";
import { RoleCode } from "@prisma/client";
import { requireCompanyAccess, requireRole } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { PageContainer } from "@/components/page-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/metric-card";
import { TierBadge } from "@/components/tier-badge";
import { DataTable } from "@/components/data-table";
import { InsightAlert } from "@/components/insight-alert";
import { formatCurrency, formatDate } from "@/lib/utils";
import { getActivityTypeLabel } from "@/lib/presentation";

type CustomerDetailPageProps = {
  params: Promise<{
    companyId: string;
  }>;
};

export default async function CustomerDetailPage({ params }: CustomerDetailPageProps) {
  const { companyId } = await params;
  await requireRole([RoleCode.SUPER_ADMIN, RoleCode.ADMIN_ELEMENT, RoleCode.ANALYST_OPERATIONS]);
  await requireCompanyAccess(companyId);

  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: {
      loyaltyProfile: {
        include: {
          scoreHistory: {
            orderBy: { recordedAt: "desc" }
          },
          pointTransactions: {
            orderBy: { createdAt: "desc" },
            take: 10
          }
        }
      },
      purchases: {
        orderBy: { purchasedAt: "desc" },
        take: 10
      },
      redemptions: {
        include: {
          reward: true
        },
        orderBy: { redeemedAt: "desc" }
      },
      fleet: true
    }
  });

  if (!company || !company.loyaltyProfile) {
    notFound();
  }

  const atRisk = company.loyaltyProfile.renewalScore < 40;

  return (
    <PageContainer>
      <div className="grid gap-6 xl:grid-cols-4">
        <MetricCard title="Empresa" value={company.name} description={company.industry ?? "Sin industria"} />
        <MetricCard title="Puntaje de lealtad" value={company.loyaltyProfile.loyaltyScore} description="Puntaje actual" />
        <MetricCard title="Puntos totales" value={company.loyaltyProfile.totalPoints} description="Saldo disponible" />
        <Card>
          <CardContent className="flex h-full items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">Nivel actual</p>
              <div className="mt-3">
                <TierBadge tier={company.loyaltyProfile.tier} />
              </div>
            </div>
            {atRisk ? <InsightAlert message="Señal de riesgo: renovación baja, sugerida intervención." tone="warning" /> : null}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Compras recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              rows={company.purchases}
              columns={[
                { key: "title", title: "Movimiento", render: (purchase) => purchase.title },
                { key: "date", title: "Fecha", render: (purchase) => formatDate(purchase.purchasedAt) },
                { key: "amount", title: "Monto", render: (purchase) => formatCurrency(Number(purchase.amount)) },
                { key: "points", title: "Puntos", render: (purchase) => `+${purchase.pointsAwarded}` }
              ]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Redenciones y beneficios</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              rows={company.redemptions}
              columns={[
                { key: "reward", title: "Beneficio", render: (row) => row.reward.name },
                { key: "status", title: "Estado", render: (row) => getActivityTypeLabel(row.status) },
                { key: "points", title: "Puntos", render: (row) => row.pointsSpent },
                { key: "date", title: "Fecha", render: (row) => formatDate(row.redeemedAt) }
              ]}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Actividad y trazabilidad</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            rows={company.loyaltyProfile.pointTransactions}
            columns={[
              { key: "description", title: "Evento", render: (row) => row.description },
              { key: "type", title: "Tipo", render: (row) => getActivityTypeLabel(row.type) },
              { key: "points", title: "Puntos", render: (row) => row.points },
              { key: "date", title: "Fecha", render: (row) => formatDate(row.createdAt) }
            ]}
          />
        </CardContent>
      </Card>
    </PageContainer>
  );
}
