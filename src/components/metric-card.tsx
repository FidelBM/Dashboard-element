import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type MetricCardProps = {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  accent?: string;
};

export function MetricCard({ title, value, description, icon: Icon, accent = "from-primary to-cyan-500" }: MetricCardProps) {
  return (
    <Card className="overflow-hidden surface-subtle">
      <div className={`h-1.5 w-full bg-gradient-to-r ${accent}`} />
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <CardTitle className="mt-3 text-[2rem] leading-none">{value}</CardTitle>
        </div>
        {Icon ? (
          <div className="grid h-12 w-12 place-items-center rounded-[1.1rem] bg-slate-100/85 text-primary ring-1 ring-slate-200">
            <Icon className="h-5 w-5" />
          </div>
        ) : null}
      </CardHeader>
      {description ? (
        <CardContent className="pt-0">
          <p className="max-w-[22rem] text-sm leading-6 text-muted-foreground">{description}</p>
        </CardContent>
      ) : null}
    </Card>
  );
}
