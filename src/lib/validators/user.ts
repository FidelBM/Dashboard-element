import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio."),
  email: z.string().email("Ingresa un correo válido."),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres."),
  companyId: z.string().optional().nullable(),
  roleCode: z.enum(["SUPER_ADMIN", "ADMIN_ELEMENT", "FLEET_MANAGER", "ANALYST_OPERATIONS"]),
  status: z.enum(["ACTIVE", "INACTIVE"])
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio.").optional(),
  email: z.string().email("Ingresa un correo válido.").optional(),
  companyId: z.string().nullable().optional(),
  roleCode: z.enum(["SUPER_ADMIN", "ADMIN_ELEMENT", "FLEET_MANAGER", "ANALYST_OPERATIONS"]).optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional()
});

export const listUsersSchema = z.object({
  q: z.string().optional(),
  roleCode: z.enum(["SUPER_ADMIN", "ADMIN_ELEMENT", "FLEET_MANAGER", "ANALYST_OPERATIONS"]).optional(),
  companyId: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional()
});

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
export type ListUsersSchema = z.infer<typeof listUsersSchema>;
