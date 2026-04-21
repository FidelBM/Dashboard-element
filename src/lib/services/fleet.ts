import { Prisma, RoleCode } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { AppError } from "@/lib/errors";
import { canViewGlobalAccounts } from "@/lib/services/access";
import { createAuditLog } from "@/lib/services/audit";
import { calculatePointsForPurchase, applyPointsToCompany } from "@/lib/services/points";
import { recomputeCompanyLoyalty } from "@/lib/services/loyalty";
import { createPurchaseSchema, purchaseFilterSchema } from "@/lib/validators/purchase";

type Actor = {
  id: string;
  name?: string | null;
  role: RoleCode;
  companyId?: string | null;
};

function assertCompanyAccess(actor: Actor, companyId: string) {
  if (!canViewGlobalAccounts(actor.role) && actor.companyId !== companyId) {
    throw new AppError("Forbidden company access.", 403, "FORBIDDEN_COMPANY_ACCESS");
  }
}

export async function getFleetSummary(actor: Actor, companyId: string) {
  assertCompanyAccess(actor, companyId);
  return prisma.company.findUniqueOrThrow({
    where: { id: companyId },
    include: {
      fleet: {
        include: {
          vehicles: {
            orderBy: { acquiredAt: "desc" }
          }
        }
      },
      purchases: {
        orderBy: { purchasedAt: "desc" },
        take: 10
      }
    }
  });
}

export async function listPurchases(actor: Actor, rawFilters: unknown) {
  const filters = purchaseFilterSchema.parse(rawFilters);
  const companyId = filters.companyId ?? actor.companyId;
  if (!companyId) {
    throw new AppError("Company is required.", 400, "COMPANY_REQUIRED");
  }

  assertCompanyAccess(actor, companyId);

  return prisma.purchase.findMany({
    where: { companyId },
    orderBy: { purchasedAt: "desc" }
  });
}

export async function createPurchase(actor: Actor, rawInput: unknown) {
  const input = createPurchaseSchema.parse(rawInput);
  assertCompanyAccess(actor, input.companyId);

  const pointsEvaluation = await calculatePointsForPurchase(input);

  return prisma.$transaction(async (tx) => {
    const purchase = await tx.purchase.create({
      data: {
        companyId: input.companyId,
        title: input.title,
        type: input.type,
        amount: new Prisma.Decimal(input.amount),
        vehiclesAdded: input.vehiclesAdded,
        additionalServices: input.additionalServices,
        ecosystemUsage: input.ecosystemUsage,
        renewedEarly: input.renewedEarly,
        positiveBehavior: input.positiveBehavior,
        pointsAwarded: pointsEvaluation.points,
        purchasedAt: input.purchasedAt
      }
    });

    if (pointsEvaluation.points > 0) {
      await applyPointsToCompany({
        companyId: input.companyId,
        points: pointsEvaluation.points,
        reason: `Purchase points awarded: ${input.title}`,
        purchaseId: purchase.id,
        userId: actor.id,
        tx
      });
    } else {
      await recomputeCompanyLoyalty(input.companyId, {
        note: `Purchase registered without points: ${input.title}`,
        tx
      });
    }

    await createAuditLog({
      actorId: actor.id,
      actorName: actor.name ?? null,
      action: "PURCHASE_CREATED",
      entityType: "Purchase",
      entityId: purchase.id,
      metadata: {
        companyId: input.companyId,
        title: input.title,
        pointsAwarded: pointsEvaluation.points
      }
    });

    return purchase;
  });
}
