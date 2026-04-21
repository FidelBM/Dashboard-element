"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createCampaignSchema } from "@/lib/validators/campaign";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type CampaignFormValues = {
  name: string;
  slug: string;
  type: "STANDARD" | "WORLD_CUP";
  description?: string | null;
  bonusPoints: number;
  eligibilityMinTier?: "BASE" | "PARTNER" | "ELITE" | "STRATEGIC" | null;
  eligibilityMinPoints?: number | null;
  startsAt: string;
  endsAt: string;
};

export function CampaignForm() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(createCampaignSchema),
    defaultValues: {
      name: "",
      slug: "",
      type: "WORLD_CUP",
      description: "",
      bonusPoints: 20,
      eligibilityMinTier: "PARTNER",
      eligibilityMinPoints: 120,
      startsAt: "",
      endsAt: ""
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crear campaña</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-4 md:grid-cols-2"
          onSubmit={form.handleSubmit((values) => {
            setMessage(null);
            startTransition(async () => {
              const response = await fetch("/api/incentives/campaigns", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  ...values,
                  description: values.description || null,
                  eligibilityMinTier: values.eligibilityMinTier || null,
                  eligibilityMinPoints: values.eligibilityMinPoints || null
                })
              });
              const payload = (await response.json()) as { success: boolean; error?: { message?: string } };
              if (!response.ok || !payload.success) {
                setMessage(payload.error?.message ?? "No fue posible crear la campaña.");
                return;
              }

              setMessage("Campaña creada correctamente.");
              router.refresh();
              form.reset();
            });
          })}
        >
          <Field label="Nombre">
            <Input {...form.register("name")} />
          </Field>
          <Field label="Slug">
            <Input {...form.register("slug")} />
          </Field>
          <Field label="Tipo">
            <Select {...form.register("type")}>
              <option value="WORLD_CUP">Mundial</option>
              <option value="STANDARD">Estándar</option>
            </Select>
          </Field>
          <Field label="Bonificación de puntos">
            <Input type="number" {...form.register("bonusPoints", { valueAsNumber: true })} />
          </Field>
          <Field label="Nivel mínimo">
            <Select {...form.register("eligibilityMinTier")}>
              <option value="">Sin restricción</option>
              <option value="BASE">Base</option>
              <option value="PARTNER">Socio</option>
              <option value="ELITE">Élite</option>
              <option value="STRATEGIC">Estratégico</option>
            </Select>
          </Field>
          <Field label="Puntos mínimos">
            <Input type="number" {...form.register("eligibilityMinPoints", { valueAsNumber: true })} />
          </Field>
          <Field label="Inicio">
            <Input type="date" {...form.register("startsAt")} />
          </Field>
          <Field label="Fin">
            <Input type="date" {...form.register("endsAt")} />
          </Field>
          <Field label="Descripción" className="md:col-span-2">
            <Textarea {...form.register("description")} />
          </Field>
          <div className="md:col-span-2 flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">{message ?? "Las campañas se publican inmediatamente."}</p>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Guardando..." : "Crear campaña"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
