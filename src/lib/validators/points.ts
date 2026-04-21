import { z } from "zod";

export const manualAdjustmentSchema = z.object({
  companyId: z.string().min(1),
  points: z.coerce.number().int(),
  reason: z.string().min(4)
});

export type ManualAdjustmentSchema = z.infer<typeof manualAdjustmentSchema>;
