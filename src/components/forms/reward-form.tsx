"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createRewardSchema } from "@/lib/validators/reward";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type RewardFormValues = {
  name: string;
  description: string;
  categoryId: string;
  minTier: "BASE" | "PARTNER" | "ELITE" | "STRATEGIC";
  pointsCost: number;
  stock?: number | null;
  active: boolean;
  campaignId?: string | null;
};

export function RewardForm({
  categories,
  campaigns
}: {
  categories: Array<{ id: string; name: string }>;
  campaigns: Array<{ id: string; name: string }>;
}) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const form = useForm<RewardFormValues>({
    resolver: zodResolver(createRewardSchema),
    defaultValues: {
      name: "",
      description: "",
      categoryId: categories[0]?.id ?? "",
      minTier: "PARTNER",
      pointsCost: 120,
      stock: undefined,
      active: true,
      campaignId: ""
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crear recompensa</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-4 md:grid-cols-2"
          onSubmit={form.handleSubmit((values) => {
            setMessage(null);
            startTransition(async () => {
              const response = await fetch("/api/rewards", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  ...values,
                  stock: values.stock || null,
                  campaignId: values.campaignId || null
                })
              });
              const payload = (await response.json()) as { success: boolean; error?: { message?: string } };
              if (!response.ok || !payload.success) {
                setMessage(payload.error?.message ?? "No fue posible crear la recompensa.");
                return;
              }

              setMessage("Recompensa creada correctamente.");
              router.refresh();
              form.reset();
            });
          })}
        >
          <Field label="Título" error={form.formState.errors.name?.message}>
            <Input {...form.register("name")} />
          </Field>
          <Field label="Categoría" error={form.formState.errors.categoryId?.message}>
            <Select {...form.register("categoryId")}>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Descripción" className="md:col-span-2" error={form.formState.errors.description?.message}>
            <Textarea {...form.register("description")} />
          </Field>
          <Field label="Nivel mínimo">
            <Select {...form.register("minTier")}>
              <option value="BASE">Base</option>
              <option value="PARTNER">Socio</option>
              <option value="ELITE">Élite</option>
              <option value="STRATEGIC">Estratégico</option>
            </Select>
          </Field>
          <Field label="Costo en puntos">
            <Input type="number" {...form.register("pointsCost", { valueAsNumber: true })} />
          </Field>
          <Field label="Stock">
            <Input type="number" {...form.register("stock", { valueAsNumber: true })} />
          </Field>
          <Field label="Campaña relacionada">
            <Select {...form.register("campaignId")}>
              <option value="">Sin campaña</option>
              {campaigns.map((campaign) => (
                <option key={campaign.id} value={campaign.id}>
                  {campaign.name}
                </option>
              ))}
            </Select>
          </Field>
          <div className="md:col-span-2 flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">{message ?? "Las recompensas aparecerán en la sección Beneficios."}</p>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Guardando..." : "Crear recompensa"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
