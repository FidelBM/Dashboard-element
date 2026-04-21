import { z } from "zod";

export const adminPageAccessSchema = z.object({
  password: z.string().min(1, "La contraseña es obligatoria.")
});
