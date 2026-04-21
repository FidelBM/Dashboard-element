import { RoleCode } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { AppError } from "@/lib/errors";
import { canViewGlobalAccounts } from "@/lib/services/access";
import { buildRecommendations, getNextReward, getTierProgress } from "@/lib/services/loyalty";

type Actor = {
  role: RoleCode;
  companyId?: string | null;
};

async function resolveTargetCompany(actor: Actor, companyId?: string) {
  if (companyId) {
    if (!canViewGlobalAccounts(actor.role) && actor.companyId !== companyId) {
      throw new AppError("Forbidden company access.", 403, "FORBIDDEN_COMPANY_ACCESS");
    }

    return companyId;
  }

  if (actor.companyId) {
    return actor.companyId;
  }

  if (canViewGlobalAccounts(actor.role)) {
    const company = await prisma.company.findFirst({
      orderBy: { createdAt: "asc" }
    });

    if (!company) {
      throw new AppError("No companies found.", 404, "COMPANY_NOT_FOUND");
    }

    return company.id;
  }

  throw new AppError("Company context is required.", 400, "COMPANY_REQUIRED");
}

export async function getDashboardSummary(actor: Actor, companyId?: string) {
  const targetCompanyId = await resolveTargetCompany(actor, companyId);
  const company = await prisma.company.findUniqueOrThrow({
    where: { id: targetCompanyId },
    include: {
      loyaltyProfile: {
        include: {
          scoreHistory: {
            orderBy: { recordedAt: "desc" },
            take: 8
          },
          pointTransactions: {
            orderBy: { createdAt: "desc" },
            take: 8
          }
        }
      },
      purchases: {
        orderBy: { purchasedAt: "desc" },
        take: 8
      },
      fleet: {
        include: {
          vehicles: true
        }
      }
    }
  });

  if (!company.loyaltyProfile) {
    throw new AppError("Loyalty profile not found.", 404, "LOYALTY_PROFILE_NOT_FOUND");
  }

  const activeWorldCupCampaigns = await prisma.campaign.findMany({
    where: {
      type: "WORLD_CUP",
      active: true,
      startsAt: { lte: new Date() },
      endsAt: { gte: new Date() }
    },
    orderBy: { startsAt: "asc" }
  });

  const availableRewards = await prisma.reward.findMany({
    where: { active: true },
    include: {
      category: true,
      campaign: true,
      worldCup: true
    },
    orderBy: { pointsCost: "asc" }
  });

  const nextReward = getNextReward(
    availableRewards,
    company.loyaltyProfile.tier,
    company.loyaltyProfile.totalPoints
  );
  const progress = getTierProgress(company.loyaltyProfile.loyaltyScore);
  const recommendations = buildRecommendations({
    score: company.loyaltyProfile.loyaltyScore,
    tier: company.loyaltyProfile.tier,
    purchasePoints: company.loyaltyProfile.purchasePoints,
    nextCampaignName: activeWorldCupCampaigns[0]?.name
  });

  return {
    company: {
      id: company.id,
      name: company.name,
      industry: company.industry
    },
    loyalty: {
      tier: company.loyaltyProfile.tier,
      loyaltyScore: company.loyaltyProfile.loyaltyScore,
      totalPoints: company.loyaltyProfile.totalPoints,
      purchasePoints: company.loyaltyProfile.purchasePoints,
      redeemedPoints: company.loyaltyProfile.redeemedPoints,
      progressToNextTier: progress.progress,
      nextTier: progress.nextTier,
      pointsToNextTier: progress.pointsToNextTier,
      scoreBreakdown: {
        tenure: company.loyaltyProfile.tenureScore,
        serviceUsage: company.loyaltyProfile.serviceUsageScore,
        fleetSize: company.loyaltyProfile.fleetSizeScore,
        renewal: company.loyaltyProfile.renewalScore
      }
    },
    nextBenefit: nextReward,
    campaigns: activeWorldCupCampaigns,
    recommendedRewards: availableRewards.slice(0, 4),
    recommendations,
    fleet: {
      activeVehicles: company.fleet?.activeVehicles ?? 0,
      growthSignals: company.purchases.reduce((sum, purchase) => sum + purchase.vehiclesAdded, 0)
    },
    activity: [
      ...company.loyaltyProfile.pointTransactions.map((transaction) => ({
        id: transaction.id,
        type: transaction.type,
        description: transaction.description,
        points: transaction.points,
        createdAt: transaction.createdAt
      })),
      ...company.purchases.map((purchase) => ({
        id: purchase.id,
        type: "PURCHASE",
        description: purchase.title,
        points: purchase.pointsAwarded,
        createdAt: purchase.purchasedAt
      }))
    ]
      .sort((left, right) => right.createdAt.getTime() - left.createdAt.getTime())
      .slice(0, 10)
  };
}
