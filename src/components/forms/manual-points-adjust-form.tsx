"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { manualAdjustmentSchema } from "@/lib/validators/points";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

type FormValues = {
  companyId: string;
  points: number;
  reason: string;
};

export function ManualPointsAdjustForm({ companies }: { companies: Array<{ id: string; name: string }> }) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const form = useForm<FormValues>({
    resolver: zodResolver(manualAdjustmentSchema),
    defaultValues: {
      companyId: companies[0]?.id ?? "",
      points: 15,
      reason: ""
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ajuste manual de puntos</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-4 md:grid-cols-2"
          onSubmit={form.handleSubmit((values) => {
            setMessage(null);
            startTransition(async () => {
              const response = await fetch("/api/admin/points-adjustments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values)
              });
              const payload = (await response.json()) as { success: boolean; error?: { message?: string } };
              if (!response.ok || !payload.success) {
                setMessage(payload.error?.message ?? "No fue posible aplicar el ajuste.");
                return;
              }
              setMessage("Ajuste aplicado y auditado correctamente.");
              router.refresh();
            });
          })}
        >
          <Field label="Empresa">
            <Select {...form.register("companyId")}>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Puntos">
            <Input type="number" {...form.register("points", { valueAsNumber: true })} />
          </Field>
          <Field label="Motivo" className="md:col-span-2">
            <Input {...form.register("reason")} />
          </Field>
          <div className="md:col-span-2 flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">{message ?? "Se registrará un evento en la bitácora de auditoría."}</p>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Aplicando..." : "Aplicar ajuste"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
