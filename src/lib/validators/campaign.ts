import { z } from "zod";

export const createCampaignSchema = z.object({
  name: z.string().min(3),
  slug: z.string().min(3),
  type: z.enum(["STANDARD", "WORLD_CUP"]),
  description: z.string().optional().nullable(),
  bonusPoints: z.coerce.number().int().min(0).default(0),
  eligibilityMinTier: z.enum(["BASE", "PARTNER", "ELITE", "STRATEGIC"]).optional().nullable(),
  eligibilityMinPoints: z.coerce.number().int().min(0).optional().nullable(),
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date(),
  active: z.boolean().default(true)
});

export const updateCampaignSchema = createCampaignSchema.partial().extend({
  name: z.string().min(3).optional(),
  slug: z.string().min(3).optional()
});

export type CreateCampaignSchema = z.infer<typeof createCampaignSchema>;
export type UpdateCampaignSchema = z.infer<typeof updateCampaignSchema>;
