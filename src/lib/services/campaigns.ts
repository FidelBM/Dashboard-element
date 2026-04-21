import { CampaignType, LoyaltyTier, Prisma, RoleCode } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { AppError } from "@/lib/errors";
import { createAuditLog } from "@/lib/services/audit";
import { canManageSystem } from "@/lib/services/access";
import { CreateCampaignSchema, UpdateCampaignSchema } from "@/lib/validators/campaign";
import { tierOrder } from "@/lib/constants";

function isCampaignCurrentlyActive(campaign: { active: boolean; startsAt: Date; endsAt: Date }) {
  const now = new Date();
  return campaign.active && campaign.startsAt <= now && campaign.endsAt >= now;
}

export async function listActiveCampaigns(type?: CampaignType) {
  const campaigns = await prisma.campaign.findMany({
    where: {
      active: true,
      ...(type ? { type } : {}),
      startsAt: { lte: new Date() },
      endsAt: { gte: new Date() }
    },
    orderBy: { startsAt: "asc" }
  });

  return campaigns;
}

export async function getActiveWorldCupCampaigns() {
  return listActiveCampaigns(CampaignType.WORLD_CUP);
}

export async function createCampaign(
  actor: { id: string; name?: string | null; role: RoleCode },
  input: CreateCampaignSchema
) {
  if (!canManageSystem(actor.role)) {
    throw new AppError("Forbidden.", 403, "FORBIDDEN");
  }

  const campaign = await prisma.campaign.create({
    data: input
  });

  await createAuditLog({
    actorId: actor.id,
    actorName: actor.name ?? null,
    action: "CAMPAIGN_CREATED",
    entityType: "Campaign",
    entityId: campaign.id,
    metadata: input as Prisma.InputJsonValue
  });

  return campaign;
}

export async function updateCampaign(
  actor: { id: string; name?: string | null; role: RoleCode },
  campaignId: string,
  input: UpdateCampaignSchema
) {
  if (!canManageSystem(actor.role)) {
    throw new AppError("Forbidden.", 403, "FORBIDDEN");
  }

  const campaign = await prisma.campaign.update({
    where: { id: campaignId },
    data: input
  });

  await createAuditLog({
    actorId: actor.id,
    actorName: actor.name ?? null,
    action: "CAMPAIGN_UPDATED",
    entityType: "Campaign",
    entityId: campaign.id,
    metadata: input as Prisma.InputJsonValue
  });

  return campaign;
}

export function qualifiesForCampaign(
  tier: LoyaltyTier,
  totalPoints: number,
  campaign: {
    active: boolean;
    startsAt: Date;
    endsAt: Date;
    eligibilityMinTier: LoyaltyTier | null;
    eligibilityMinPoints: number | null;
  }
) {
  if (!isCampaignCurrentlyActive(campaign)) {
    return false;
  }

  const meetsTier = campaign.eligibilityMinTier
    ? tierOrder.indexOf(tier) >= tierOrder.indexOf(campaign.eligibilityMinTier)
    : true;
  const meetsPoints = campaign.eligibilityMinPoints ? totalPoints >= campaign.eligibilityMinPoints : true;

  return meetsTier && meetsPoints;
}
