/**
 * Demo credentials:
 * superadmin@element.com / Element123!
 * admin@element.com / Element123!
 * ana@logisticadelnorte.com / Element123!
 * marco@movilidadurbana.com / Element123!
 * analyst@element.com / Element123!
 */
import { hash } from "bcryptjs";
import {
  CampaignType,
  IncentiveRuleType,
  LoyaltyTier,
  Prisma,
  RoleCode,
  UserStatus,
  VehicleType
} from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { recomputeCompanyLoyalty } from "@/lib/services/loyalty";
import { applyPointsToCompany } from "@/lib/services/points";

async function main() {
  await prisma.auditLog.deleteMany();
  await prisma.rewardRedemption.deleteMany();
  await prisma.worldCupBenefit.deleteMany();
  await prisma.reward.deleteMany();
  await prisma.rewardCategory.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.pointTransaction.deleteMany();
  await prisma.loyaltyScoreHistory.deleteMany();
  await prisma.purchase.deleteMany();
  await prisma.incentiveRule.deleteMany();
  await prisma.loyaltyProfile.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.fleet.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();
  await prisma.company.deleteMany();

  const passwordHash = await hash("Element123!", 12);

  const roles = await Promise.all([
    prisma.role.create({
      data: {
        code: RoleCode.SUPER_ADMIN,
        name: "Super Admin",
        description: "Full system control"
      }
    }),
    prisma.role.create({
      data: {
        code: RoleCode.ADMIN_ELEMENT,
        name: "Admin Element",
        description: "Client and program administration"
      }
    }),
    prisma.role.create({
      data: {
        code: RoleCode.FLEET_MANAGER,
        name: "Fleet Manager",
        description: "Customer fleet manager"
      }
    }),
    prisma.role.create({
      data: {
        code: RoleCode.ANALYST_OPERATIONS,
        name: "Analyst Operations",
        description: "Read-only analytics and intervention monitoring"
      }
    })
  ]);

  const roleMap = Object.fromEntries(roles.map((role) => [role.code, role.id]));

  const companies = await Promise.all([
    prisma.company.create({
      data: {
        name: "Logistica del Norte",
        industry: "Logistics",
        accountOwner: "Paola Ramirez",
        status: UserStatus.ACTIVE,
        createdAt: new Date("2021-03-12T12:00:00.000Z")
      }
    }),
    prisma.company.create({
      data: {
        name: "Movilidad Urbana MX",
        industry: "Mobility Services",
        accountOwner: "Jorge Salinas",
        status: UserStatus.ACTIVE,
        createdAt: new Date("2023-06-01T12:00:00.000Z")
      }
    })
  ]);

  const [companyNorth, companyUrban] = companies;

  const [fleetNorth, fleetUrban] = await Promise.all([
    prisma.fleet.create({
      data: {
        companyId: companyNorth.id,
        activeVehicles: 124,
        segments: "Heavy cargo, vans, pickups"
      }
    }),
    prisma.fleet.create({
      data: {
        companyId: companyUrban.id,
        activeVehicles: 62,
        segments: "Sedans, vans, SUVs"
      }
    })
  ]);

  await prisma.vehicle.createMany({
    data: [
      {
        fleetId: fleetNorth.id,
        label: "LDN Trailer 01",
        vin: "ELF0001LDNTRAILER",
        type: VehicleType.TRUCK,
        acquiredAt: new Date("2024-01-15T12:00:00.000Z"),
        monthlyCost: new Prisma.Decimal(45000)
      },
      {
        fleetId: fleetNorth.id,
        label: "LDN Van 14",
        vin: "ELF0002LDNVAN014",
        type: VehicleType.VAN,
        acquiredAt: new Date("2024-08-03T12:00:00.000Z"),
        monthlyCost: new Prisma.Decimal(18000)
      },
      {
        fleetId: fleetUrban.id,
        label: "MUMX SUV 07",
        vin: "ELF0003MUMXSUV07",
        type: VehicleType.SUV,
        acquiredAt: new Date("2025-02-11T12:00:00.000Z"),
        monthlyCost: new Prisma.Decimal(22000)
      },
      {
        fleetId: fleetUrban.id,
        label: "MUMX Sedan 21",
        vin: "ELF0004MUMXSED21",
        type: VehicleType.SEDAN,
        acquiredAt: new Date("2025-03-05T12:00:00.000Z"),
        monthlyCost: new Prisma.Decimal(14000)
      }
    ]
  });

  await Promise.all([
    prisma.loyaltyProfile.create({
      data: {
        companyId: companyNorth.id,
        tier: LoyaltyTier.BASE
      }
    }),
    prisma.loyaltyProfile.create({
      data: {
        companyId: companyUrban.id,
        tier: LoyaltyTier.BASE
      }
    })
  ]);

  await prisma.incentiveRule.createMany({
    data: [
      {
        name: "High Value Fleet Purchase",
        description: "Points for purchases above MXN 2,000,000",
        ruleType: IncentiveRuleType.PURCHASE_AMOUNT,
        threshold: new Prisma.Decimal(2_000_000),
        points: 60
      },
      {
        name: "Per Vehicle Added",
        description: "Points per additional vehicle",
        ruleType: IncentiveRuleType.VEHICLE_ADDITION,
        points: 5
      },
      {
        name: "Early Renewal",
        description: "Bonus for early renewals",
        ruleType: IncentiveRuleType.EARLY_RENEWAL,
        points: 40
      },
      {
        name: "Multi Product Bonus",
        description: "Bonus for 2 or more additional services",
        ruleType: IncentiveRuleType.MULTI_PRODUCT,
        threshold: new Prisma.Decimal(2),
        points: 30
      },
      {
        name: "Positive Behavior",
        description: "Customer behavior excellence",
        ruleType: IncentiveRuleType.POSITIVE_BEHAVIOR,
        points: 25
      },
      {
        name: "Ecosystem Usage",
        description: "Usage bonus for three or more ecosystem actions",
        ruleType: IncentiveRuleType.ECOSYSTEM_USAGE,
        threshold: new Prisma.Decimal(3),
        points: 20
      }
    ]
  });

  const standardCampaign = await prisma.campaign.create({
    data: {
      name: "Growth Accelerator Q2",
      slug: "growth-accelerator-q2",
      type: CampaignType.STANDARD,
      description: "Quarterly growth acceleration program for fleet expansions.",
      bonusPoints: 20,
      eligibilityMinTier: LoyaltyTier.PARTNER,
      eligibilityMinPoints: 120,
      startsAt: new Date("2026-03-01T00:00:00.000Z"),
      endsAt: new Date("2026-06-30T23:59:59.000Z"),
      active: true
    }
  });

  const worldCupCampaign = await prisma.campaign.create({
    data: {
      name: "Road to the World Cup 2026",
      slug: "road-to-the-world-cup-2026",
      type: CampaignType.WORLD_CUP,
      description: "Special 2026 incentive wave tied to Mexico-hosted World Cup activations.",
      bonusPoints: 35,
      eligibilityMinTier: LoyaltyTier.PARTNER,
      eligibilityMinPoints: 140,
      startsAt: new Date("2026-04-01T00:00:00.000Z"),
      endsAt: new Date("2026-07-31T23:59:59.000Z"),
      active: true
    }
  });

  const categories = await Promise.all([
    prisma.rewardCategory.create({
      data: {
        name: "Operational Value",
        slug: "operational-value",
        description: "Benefits tied to service efficiency"
      }
    }),
    prisma.rewardCategory.create({
      data: {
        name: "Premium Access",
        slug: "premium-access",
        description: "Executive and premium fleet benefits"
      }
    }),
    prisma.rewardCategory.create({
      data: {
        name: "World Cup Experiences",
        slug: "world-cup-experiences",
        description: "Road to the World Cup benefits",
        isWorldCup: true
      }
    })
  ]);

  const [categoryOps, categoryPremium, categoryWorldCup] = categories;

  const rewards = await Promise.all([
    prisma.reward.create({
      data: {
        name: "Service Audit Pack",
        description: "Quarterly operational fleet audit with recommendations.",
        categoryId: categoryOps.id,
        minTier: LoyaltyTier.BASE,
        pointsCost: 80
      }
    }),
    prisma.reward.create({
      data: {
        name: "Dedicated Account Sprint",
        description: "Two-week premium account intervention sprint.",
        categoryId: categoryPremium.id,
        minTier: LoyaltyTier.PARTNER,
        pointsCost: 140
      }
    }),
    prisma.reward.create({
      data: {
        name: "VIP Fleet Strategy Workshop",
        description: "Executive workshop for long-term fleet optimization.",
        categoryId: categoryPremium.id,
        minTier: LoyaltyTier.ELITE,
        pointsCost: 220
      }
    }),
    prisma.reward.create({
      data: {
        name: "World Cup Driver Kit",
        description: "Limited edition FIFA-themed driver and fleet manager kit.",
        categoryId: categoryWorldCup.id,
        minTier: LoyaltyTier.PARTNER,
        pointsCost: 160,
        stock: 50,
        campaignId: worldCupCampaign.id
      }
    }),
    prisma.reward.create({
      data: {
        name: "Hospitality Match Experience",
        description: "VIP hospitality package for qualified client teams.",
        categoryId: categoryWorldCup.id,
        minTier: LoyaltyTier.STRATEGIC,
        pointsCost: 300,
        stock: 10,
        campaignId: worldCupCampaign.id
      }
    })
  ]);

  const worldCupRewards = rewards.filter((reward) => reward.campaignId === worldCupCampaign.id);
  await Promise.all(
    worldCupRewards.map((reward, index) =>
      prisma.worldCupBenefit.create({
        data: {
          rewardId: reward.id,
          campaignId: worldCupCampaign.id,
          venue: index === 0 ? "CDMX Fan Hub" : "Estadio BBVA",
          activationType: index === 0 ? "Merch Kit" : "Hospitality",
          hospitality: index === 1,
          limitedEdition: true
        }
      })
    )
  );

  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: "Sofia Herrera",
        email: "superadmin@element.com",
        passwordHash,
        status: UserStatus.ACTIVE,
        roleId: roleMap.SUPER_ADMIN
      }
    }),
    prisma.user.create({
      data: {
        name: "Daniel Cruz",
        email: "admin@element.com",
        passwordHash,
        status: UserStatus.ACTIVE,
        roleId: roleMap.ADMIN_ELEMENT
      }
    }),
    prisma.user.create({
      data: {
        name: "Ana Martinez",
        email: "ana@logisticadelnorte.com",
        passwordHash,
        status: UserStatus.ACTIVE,
        roleId: roleMap.FLEET_MANAGER,
        companyId: companyNorth.id
      }
    }),
    prisma.user.create({
      data: {
        name: "Luis Ortega",
        email: "luis@logisticadelnorte.com",
        passwordHash,
        status: UserStatus.ACTIVE,
        roleId: roleMap.FLEET_MANAGER,
        companyId: companyNorth.id
      }
    }),
    prisma.user.create({
      data: {
        name: "Marco Flores",
        email: "marco@movilidadurbana.com",
        passwordHash,
        status: UserStatus.ACTIVE,
        roleId: roleMap.FLEET_MANAGER,
        companyId: companyUrban.id
      }
    }),
    prisma.user.create({
      data: {
        name: "Elena Torres",
        email: "analyst@element.com",
        passwordHash,
        status: UserStatus.ACTIVE,
        roleId: roleMap.ANALYST_OPERATIONS
      }
    })
  ]);

  const purchaseSeedData = [
    {
      companyId: companyNorth.id,
      title: "Fleet expansion Monterrey hub",
      type: "FLEET_EXPANSION" as const,
      amount: new Prisma.Decimal(3_600_000),
      vehiclesAdded: 18,
      additionalServices: 3,
      ecosystemUsage: 4,
      renewedEarly: false,
      positiveBehavior: true,
      purchasedAt: new Date("2026-02-15T12:00:00.000Z"),
      actorId: users[2].id
    },
    {
      companyId: companyNorth.id,
      title: "Early renewal 2026 package",
      type: "RENEWAL" as const,
      amount: new Prisma.Decimal(1_850_000),
      vehiclesAdded: 0,
      additionalServices: 2,
      ecosystemUsage: 3,
      renewedEarly: true,
      positiveBehavior: true,
      purchasedAt: new Date("2026-03-20T12:00:00.000Z"),
      actorId: users[3].id
    },
    {
      companyId: companyUrban.id,
      title: "Airport shuttle fleet growth",
      type: "FLEET_EXPANSION" as const,
      amount: new Prisma.Decimal(2_450_000),
      vehiclesAdded: 10,
      additionalServices: 2,
      ecosystemUsage: 3,
      renewedEarly: false,
      positiveBehavior: true,
      purchasedAt: new Date("2026-02-28T12:00:00.000Z"),
      actorId: users[4].id
    },
    {
      companyId: companyUrban.id,
      title: "Mobility services bundle",
      type: "MULTIPRODUCT" as const,
      amount: new Prisma.Decimal(920_000),
      vehiclesAdded: 4,
      additionalServices: 4,
      ecosystemUsage: 5,
      renewedEarly: false,
      positiveBehavior: true,
      purchasedAt: new Date("2026-04-10T12:00:00.000Z"),
      actorId: users[4].id
    }
  ];

  for (const item of purchaseSeedData) {
    const purchase = await prisma.purchase.create({
      data: {
        companyId: item.companyId,
        title: item.title,
        type: item.type,
        amount: item.amount,
        vehiclesAdded: item.vehiclesAdded,
        additionalServices: item.additionalServices,
        ecosystemUsage: item.ecosystemUsage,
        renewedEarly: item.renewedEarly,
        positiveBehavior: item.positiveBehavior,
        purchasedAt: item.purchasedAt
      }
    });

    const rules = await prisma.incentiveRule.findMany({
      where: { active: true }
    });
    let points = 0;

    for (const rule of rules) {
      const threshold = Number(rule.threshold ?? 0);
      switch (rule.ruleType) {
        case IncentiveRuleType.PURCHASE_AMOUNT:
          points += Number(item.amount) >= threshold ? rule.points : 0;
          break;
        case IncentiveRuleType.VEHICLE_ADDITION:
          points += item.vehiclesAdded * rule.points;
          break;
        case IncentiveRuleType.EARLY_RENEWAL:
          points += item.renewedEarly ? rule.points : 0;
          break;
        case IncentiveRuleType.MULTI_PRODUCT:
          points += item.additionalServices >= threshold ? rule.points : 0;
          break;
        case IncentiveRuleType.POSITIVE_BEHAVIOR:
          points += item.positiveBehavior ? rule.points : 0;
          break;
        case IncentiveRuleType.ECOSYSTEM_USAGE:
          points += item.ecosystemUsage >= threshold ? rule.points : 0;
          break;
      }
    }

    const activeCampaigns = await prisma.campaign.findMany({
      where: {
        active: true,
        startsAt: { lte: item.purchasedAt },
        endsAt: { gte: item.purchasedAt }
      }
    });

    points += activeCampaigns.reduce((sum, campaign) => sum + campaign.bonusPoints, 0);

    await prisma.purchase.update({
      where: { id: purchase.id },
      data: {
        pointsAwarded: points
      }
    });

    await applyPointsToCompany({
      companyId: item.companyId,
      points,
      reason: `Seed purchase award: ${item.title}`,
      purchaseId: purchase.id,
      userId: item.actorId
    });
  }

  await Promise.all([
    applyPointsToCompany({
      companyId: companyNorth.id,
      points: 45,
      reason: "Manual premium service recovery credit",
      userId: users[1].id,
      type: "ADJUSTMENT"
    }),
    applyPointsToCompany({
      companyId: companyUrban.id,
      points: 25,
      reason: "Operational excellence adjustment",
      userId: users[1].id,
      type: "ADJUSTMENT"
    })
  ]);

  await Promise.all([
    recomputeCompanyLoyalty(companyNorth.id, {
      note: "Initial seed recompute - Logistica del Norte"
    }),
    recomputeCompanyLoyalty(companyUrban.id, {
      note: "Initial seed recompute - Movilidad Urbana MX"
    })
  ]);

  const northProfile = await prisma.loyaltyProfile.findUniqueOrThrow({
    where: { companyId: companyNorth.id }
  });
  const urbanProfile = await prisma.loyaltyProfile.findUniqueOrThrow({
    where: { companyId: companyUrban.id }
  });

  if (northProfile.totalPoints >= rewards[0].pointsCost) {
    await prisma.rewardRedemption.create({
      data: {
        rewardId: rewards[0].id,
        companyId: companyNorth.id,
        userId: users[2].id,
        pointsSpent: rewards[0].pointsCost,
        status: "FULFILLED"
      }
    });
    await applyPointsToCompany({
      companyId: companyNorth.id,
      points: -rewards[0].pointsCost,
      reason: `Seed redemption: ${rewards[0].name}`,
      userId: users[2].id,
      type: "REDEMPTION"
    });
  }

  if (urbanProfile.totalPoints >= rewards[3].pointsCost) {
    await prisma.rewardRedemption.create({
      data: {
        rewardId: rewards[3].id,
        companyId: companyUrban.id,
        userId: users[4].id,
        pointsSpent: rewards[3].pointsCost,
        status: "APPROVED"
      }
    });
    await applyPointsToCompany({
      companyId: companyUrban.id,
      points: -rewards[3].pointsCost,
      reason: `Seed redemption: ${rewards[3].name}`,
      userId: users[4].id,
      type: "REDEMPTION"
    });
  }

  await prisma.auditLog.createMany({
    data: [
      {
        actorId: users[0].id,
        actorName: users[0].name,
        action: "SEED_COMPLETED",
        entityType: "System",
        entityId: "seed",
        metadata: {
          companies: 2,
          users: users.length,
          campaigns: 2
        }
      },
      {
        actorId: users[1].id,
        actorName: users[1].name,
        action: "CAMPAIGN_CREATED",
        entityType: "Campaign",
        entityId: worldCupCampaign.id,
        metadata: {
          slug: worldCupCampaign.slug
        }
      }
    ]
  });

  console.log("Seed completed successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
