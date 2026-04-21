"use client";

import { LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function AdminUsersAccessForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <Card className="mx-auto w-full max-w-lg">
      <CardHeader>
        <div className="mb-2 inline-flex w-fit items-center gap-2 rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">
          <LockKeyhole className="h-3.5 w-3.5" />
          Seguridad adicional
        </div>
        <CardTitle>Acceso a administración de usuarios</CardTitle>
        <CardDescription>
          Valida una contraseña temporal para habilitar altas rápidas, edición y cambio de privilegios.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            setError(null);
            const formData = new FormData(event.currentTarget);
            const password = String(formData.get("password") ?? "");

            startTransition(async () => {
              const response = await fetch("/api/admin/users-access", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({ password })
              });
              const payload = (await response.json()) as { success: boolean; error?: { message?: string } };

              if (!response.ok || !payload.success) {
                setError(payload.error?.message ?? "No fue posible validar el acceso.");
                return;
              }

              router.push("/admin/users");
              router.refresh();
            });
          }}
        >
          <Field label="Contraseña adicional" error={error ?? undefined}>
            <Input name="password" type="password" placeholder="Ingresa la contraseña temporal" required />
          </Field>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Validando..." : "Ingresar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
