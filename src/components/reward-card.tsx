"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Gift, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TierBadge } from "@/components/tier-badge";

type RewardCardProps = {
  reward: {
    id: string;
    name: string;
    description: string;
    pointsCost: number;
    minTier: string;
    stock: number | null;
    category: {
      name: string;
      isWorldCup: boolean;
    };
    campaign?: {
      name: string;
      endsAt: Date;
    } | null;
  };
  companyId?: string | null;
  canRedeem: boolean;
  isEligible: boolean;
  alreadyRedeemed?: boolean;
};

export function RewardCard({ reward, companyId, canRedeem, isEligible, alreadyRedeemed }: RewardCardProps) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <Card className="surface-subtle h-full">
      <CardContent className="flex h-full flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant={reward.category.isWorldCup ? "cyan" : "outline"}>{reward.category.name}</Badge>
              <TierBadge tier={reward.minTier} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">{reward.name}</h3>
          </div>
          <div className="grid h-11 w-11 place-items-center rounded-[1.1rem] bg-slate-100 text-primary ring-1 ring-slate-200">
            {reward.category.isWorldCup ? <Trophy className="h-5 w-5" /> : <Gift className="h-5 w-5" />}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{reward.description}</p>
        <div className="grid gap-3 rounded-[1.35rem] bg-slate-50/90 p-4 text-sm text-slate-700">
          <div className="flex items-center justify-between">
            <span>Costo</span>
            <span className="font-semibold text-slate-900">{reward.pointsCost} puntos</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Stock</span>
            <span className="font-semibold text-slate-900">{reward.stock ?? "Ilimitado"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Vigencia</span>
            <span className="font-semibold text-slate-900">
              {reward.campaign ? new Date(reward.campaign.endsAt).toLocaleDateString("es-MX") : "Siempre activa"}
            </span>
          </div>
        </div>
        {message ? <p className="text-sm text-cyan-700">{message}</p> : null}
        <div className="mt-auto">
          <Button
            className="w-full"
            disabled={!canRedeem || !isEligible || alreadyRedeemed || !companyId || isPending}
            onClick={() => {
              if (!companyId) return;
              setMessage(null);
              startTransition(async () => {
                const response = await fetch(`/api/rewards/${reward.id}/redeem`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify({ companyId })
                });

                const payload = (await response.json()) as {
                  success: boolean;
                  error?: { message?: string };
                };
                if (!response.ok || !payload.success) {
                  setMessage(payload.error?.message ?? "No fue posible redimir este beneficio.");
                  return;
                }

                setMessage("Beneficio redimido correctamente.");
                router.refresh();
              });
            }}
          >
            {alreadyRedeemed
              ? "Ya redimido"
              : !isEligible
                ? "No disponible aún"
                : isPending
                  ? "Procesando..."
                  : "Redimir beneficio"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
