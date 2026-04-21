import { CarFront, ChartColumnIncreasing, Coins, PackageOpen } from "lucide-react";
import { requireAuth } from "@/lib/auth/session";
import { getFleetSummary, listPurchases } from "@/lib/services/fleet";
import { PageContainer } from "@/components/page-container";
import { MetricCard } from "@/components/metric-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { formatCurrency, formatDate } from "@/lib/utils";
import { PurchaseForm } from "@/components/forms/purchase-form";
import { EmptyState } from "@/components/empty-state";

export default async function FleetPage() {
  const session = await requireAuth();
  const companyId = session.user.companyId;

  if (!companyId) {
    return (
      <PageContainer>
        <EmptyState
          title="No hay empresa asignada"
          description="Este usuario no tiene contexto de empresa para visualizar la flota."
        />
      </PageContainer>
    );
  }

  const [summary, purchases] = await Promise.all([
    getFleetSummary(
      {
        id: session.user.id,
        name: session.user.name,
        role: session.user.role,
        companyId: session.user.companyId
      },
      companyId
    ),
    listPurchases(
      {
        id: session.user.id,
        name: session.user.name,
        role: session.user.role,
        companyId: session.user.companyId
      },
      {
        companyId
      }
    )
  ]);

  return (
    <PageContainer>
      <div className="grid gap-6 xl:grid-cols-4">
        <MetricCard title="Vehículos activos" value={summary.fleet?.activeVehicles ?? 0} icon={CarFront} />
        <MetricCard
          title="Compras registradas"
          value={purchases.length}
          description="Eventos ligados a puntos e incentivos"
          icon={PackageOpen}
        />
        <MetricCard
          title="Puntos generados"
          value={purchases.reduce((sum, purchase) => sum + purchase.pointsAwarded, 0)}
          icon={Coins}
        />
        <MetricCard
          title="Crecimiento de flotilla"
          value={purchases.reduce((sum, purchase) => sum + purchase.vehiclesAdded, 0)}
          icon={ChartColumnIncreasing}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Historial de compras y ampliaciones</CardTitle>
          </CardHeader>
          <CardContent>
            {purchases.length === 0 ? (
              <EmptyState
                title="Sin compras registradas"
                description="Cuando existan compras o renovaciones aparecerán aquí con sus puntos."
              />
            ) : (
              <DataTable
                rows={purchases}
                columns={[
                  {
                    key: "title",
                    title: "Movimiento",
                    render: (purchase) => (
                      <div>
                        <p className="font-semibold text-slate-900">{purchase.title}</p>
                        <p className="text-xs text-muted-foreground">{purchase.type}</p>
                      </div>
                    )
                  },
                  {
                    key: "date",
                    title: "Fecha",
                    render: (purchase) => formatDate(purchase.purchasedAt)
                  },
                  {
                    key: "amount",
                    title: "Monto",
                    render: (purchase) => formatCurrency(Number(purchase.amount))
                  },
                  {
                    key: "vehicles",
                    title: "Vehículos",
                    render: (purchase) => purchase.vehiclesAdded
                  },
                  {
                    key: "points",
                    title: "Puntos",
                    render: (purchase) => <span className="font-semibold text-cyan-700">+{purchase.pointsAwarded}</span>
                  }
                ]}
              />
            )}
          </CardContent>
        </Card>

        <PurchaseForm companyId={companyId} />
      </div>
    </PageContainer>
  );
}
