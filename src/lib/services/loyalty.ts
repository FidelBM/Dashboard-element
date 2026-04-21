import { LoyaltyTier, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { tierOrder, tierRanges } from "@/lib/constants";

type ScoreInput = {
  companyCreatedAt: Date;
  activeVehicles: number;
  purchases: Array<{
    additionalServices: number;
    ecosystemUsage: number;
    renewedEarly: boolean;
    positiveBehavior: boolean;
  }>;
};

export type PillarBreakdown = {
  tenureScore: number;
  serviceUsageScore: number;
  fleetSizeScore: number;
  renewalScore: number;
};

export function classifyLoyaltyTier(score: number): LoyaltyTier {
  if (score <= tierRanges.BASE.max) return LoyaltyTier.BASE;
  if (score <= tierRanges.PARTNER.max) return LoyaltyTier.PARTNER;
  if (score <= tierRanges.ELITE.max) return LoyaltyTier.ELITE;
  return LoyaltyTier.STRATEGIC;
}

export function getTierFromScore(score: number) {
  return classifyLoyaltyTier(score);
}

export function getNextTier(tier: LoyaltyTier) {
  const currentIndex = tierOrder.indexOf(tier);
  return tierOrder[currentIndex + 1] ?? null;
}

export function calculateLoyaltyScore(input: ScoreInput) {
  const today = new Date();
  const tenureMonths = Math.max(
    1,
    (today.getFullYear() - input.companyCreatedAt.getFullYear()) * 12 +
      (today.getMonth() - input.companyCreatedAt.getMonth())
  );
  const tenureScore = Math.min(100, Math.round((tenureMonths / 48) * 100));
  const serviceSignals = input.purchases.reduce(
    (accumulator, purchase) => accumulator + purchase.additionalServices + purchase.ecosystemUsage,
    0
  );
  const serviceUsageScore = Math.min(
    100,
    Math.round((serviceSignals / Math.max(12, input.purchases.length * 5)) * 100)
  );
  const fleetSizeScore = Math.min(100, Math.round((input.activeVehicles / 250) * 100));
  const renewalSignals = input.purchases.filter(
    (purchase) => purchase.renewedEarly || purchase.positiveBehavior
  ).length;
  const renewalScore = Math.min(
    100,
    Math.round((renewalSignals / Math.max(1, input.purchases.length)) * 100)
  );

  const score = Math.round(
    tenureScore * 0.3 +
      serviceUsageScore * 0.3 +
      fleetSizeScore * 0.2 +
      renewalScore * 0.2
  );
  const tier = classifyLoyaltyTier(score);
  const progress = getTierProgress(score);
  const recommendations = buildRecommendations({
    score,
    tier,
    purchasePoints: 0
  });

  return {
    score,
    tier,
    nextTier: progress.nextTier,
    pointsToNextTier: progress.pointsToNextTier,
    progress: progress.progress,
    recommendations,
    pillars: {
      tenureScore,
      serviceUsageScore,
      fleetSizeScore,
      renewalScore
    }
  };
}

export function getTierProgress(score: number) {
  const tier = classifyLoyaltyTier(score);
  const range = tierRanges[tier];
  if (tier === LoyaltyTier.STRATEGIC) {
    return {
      tier,
      progress: 100,
      nextTier: null,
      pointsToNextTier: 0
    };
  }

  const nextTier = getNextTier(tier);
  const span = range.max - range.min || 1;
  const progress = Math.min(100, Math.max(0, Math.round(((score - range.min) / span) * 100)));

  return {
    tier,
    progress,
    nextTier,
    pointsToNextTier: nextTier ? tierRanges[nextTier].min - score : 0
  };
}

export function getNextReward<
  T extends {
    active: boolean;
    minTier: LoyaltyTier;
    pointsCost: number;
  }
>(rewards: T[], currentTier: LoyaltyTier, availablePoints: number) {
  return (
    rewards
      .filter((reward) => reward.active)
      .filter((reward) => tierOrder.indexOf(reward.minTier) >= tierOrder.indexOf(currentTier))
      .sort((left, right) => left.pointsCost - right.pointsCost)
      .find((reward) => reward.pointsCost >= availablePoints) ?? null
  );
}

export function buildRecommendations(input: {
  score: number;
  tier: LoyaltyTier;
  purchasePoints: number;
  nextCampaignName?: string;
}) {
  const progress = getTierProgress(input.score);
  const recommendations: string[] = [];

  if (progress.pointsToNextTier > 0 && progress.nextTier) {
    recommendations.push(`Faltan ${progress.pointsToNextTier} puntos para subir a ${progress.nextTier}.`);
  }

  if (input.purchasePoints > 180) {
    recommendations.push("Renovación alta: candidato a beneficio premium.");
  }

  if (input.nextCampaignName) {
    recommendations.push(`${input.nextCampaignName} activa disponible.`);
  }

  return recommendations;
}

export async function recomputeCompanyLoyalty(
  companyId: string,
  options?: {
    note?: string;
    tx?: Prisma.TransactionClient;
  }
) {
  const db = options?.tx ?? prisma;
  const company = await db.company.findUniqueOrThrow({
    where: { id: companyId },
    include: {
      fleet: true,
      purchases: {
        orderBy: { purchasedAt: "desc" }
      },
      loyaltyProfile: true
    }
  });

  const evaluation = calculateLoyaltyScore({
    companyCreatedAt: company.createdAt,
    activeVehicles: company.fleet?.activeVehicles ?? 0,
    purchases: company.purchases.map((purchase) => ({
      additionalServices: purchase.additionalServices,
      ecosystemUsage: purchase.ecosystemUsage,
      renewedEarly: purchase.renewedEarly,
      positiveBehavior: purchase.positiveBehavior
    }))
  });

  const profile = company.loyaltyProfile
    ? await db.loyaltyProfile.update({
        where: { companyId },
        data: {
          loyaltyScore: evaluation.score,
          tier: evaluation.tier,
          tenureScore: evaluation.pillars.tenureScore,
          serviceUsageScore: evaluation.pillars.serviceUsageScore,
          fleetSizeScore: evaluation.pillars.fleetSizeScore,
          renewalScore: evaluation.pillars.renewalScore
        }
      })
    : await db.loyaltyProfile.create({
        data: {
          companyId,
          loyaltyScore: evaluation.score,
          tier: evaluation.tier,
          tenureScore: evaluation.pillars.tenureScore,
          serviceUsageScore: evaluation.pillars.serviceUsageScore,
          fleetSizeScore: evaluation.pillars.fleetSizeScore,
          renewalScore: evaluation.pillars.renewalScore
        }
      });

  await db.loyaltyScoreHistory.create({
    data: {
      loyaltyProfileId: profile.id,
      score: evaluation.score,
      tier: evaluation.tier,
      tenureScore: evaluation.pillars.tenureScore,
      serviceUsageScore: evaluation.pillars.serviceUsageScore,
      fleetSizeScore: evaluation.pillars.fleetSizeScore,
      renewalScore: evaluation.pillars.renewalScore,
      note: options?.note ?? "Loyalty score recomputed"
    }
  });

  return evaluation;
}
