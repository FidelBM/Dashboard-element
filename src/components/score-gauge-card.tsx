import { Award, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressToNextTier } from "@/components/progress-to-next-tier";
import { TierBadge } from "@/components/tier-badge";

type ScoreGaugeCardProps = {
  score: number;
  tier: string;
  nextTier?: string | null;
  progress: number;
  pointsToNextTier: number;
  nextBenefit?: string | null;
};

export function ScoreGaugeCard({
  score,
  tier,
  nextTier,
  progress,
  pointsToNextTier,
  nextBenefit
}: ScoreGaugeCardProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
      <Card className="overflow-hidden">
        <CardContent className="grid gap-6 p-6 lg:grid-cols-[220px_1fr] lg:items-center">
          <div className="mx-auto flex h-56 w-56 items-center justify-center rounded-full border-[18px] border-slate-100 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
            <div className="grid h-40 w-40 place-items-center rounded-full bg-gradient-to-br from-primary to-cyan-500 text-white shadow-[0_20px_34px_rgba(45,108,223,0.32)]">
              <div className="text-center">
                <p className="text-xs uppercase tracking-[0.22em] text-cyan-100">Lealtad</p>
                <p className="font-display text-5xl font-bold">{score}</p>
              </div>
            </div>
          </div>
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <TierBadge tier={tier} />
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                <Award className="h-3.5 w-3.5 text-cyan-600" />
                Ruta hacia {nextTier ?? "nivel máximo"}
              </div>
            </div>
            <div>
              <h2 className="font-display text-3xl font-bold text-primary">Puntuación de Lealtad</h2>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                La relación de valor combina antigüedad, uso del ecosistema, tamaño de flotilla y comportamiento de renovación para mover a cada cuenta hacia un vínculo estratégico.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.5rem] border border-slate-200 bg-white/90 p-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Próximo beneficio</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{nextBenefit ?? "Sin beneficio sugerido"}</p>
              </div>
              <div className="rounded-[1.5rem] border border-slate-200 bg-white/90 p-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Insight prioritario</p>
                <p className="mt-2 flex items-center gap-2 text-lg font-semibold text-slate-900">
                  <Sparkles className="h-4 w-4 text-cyan-600" />
                  {nextTier ? `${pointsToNextTier} puntos para ${nextTier}` : "Cuenta en nivel estratégico"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <ProgressToNextTier
        currentTier={tier}
        nextTier={nextTier}
        progress={progress}
        pointsToNextTier={pointsToNextTier}
      />
    </div>
  );
}
