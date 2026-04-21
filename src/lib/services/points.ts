import { PointTransactionType, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/lib/services/audit";
import { AppError } from "@/lib/errors";
import { recomputeCompanyLoyalty } from "@/lib/services/loyalty";
import { qualifiesForCampaign } from "@/lib/services/campaigns";
import { createPurchaseSchema } from "@/lib/validators/purchase";
import { manualAdjustmentSchema } from "@/lib/validators/points";

export async function getActiveCampaignBonuses(companyId: string, purchaseDate: Date) {
  const profile = await prisma.loyaltyProfile.findUnique({
    where: { companyId }
  });

  const campaigns = await prisma.campaign.findMany({
    where: {
      active: true,
      startsAt: { lte: purchaseDate },
      endsAt: { gte: purchaseDate }
    }
  });

  return campaigns.filter((campaign) =>
    qualifiesForCampaign(profile?.tier ?? "BASE", profile?.totalPoints ?? 0, campaign)
  );
}

export async function calculatePointsForPurchase(input: ReturnType<typeof createPurchaseSchema.parse>) {
  const rules = await prisma.incentiveRule.findMany({
    where: {
      active: true,
      OR: [
        { startsAt: null, endsAt: null },
        {
          startsAt: { lte: input.purchasedAt },
          endsAt: { gte: input.purchasedAt }
        }
      ]
    }
  });

  const basePoints = rules.reduce((total, rule) => {
    const threshold = Number(rule.threshold ?? 0);

    switch (rule.ruleType) {
      case "PURCHASE_AMOUNT":
        return input.amount >= threshold ? total + rule.points : total;
      case "VEHICLE_ADDITION":
        return total + input.vehiclesAdded * rule.points;
      case "EARLY_RENEWAL":
        return input.renewedEarly ? total + rule.points : total;
      case "MULTI_PRODUCT":
        return input.additionalServices >= threshold ? total + rule.points : total;
      case "POSITIVE_BEHAVIOR":
        return input.positiveBehavior ? total + rule.points : total;
      case "ECOSYSTEM_USAGE":
        return input.ecosystemUsage >= threshold ? total + rule.points : total;
      default:
        return total;
    }
  }, 0);

  const activeBonuses = await getActiveCampaignBonuses(input.companyId, input.purchasedAt);
  const campaignBonus = activeBonuses.reduce((sum, campaign) => sum + campaign.bonusPoints, 0);

  return {
    rules,
    activeBonuses,
    points: basePoints + campaignBonus
  };
}

export async function applyPointsToCompany(input: {
  companyId: string;
  points: number;
  reason: string;
  type?: PointTransactionType;
  purchaseId?: string;
  userId?: string;
  actorName?: string | null;
  tx?: Prisma.TransactionClient;
}) {
  const db = input.tx ?? prisma;
  const profile = await db.loyaltyProfile.findUnique({
    where: { companyId: input.companyId }
  });

  if (!profile) {
    throw new AppError("Loyalty profile not found.", 404, "LOYALTY_PROFILE_NOT_FOUND");
  }

  const isRedemption = (input.type ?? PointTransactionType.EARNED) === PointTransactionType.REDEMPTION;
  const nextTotalPoints = profile.totalPoints + input.points;

  if (nextTotalPoints < 0) {
    throw new AppError("Insufficient points balance.", 400, "INSUFFICIENT_POINTS");
  }

  const updatedProfile = await db.loyaltyProfile.update({
    where: { companyId: input.companyId },
    data: {
      totalPoints: nextTotalPoints,
      purchasePoints: input.points > 0 ? { increment: input.points } : undefined,
      redeemedPoints: isRedemption ? { increment: Math.abs(input.points) } : undefined
    }
  });

  const transaction = await db.pointTransaction.create({
    data: {
      loyaltyProfileId: updatedProfile.id,
      companyId: input.companyId,
      purchaseId: input.purchaseId,
      userId: input.userId,
      type: input.type ?? PointTransactionType.EARNED,
      points: input.points,
      description: input.reason
    }
  });

  await recomputeCompanyLoyalty(input.companyId, {
    note: input.reason,
    tx: db
  });

  return transaction;
}

export async function applyManualPointsAdjustment(
  actor: { id: string; name?: string | null },
  rawInput: unknown
) {
  const input = manualAdjustmentSchema.parse(rawInput);
  const transaction = await prisma.$transaction(async (tx) => {
    const createdTransaction = await applyPointsToCompany({
      companyId: input.companyId,
      points: input.points,
      reason: input.reason,
      type: PointTransactionType.ADJUSTMENT,
      userId: actor.id,
      actorName: actor.name,
      tx
    });

    await createAuditLog({
      actorId: actor.id,
      actorName: actor.name ?? null,
      action: "POINTS_ADJUSTED",
      entityType: "Company",
      entityId: input.companyId,
      metadata: {
        reason: input.reason,
        points: input.points,
        transactionId: createdTransaction.id
      }
    });

    return createdTransaction;
  });

  return transaction;
}
