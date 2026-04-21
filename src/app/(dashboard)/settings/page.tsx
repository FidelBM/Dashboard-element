import { RoleCode } from "@prisma/client";
import { requireRole } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { tierRanges } from "@/lib/constants";
import { PageContainer } from "@/components/page-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CampaignForm } from "@/components/forms/campaign-form";
import { RewardForm } from "@/components/forms/reward-form";
import { ManualPointsAdjustForm } from "@/components/forms/manual-points-adjust-form";
import { DataTable } from "@/components/data-table";

export default async function SettingsPage() {
  await requireRole([RoleCode.SUPER_ADMIN, RoleCode.ADMIN_ELEMENT]);
  const [rules, categories, campaigns, companies] = await Promise.all([
    prisma.incentiveRule.findMany({
      where: { active: true },
      orderBy: { createdAt: "asc" }
    }),
    prisma.rewardCategory.findMany({
      orderBy: { name: "asc" }
    }),
    prisma.campaign.findMany({
      orderBy: { startsAt: "desc" }
    }),
    prisma.company.findMany({
      orderBy: { name: "asc" }
    })
  ]);

  return (
    <PageContainer>
      <div className="grid gap-6 xl:grid-cols-3">
        {Object.entries(tierRanges).map(([tier, range]) => (
          <Card key={tier}>
            <CardHeader>
              <CardTitle>{range.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-display text-4xl font-bold text-primary">
                {range.min} - {range.max}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">Rango configurado de score para este nivel.</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <CampaignForm />
        <RewardForm categories={categories} campaigns={campaigns} />
      </div>

      <ManualPointsAdjustForm companies={companies} />

      <Card>
        <CardHeader>
          <CardTitle>Reglas activas de puntos</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            rows={rules}
            columns={[
              { key: "name", title: "Regla", render: (rule) => rule.name },
              { key: "type", title: "Tipo", render: (rule) => rule.ruleType },
              { key: "threshold", title: "Umbral", render: (rule) => (rule.threshold ? String(rule.threshold) : "-") },
              { key: "points", title: "Puntos", render: (rule) => `+${rule.points}` }
            ]}
          />
        </CardContent>
      </Card>
    </PageContainer>
  );
}
