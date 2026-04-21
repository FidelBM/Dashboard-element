"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type LoginFormProps = {
  callbackUrl: string;
};

export function LoginForm({ callbackUrl }: LoginFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="mb-2 inline-flex w-fit rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">
          Acceso seguro
        </div>
        <CardTitle>Element Loyalty+</CardTitle>
        <CardDescription>
          Ingresa con tus credenciales para acceder a la plataforma Element Elite Fleet.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const email = String(formData.get("email") ?? "");
            const password = String(formData.get("password") ?? "");

            setError(null);
            startTransition(async () => {
              const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
                callbackUrl
              });

              if (result?.error) {
                setError("Credenciales inválidas o usuario inactivo.");
                return;
              }

              router.push(result?.url ?? callbackUrl);
              router.refresh();
            });
          }}
        >
          <Field label="Correo">
            <Input name="email" type="email" placeholder="correo@empresa.com" required />
          </Field>
          <Field label="Contraseña" error={error ?? undefined}>
            <Input name="password" type="password" placeholder="********" required />
          </Field>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Validando..." : "Iniciar sesión"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
