import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getPillarSignal } from "@/lib/presentation";

type LoyaltyPillarCardProps = {
  label: string;
  value: number;
  description: string;
};

export function LoyaltyPillarCard({ label, value, description }: LoyaltyPillarCardProps) {
  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">{label}</p>
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          </div>
          <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold tracking-[0.16em] text-slate-700">
            {getPillarSignal(value)}
          </div>
        </div>
        <div className="flex items-end justify-between">
          <span className="font-display text-3xl font-bold text-primary">{value}%</span>
          <span className="text-sm text-muted-foreground">peso operativo</span>
        </div>
        <Progress value={value} />
      </CardContent>
    </Card>
  );
}
