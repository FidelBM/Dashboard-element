import { Inbox } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function EmptyState({
  title,
  description
}: {
  title: string;
  description: string;
}) {
  return (
    <Card className="overflow-hidden border-dashed border-border/80 bg-white/90">
      <CardContent className="grid place-items-center gap-4 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.08),transparent_52%)] p-10 text-center">
        <div className="grid h-14 w-14 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm">
          <Inbox className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-slate-900">{title}</h3>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
