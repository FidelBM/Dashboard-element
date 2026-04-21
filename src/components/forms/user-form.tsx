"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createUserSchema, updateUserSchema } from "@/lib/validators/user";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

type UserFormValues = {
  name: string;
  email: string;
  password?: string;
  roleCode: "SUPER_ADMIN" | "ADMIN_ELEMENT" | "FLEET_MANAGER" | "ANALYST_OPERATIONS";
  companyId?: string | null;
  status: "ACTIVE" | "INACTIVE";
};

type UserFormProps = {
  mode: "create" | "edit";
  user?: {
    id: string;
    name: string;
    email: string;
    status: "ACTIVE" | "INACTIVE";
    role: { code: UserFormValues["roleCode"] };
    companyId?: string | null;
  };
  companies: Array<{ id: string; name: string }>;
};

export function UserForm({ mode, user, companies }: UserFormProps) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const form = useForm<UserFormValues>({
    resolver: zodResolver(mode === "create" ? createUserSchema : updateUserSchema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      password: "",
      roleCode: user?.role.code ?? "FLEET_MANAGER",
      companyId: user?.companyId ?? "",
      status: user?.status ?? "ACTIVE"
    }
  });

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b border-border/70 bg-slate-50/70">
        <CardTitle>{mode === "create" ? "Registrar usuario" : "Editar usuario"}</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form
          className="grid gap-5 md:grid-cols-2"
          onSubmit={form.handleSubmit((values) => {
            setMessage(null);
            startTransition(async () => {
              const response = await fetch(mode === "create" ? "/api/users" : `/api/users/${user?.id}`, {
                method: mode === "create" ? "POST" : "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  ...values,
                  companyId: values.companyId || null
                })
              });

              const payload = (await response.json()) as { success: boolean; error?: { message?: string } };
              if (!response.ok || !payload.success) {
                setMessage(payload.error?.message ?? "No fue posible guardar el usuario.");
                return;
              }

              setMessage(mode === "create" ? "Usuario creado correctamente." : "Usuario actualizado correctamente.");
              router.refresh();
              if (mode === "create") {
                form.reset({
                  name: "",
                  email: "",
                  password: "",
                  roleCode: "FLEET_MANAGER",
                  companyId: "",
                  status: "ACTIVE"
                });
              }
            });
          })}
        >
          <Field label="Nombre" error={form.formState.errors.name?.message}>
            <Input {...form.register("name")} placeholder="Nombre completo" />
          </Field>
          <Field label="Correo" error={form.formState.errors.email?.message}>
            <Input type="email" {...form.register("email")} placeholder="correo@empresa.com" />
          </Field>
          {mode === "create" ? (
            <Field label="Contraseña" error={form.formState.errors.password?.message}>
              <Input type="password" {...form.register("password")} placeholder="Mínimo 8 caracteres" />
            </Field>
          ) : null}
          <Field label="Rol" error={form.formState.errors.roleCode?.message}>
            <Select {...form.register("roleCode")}>
              <option value="FLEET_MANAGER">Gestor de flota</option>
              <option value="ANALYST_OPERATIONS">Operaciones / Analista</option>
              <option value="ADMIN_ELEMENT">Admin Element</option>
              <option value="SUPER_ADMIN">Superadministrador</option>
            </Select>
          </Field>
          <Field label="Empresa">
            <Select {...form.register("companyId")}>
              <option value="">Sin empresa</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Estado" error={form.formState.errors.status?.message}>
            <Select {...form.register("status")}>
              <option value="ACTIVE">Activo</option>
              <option value="INACTIVE">Inactivo</option>
            </Select>
          </Field>
          <div className="surface-subtle md:col-span-2 flex flex-col items-start justify-between gap-3 rounded-2xl border border-border/70 px-4 py-4 sm:flex-row sm:items-center">
            <p className="text-sm text-muted-foreground">
              {message ?? "Los cambios quedarán registrados en la bitácora de auditoría."}
            </p>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Guardando..." : mode === "create" ? "Registrar usuario" : "Actualizar usuario"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
