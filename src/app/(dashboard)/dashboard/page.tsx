import { Award, Coins, Gift, Trophy } from "lucide-react";
import { RoleCode } from "@prisma/client";
import { requireAuth } from "@/lib/auth/session";
import { getDashboardSummary } from "@/lib/services/dashboard";
import { PageContainer } from "@/components/page-container";
import { ScoreGaugeCard } from "@/components/score-gauge-card";
import { MetricCard } from "@/components/metric-card";
import { DonutDistributionCard } from "@/components/donut-distribution-card";
import { LoyaltyPillarCard } from "@/components/loyalty-pillar-card";
import { RewardCard } from "@/components/reward-card";
import { CampaignCard } from "@/components/campaign-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { InsightAlert } from "@/components/insight-alert";
import { getActivityTypeLabel } from "@/lib/presentation";
import { formatDate } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await requireAuth();
  const summary = await getDashboardSummary(
    {
      role: session.user.role as RoleCode,
      companyId: session.user.companyId
    },
    session.user.companyId ?? undefined
  );

  return (
    <PageContainer>
      <ScoreGaugeCard
        score={summary.loyalty.loyaltyScore}
        tier={summary.loyalty.tier}
        nextTier={summary.loyalty.nextTier}
        progress={summary.loyalty.progressToNextTier}
        pointsToNextTier={summary.loyalty.pointsToNextTier}
        nextBenefit={summary.nextBenefit?.name}
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Puntos por compras"
          value={summary.loyalty.purchasePoints}
          description="Acumulación vinculada a compras de flotilla"
          icon={Coins}
        />
        <MetricCard
          title="Recompensas sugeridas"
          value={summary.recommendedRewards.length}
          description="Beneficios activos en este momento"
          icon={Gift}
        />
        <MetricCard
          title="Campañas Mundial"
          value={summary.campaigns.length}
          description="Activaciones del Mundial visibles actualmente"
          icon={Trophy}
        />
        <MetricCard
          title="Puntos faltantes"
          value={summary.loyalty.pointsToNextTier}
          description="Distancia hacia el siguiente nivel"
          icon={Award}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_1fr]">
        <DonutDistributionCard
          values={{
            tenure: summary.loyalty.scoreBreakdown.tenure,
            serviceUsage: summary.loyalty.scoreBreakdown.serviceUsage,
            fleetSize: summary.loyalty.scoreBreakdown.fleetSize,
            renewal: summary.loyalty.scoreBreakdown.renewal
          }}
        />

        <Card>
          <CardHeader>
            <CardTitle>Recomendaciones automáticas</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {summary.recommendations.map((recommendation) => (
              <InsightAlert key={recommendation} message={recommendation} />
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <LoyaltyPillarCard
          label="Antigüedad"
          value={summary.loyalty.scoreBreakdown.tenure}
          description="Estabilidad histórica de la relación comercial."
        />
        <LoyaltyPillarCard
          label="Uso de servicios"
          value={summary.loyalty.scoreBreakdown.serviceUsage}
          description="Adopción del ecosistema y multiproducto Element."
        />
        <LoyaltyPillarCard
          label="Tamaño de flotilla"
          value={summary.loyalty.scoreBreakdown.fleetSize}
          description="Escala activa de unidades y crecimiento de cuenta."
        />
        <LoyaltyPillarCard
          label="Renovación y comportamiento"
          value={summary.loyalty.scoreBreakdown.renewal}
          description="Calidad de renovación, recurrencia y cumplimiento."
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Actividad reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              rows={summary.activity}
              columns={[
                {
                  key: "description",
                  title: "Actividad",
                  render: (row) => (
                    <div>
                      <p className="font-semibold text-slate-900">{row.description}</p>
                      <p className="text-xs text-muted-foreground">{getActivityTypeLabel(String(row.type))}</p>
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
                  title: "Impacto",
                  render: (row) => (
                    <span className="font-semibold text-cyan-700">
                      {Number(row.points) > 0 ? "+" : ""}
                      {row.points}
                    </span>
                  )
                }
              ]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recompensas recomendadas</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {summary.recommendedRewards.slice(0, 3).map((reward) => (
              <RewardCard
                key={reward.id}
                reward={reward}
                companyId={summary.company.id}
                canRedeem={Boolean(session.user.companyId)}
                isEligible={summary.loyalty.totalPoints >= reward.pointsCost}
              />
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Campañas activas del Mundial</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {summary.campaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
