import { Coins, Sparkles, TicketPercent, Trophy } from "lucide-react";
import { requireAuth } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { PageContainer } from "@/components/page-container";
import { MetricCard } from "@/components/metric-card";
import { CampaignCard } from "@/components/campaign-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { EmptyState } from "@/components/empty-state";
import { formatDate } from "@/lib/utils";
import { getActivityTypeLabel } from "@/lib/presentation";

export default async function IncentivesPage() {
  const session = await requireAuth();
  const companyId = session.user.companyId;
  const [rules, campaigns, profile, history] = await Promise.all([
    prisma.incentiveRule.findMany({
      where: { active: true },
      orderBy: { createdAt: "asc" }
    }),
    prisma.campaign.findMany({
      where: { active: true },
      orderBy: { startsAt: "asc" }
    }),
    companyId
      ? prisma.loyaltyProfile.findUnique({
          where: { companyId }
        })
      : null,
    companyId
      ? prisma.pointTransaction.findMany({
          where: { companyId },
          orderBy: { createdAt: "desc" }
        })
      : []
  ]);

  return (
    <PageContainer>
      <div className="grid gap-6 xl:grid-cols-4">
        <MetricCard title="Puntos acumulados" value={profile?.totalPoints ?? 0} icon={Coins} />
        <MetricCard title="Puntos usados" value={profile?.redeemedPoints ?? 0} icon={TicketPercent} />
        <MetricCard title="Campañas activas" value={campaigns.length} icon={Sparkles} />
        <MetricCard
          title="Campañas Mundial"
          value={campaigns.filter((campaign) => campaign.type === "WORLD_CUP").length}
          icon={Trophy}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Reglas de acumulación</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              rows={rules}
              columns={[
                {
                  key: "name",
                  title: "Regla",
                  render: (rule) => (
                    <div>
                      <p className="font-semibold text-slate-900">{rule.name}</p>
                      <p className="text-xs text-muted-foreground">{rule.description}</p>
                    </div>
                  )
                },
                {
                  key: "type",
                  title: "Tipo",
                  render: (rule) => getActivityTypeLabel(rule.ruleType)
                },
                {
                  key: "points",
                  title: "Puntos",
                  render: (rule) => <span className="font-semibold text-cyan-700">+{rule.points}</span>
                }
              ]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Campañas activas</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {campaigns.length === 0 ? (
              <EmptyState
                title="Sin campañas activas"
                description="Cuando existan campañas publicadas aparecerán aquí."
              />
            ) : (
              campaigns.map((campaign) => <CampaignCard key={campaign.id} campaign={campaign} />)
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historial de movimientos de puntos</CardTitle>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <EmptyState
              title="Sin historial disponible"
              description="Los movimientos de puntos aparecerán cuando haya actividad en la empresa."
            />
          ) : (
            <DataTable
              rows={history}
              columns={[
                {
                  key: "description",
                  title: "Movimiento",
                  render: (row) => (
                    <div>
                      <p className="font-semibold text-slate-900">{row.description}</p>
                      <p className="text-xs text-muted-foreground">{getActivityTypeLabel(row.type)}</p>
                    </div>
                  )
                },
                {
                  key: "createdAt",
                  title: "Fecha",
                  render: (row) => formatDate(row.createdAt)
                },
                {
                  key: "points",
                  title: "Puntos",
                  render: (row) => (
                    <span className={row.points >= 0 ? "font-semibold text-emerald-700" : "font-semibold text-rose-700"}>
                      {row.points > 0 ? "+" : ""}
                      {row.points}
                    </span>
                  )
                }
              ]}
            />
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
