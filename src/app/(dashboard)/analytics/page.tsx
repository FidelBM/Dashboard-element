import { requireAuth } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { PageContainer } from "@/components/page-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendLineChart, DualBarChart } from "@/components/charts";
import { EmptyState } from "@/components/empty-state";
import { formatDate } from "@/lib/utils";

export default async function AnalyticsPage() {
  const session = await requireAuth();
  const companyId = session.user.companyId ?? (await prisma.company.findFirst())?.id;

  if (!companyId) {
    return (
      <PageContainer>
        <EmptyState title="Sin datos analíticos" description="No hay empresas disponibles para analizar." />
      </PageContainer>
    );
  }

  const [profile, purchases] = await Promise.all([
    prisma.loyaltyProfile.findUnique({
      where: { companyId },
      include: {
        scoreHistory: {
          orderBy: { recordedAt: "asc" }
        }
      }
    }),
    prisma.purchase.findMany({
      where: { companyId },
      orderBy: { purchasedAt: "asc" }
    })
  ]);

  if (!profile) {
    return (
      <PageContainer>
        <EmptyState
          title="Perfil de lealtad no disponible"
          description="La analítica se mostrará cuando exista un perfil de lealtad calculado."
        />
      </PageContainer>
    );
  }

  const scoreTrend = profile.scoreHistory.map((entry) => ({
    label: formatDate(entry.recordedAt, "dd/MM"),
    score: entry.score
  }));
  const purchaseTrend = purchases.map((purchase) => ({
    label: formatDate(purchase.purchasedAt, "dd/MM"),
    amount: Number(purchase.amount),
    points: purchase.pointsAwarded
  }));
  const pillarHistory = profile.scoreHistory.map((entry) => ({
    label: formatDate(entry.recordedAt, "dd/MM"),
    tenure: entry.tenureScore,
    services: entry.serviceUsageScore
  }));

  return (
    <PageContainer>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Evolución del puntaje de lealtad</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendLineChart data={scoreTrend} dataKey="score" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Compras vs puntos generados</CardTitle>
          </CardHeader>
          <CardContent>
            <DualBarChart data={purchaseTrend} firstKey="amount" secondKey="points" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tendencia de pilares</CardTitle>
          </CardHeader>
          <CardContent>
            <DualBarChart data={pillarHistory} firstKey="tenure" secondKey="services" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Resumen analítico</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Nivel actual</p>
              <p className="mt-2 font-display text-4xl font-bold text-primary">{profile.tier === "PARTNER" ? "SOCIO" : profile.tier === "ELITE" ? "ÉLITE" : profile.tier === "STRATEGIC" ? "ESTRATÉGICO" : "BASE"}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Renovación</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{profile.renewalScore}%</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Uso de servicios</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{profile.serviceUsageScore}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
