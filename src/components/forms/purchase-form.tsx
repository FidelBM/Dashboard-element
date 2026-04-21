"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createPurchaseSchema } from "@/lib/validators/purchase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

type FormValues = {
  companyId: string;
  title: string;
  type: "FLEET_EXPANSION" | "RENEWAL" | "ADDITIONAL_SERVICES" | "MULTIPRODUCT";
  amount: number;
  vehiclesAdded: number;
  additionalServices: number;
  ecosystemUsage: number;
  renewedEarly: boolean;
  positiveBehavior: boolean;
  purchasedAt: string;
};

export function PurchaseForm({ companyId }: { companyId: string }) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const form = useForm<FormValues>({
    resolver: zodResolver(createPurchaseSchema),
    defaultValues: {
      companyId,
      title: "",
      type: "FLEET_EXPANSION",
      amount: 0,
      vehiclesAdded: 0,
      additionalServices: 0,
      ecosystemUsage: 0,
      renewedEarly: false,
      positiveBehavior: true,
      purchasedAt: new Date().toISOString().slice(0, 10)
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registrar compra o ampliación</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-4 md:grid-cols-2"
          onSubmit={form.handleSubmit((values) => {
            setMessage(null);
            startTransition(async () => {
              const response = await fetch("/api/fleet/purchases", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values)
              });
              const payload = (await response.json()) as { success: boolean; error?: { message?: string } };
              if (!response.ok || !payload.success) {
                setMessage(payload.error?.message ?? "No fue posible registrar la compra.");
                return;
              }

              setMessage("Compra registrada y puntos aplicados.");
              router.refresh();
            });
          })}
        >
          <Field label="Título">
            <Input {...form.register("title")} />
          </Field>
          <Field label="Tipo">
            <Select {...form.register("type")}>
              <option value="FLEET_EXPANSION">Expansión de flota</option>
              <option value="RENEWAL">Renovación</option>
              <option value="ADDITIONAL_SERVICES">Servicios adicionales</option>
              <option value="MULTIPRODUCT">Uso multiproducto</option>
            </Select>
          </Field>
          <Field label="Monto">
            <Input type="number" {...form.register("amount", { valueAsNumber: true })} />
          </Field>
          <Field label="Vehículos agregados">
            <Input type="number" {...form.register("vehiclesAdded", { valueAsNumber: true })} />
          </Field>
          <Field label="Servicios adicionales">
            <Input type="number" {...form.register("additionalServices", { valueAsNumber: true })} />
          </Field>
          <Field label="Uso ecosistema">
            <Input type="number" {...form.register("ecosystemUsage", { valueAsNumber: true })} />
          </Field>
          <Field label="Fecha">
            <Input type="date" {...form.register("purchasedAt")} />
          </Field>
          <div className="flex items-center gap-6 text-sm text-slate-700 md:col-span-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" {...form.register("renewedEarly")} />
              Renovación anticipada
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" {...form.register("positiveBehavior")} />
              Comportamiento positivo
            </label>
          </div>
          <div className="md:col-span-2 flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">{message ?? "Se recalculará el puntaje de lealtad."}</p>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Guardando..." : "Registrar compra"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
