import { z } from "zod";

export const createRewardSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(10),
  categoryId: z.string().min(1),
  minTier: z.enum(["BASE", "PARTNER", "ELITE", "STRATEGIC"]),
  pointsCost: z.coerce.number().int().min(1),
  stock: z.coerce.number().int().min(0).optional().nullable(),
  active: z.boolean().default(true),
  campaignId: z.string().optional().nullable()
});

export const updateRewardSchema = createRewardSchema.partial();

export const redeemRewardSchema = z.object({
  rewardId: z.string().min(1),
  companyId: z.string().min(1)
});

export const rewardFilterSchema = z.object({
  companyId: z.string().optional(),
  categorySlug: z.string().optional(),
  tier: z.enum(["BASE", "PARTNER", "ELITE", "STRATEGIC"]).optional(),
  onlyWorldCup: z.coerce.boolean().optional()
});

export type CreateRewardSchema = z.infer<typeof createRewardSchema>;
export type UpdateRewardSchema = z.infer<typeof updateRewardSchema>;
