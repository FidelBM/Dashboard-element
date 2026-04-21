import { AlertTriangle, Sparkles } from "lucide-react";

export function InsightAlert({
  message,
  tone = "info"
}: {
  message: string;
  tone?: "info" | "warning";
}) {
  return (
    <div
      className={
        tone === "warning"
          ? "flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900"
          : "flex items-start gap-3 rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-cyan-900"
      }
    >
      {tone === "warning" ? <AlertTriangle className="mt-0.5 h-4 w-4" /> : <Sparkles className="mt-0.5 h-4 w-4" />}
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}
