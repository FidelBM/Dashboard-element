import { z } from "zod";

export const createPurchaseSchema = z.object({
  companyId: z.string().min(1),
  title: z.string().min(3),
  type: z.enum(["FLEET_EXPANSION", "RENEWAL", "ADDITIONAL_SERVICES", "MULTIPRODUCT"]),
  amount: z.coerce.number().positive(),
  vehiclesAdded: z.coerce.number().int().min(0).default(0),
  additionalServices: z.coerce.number().int().min(0).default(0),
  ecosystemUsage: z.coerce.number().int().min(0).default(0),
  renewedEarly: z.coerce.boolean().default(false),
  positiveBehavior: z.coerce.boolean().default(false),
  purchasedAt: z.coerce.date()
});

export const purchaseFilterSchema = z.object({
  companyId: z.string().optional()
});

export type CreatePurchaseSchema = z.infer<typeof createPurchaseSchema>;
