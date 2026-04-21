import { LoyaltyTier, PointTransactionType, Prisma, RoleCode } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { AppError } from "@/lib/errors";
import { tierOrder } from "@/lib/constants";
import { createAuditLog } from "@/lib/services/audit";
import { applyPointsToCompany } from "@/lib/services/points";
import { canManageSystem, canRedeemRewards, canViewGlobalAccounts } from "@/lib/services/access";
import {
  createRewardSchema,
  redeemRewardSchema,
  rewardFilterSchema,
  updateRewardSchema
} from "@/lib/validators/reward";

type Actor = {
  id: string;
  name?: string | null;
  role: RoleCode;
  companyId?: string | null;
};

export async function listRewards(rawFilters: unknown) {
  const filters = rewardFilterSchema.parse(rawFilters);
  return prisma.reward.findMany({
    where: {
      active: true,
      category: filters.categorySlug ? { slug: filters.categorySlug } : undefined,
      minTier: filters.tier,
      categoryId: undefined,
      worldCup: filters.onlyWorldCup ? { isNot: null } : undefined
    },
    include: {
      category: true,
      campaign: true,
      worldCup: true
    },
    orderBy: { pointsCost: "asc" }
  });
}

export async function getAvailableRewardsForCompany(companyId: string) {
  const profile = await prisma.loyaltyProfile.findUniqueOrThrow({
    where: { companyId }
  });

  const rewards = await prisma.reward.findMany({
    where: { active: true },
    include: {
      category: true,
      campaign: true,
      worldCup: true,
      redemptions: true
    },
    orderBy: { pointsCost: "asc" }
  });

  return rewards.filter((reward) =>
    isRewardEligible(
      {
        companyId,
        tier: profile.tier,
        totalPoints: profile.totalPoints
      },
      reward
    )
  );
}

export function isRewardEligible(
  company: {
    companyId: string;
    tier: LoyaltyTier;
    totalPoints: number;
  },
  reward: {
    minTier: LoyaltyTier;
    pointsCost: number;
    active: boolean;
    stock: number | null;
    redemptions?: Array<unknown>;
    campaign?: { active: boolean; startsAt: Date; endsAt: Date } | null;
  }
) {
  if (!reward.active) return false;

  if (tierOrder.indexOf(company.tier) < tierOrder.indexOf(reward.minTier)) {
    return false;
  }

  if (company.totalPoints < reward.pointsCost) {
    return false;
  }

  if (reward.stock !== null && reward.redemptions && reward.redemptions.length >= reward.stock) {
    return false;
  }

  if (reward.campaign) {
    const now = new Date();
    if (!reward.campaign.active || reward.campaign.startsAt > now || reward.campaign.endsAt < now) {
      return false;
    }
  }

  return true;
}

export async function createReward(actor: Actor, rawInput: unknown) {
  if (!canManageSystem(actor.role)) {
    throw new AppError("Forbidden.", 403, "FORBIDDEN");
  }

  const input = createRewardSchema.parse(rawInput);
  const reward = await prisma.reward.create({
    data: input
  });

  await createAuditLog({
    actorId: actor.id,
    actorName: actor.name ?? null,
    action: "REWARD_CREATED",
    entityType: "Reward",
    entityId: reward.id,
    metadata: input as Prisma.InputJsonValue
  });

  return reward;
}

export async function updateReward(actor: Actor, rewardId: string, rawInput: unknown) {
  if (!canManageSystem(actor.role)) {
    throw new AppError("Forbidden.", 403, "FORBIDDEN");
  }

  const input = updateRewardSchema.parse(rawInput);
  const reward = await prisma.reward.update({
    where: { id: rewardId },
    data: input
  });

  await createAuditLog({
    actorId: actor.id,
    actorName: actor.name ?? null,
    action: "REWARD_UPDATED",
    entityType: "Reward",
    entityId: reward.id,
    metadata: input as Prisma.InputJsonValue
  });

  return reward;
}

export async function redeemReward(actor: Actor, rawInput: unknown) {
  if (!canRedeemRewards(actor.role)) {
    throw new AppError("Forbidden.", 403, "FORBIDDEN");
  }

  const input = redeemRewardSchema.parse(rawInput);
  if (!canViewGlobalAccounts(actor.role) && actor.companyId !== input.companyId) {
    throw new AppError("Forbidden company access.", 403, "FORBIDDEN_COMPANY_ACCESS");
  }

  const [profile, reward] = await Promise.all([
    prisma.loyaltyProfile.findUniqueOrThrow({
      where: { companyId: input.companyId }
    }),
    prisma.reward.findUniqueOrThrow({
      where: { id: input.rewardId },
      include: {
        campaign: true,
        redemptions: true
      }
    })
  ]);

  const eligible = isRewardEligible(
    {
      companyId: input.companyId,
      tier: profile.tier,
      totalPoints: profile.totalPoints
    },
    reward
  );

  if (!eligible) {
    throw new AppError("Reward is not eligible for this company.", 400, "REWARD_NOT_ELIGIBLE");
  }

  return prisma.$transaction(async (tx) => {
    const redemption = await tx.rewardRedemption.create({
      data: {
        rewardId: reward.id,
        companyId: input.companyId,
        userId: actor.id,
        pointsSpent: reward.pointsCost,
        status: "APPROVED"
      }
    });

    await applyPointsToCompany({
      companyId: input.companyId,
      points: -reward.pointsCost,
      reason: `Reward redeemed: ${reward.name}`,
      type: PointTransactionType.REDEMPTION,
      userId: actor.id,
      tx
    });

    await createAuditLog({
      actorId: actor.id,
      actorName: actor.name ?? null,
      action: "REWARD_REDEEMED",
      entityType: "RewardRedemption",
      entityId: redemption.id,
      metadata: {
        rewardId: reward.id,
        companyId: input.companyId,
        pointsSpent: reward.pointsCost
      }
    });

    return redemption;
  });
}
