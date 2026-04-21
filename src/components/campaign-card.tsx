import { CalendarDays, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type CampaignCardProps = {
  campaign: {
    name: string;
    description: string | null;
    type: string;
    bonusPoints: number;
    startsAt: Date;
    endsAt: Date;
  };
};

export function CampaignCard({ campaign }: CampaignCardProps) {
  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant={campaign.type === "WORLD_CUP" ? "cyan" : "blue"}>
                {campaign.type === "WORLD_CUP" ? "Mundial 2026" : "Campaña estándar"}
              </Badge>
            </div>
            <h3 className="mt-3 text-lg font-semibold text-slate-900">{campaign.name}</h3>
          </div>
          <div className="grid h-11 w-11 place-items-center rounded-[1.1rem] bg-cyan-50 text-cyan-700 ring-1 ring-cyan-100">
            <Sparkles className="h-5 w-5" />
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{campaign.description ?? "Campaña activa sin descripción adicional."}</p>
        <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm">
          <span className="flex items-center gap-2 text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            Vigencia
          </span>
          <span className="font-semibold text-slate-900">
            {new Date(campaign.startsAt).toLocaleDateString("es-MX")} -{" "}
            {new Date(campaign.endsAt).toLocaleDateString("es-MX")}
          </span>
        </div>
        <div className="rounded-[1.4rem] bg-gradient-to-r from-primary to-[#18397c] px-4 py-3 text-white">
          <p className="text-xs uppercase tracking-[0.18em] text-cyan-100">Bonificación</p>
          <p className="mt-1 text-xl font-semibold">+{campaign.bonusPoints} puntos</p>
        </div>
      </CardContent>
    </Card>
  );
}
