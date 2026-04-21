import { Progress } from "@/components/ui/progress";
import { TierBadge } from "@/components/tier-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ProgressToNextTierProps = {
  currentTier: string;
  nextTier?: string | null;
  progress: number;
  pointsToNextTier: number;
};

export function ProgressToNextTier({
  currentTier,
  nextTier,
  progress,
  pointsToNextTier
}: ProgressToNextTierProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Progreso al siguiente nivel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <TierBadge tier={currentTier} />
          <span className="text-sm text-muted-foreground">{nextTier ? `Objetivo: ${nextTier}` : "Nivel máximo"}</span>
        </div>
        <Progress value={progress} />
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progreso actual</span>
          <span className="font-semibold text-slate-900">
            {nextTier ? `${pointsToNextTier} puntos para ascender` : "Máximo alcanzado"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
