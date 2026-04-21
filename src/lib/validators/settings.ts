import { z } from "zod";

export const loyaltySettingsSchema = z.object({
  baseMax: z.coerce.number().min(0).max(40),
  partnerMax: z.coerce.number().min(41).max(60),
  eliteMax: z.coerce.number().min(61).max(80),
  strategicMax: z.coerce.number().min(81).max(100),
  worldCupCampaignName: z.string().min(4)
});

export type LoyaltySettingsSchema = z.infer<typeof loyaltySettingsSchema>;
