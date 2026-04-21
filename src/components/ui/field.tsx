import { cn } from "@/lib/utils";

type FieldProps = {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
};

export function Field({ label, error, className, children }: FieldProps) {
  return (
    <label className={cn("grid gap-2", className)}>
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {children}
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </label>
  );
}
