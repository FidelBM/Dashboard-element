import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DonutChart } from "@/components/charts";

type DonutDistributionCardProps = {
  values: {
    tenure: number;
    serviceUsage: number;
    fleetSize: number;
    renewal: number;
  };
};

export function DonutDistributionCard({ values }: DonutDistributionCardProps) {
  const data = [
    { name: "Antigüedad", value: values.tenure, color: "#0e1f4f" },
    { name: "Uso de servicios", value: values.serviceUsage, color: "#2d6cdf" },
    { name: "Tamaño de flotilla", value: values.fleetSize, color: "#16b7d9" },
    { name: "Renovación y comportamiento", value: values.renewal, color: "#7ee0d6" }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribución del puntaje de lealtad</CardTitle>
      </CardHeader>
      <CardContent>
        <DonutChart data={data} />
        <div className="grid gap-3 md:grid-cols-2">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm font-medium text-slate-700">{item.name}</span>
              </div>
              <span className="text-sm font-semibold text-slate-900">{item.value}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
