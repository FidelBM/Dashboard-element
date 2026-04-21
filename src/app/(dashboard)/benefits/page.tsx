import { requireAuth } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { PageContainer } from "@/components/page-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RewardCard } from "@/components/reward-card";
import { EmptyState } from "@/components/empty-state";
import { tierOrder } from "@/lib/constants";

export default async function BenefitsPage() {
  const session = await requireAuth();
  const companyId = session.user.companyId ?? undefined;
  const [profile, rewards] = await Promise.all([
    companyId
      ? prisma.loyaltyProfile.findUnique({
          where: { companyId }
        })
      : null,
    prisma.reward.findMany({
      include: {
        category: true,
        campaign: true,
        worldCup: true,
        redemptions: companyId ? { where: { companyId } } : true
      },
      orderBy: [{ category: { name: "asc" } }, { pointsCost: "asc" }]
    })
  ]);

  const standardRewards = rewards.filter((reward) => !reward.category.isWorldCup);
  const worldCupRewards = rewards.filter((reward) => reward.category.isWorldCup);

  return (
    <PageContainer>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Catálogo de beneficios</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-8">
            {[
              { title: "Beneficios estándar", items: standardRewards },
              { title: "Experiencias Mundial 2026", items: worldCupRewards }
            ].map((section) => (
              <section key={section.title} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-2xl font-bold text-primary">{section.title}</h2>
                  <p className="text-sm text-muted-foreground">{section.items.length} beneficios visibles</p>
                </div>
                {section.items.length === 0 ? (
                  <EmptyState
                    title="Sin recompensas disponibles"
                    description="El catálogo se llenará cuando existan beneficios publicados para este programa."
                  />
                ) : (
                  <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {section.items.map((reward) => {
                      const isEligible = profile
                        ? tierOrder.indexOf(profile.tier) >= tierOrder.indexOf(reward.minTier) &&
                          profile.totalPoints >= reward.pointsCost
                        : false;
                      return (
                        <RewardCard
                          key={reward.id}
                          reward={reward}
                          companyId={companyId}
                          canRedeem={Boolean(companyId)}
                          isEligible={isEligible}
                          alreadyRedeemed={reward.redemptions.length > 0}
                        />
                      );
                    })}
                  </div>
                )}
              </section>
            ))}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
