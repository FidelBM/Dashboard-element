import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
  {
    variants: {
      variant: {
        slate: "bg-slate-100/90 text-slate-700 ring-1 ring-slate-200",
        blue: "bg-blue-100/90 text-blue-800 ring-1 ring-blue-200",
        cyan: "bg-cyan-100/90 text-cyan-800 ring-1 ring-cyan-200",
        green: "bg-emerald-100/90 text-emerald-800 ring-1 ring-emerald-200",
        outline: "border border-slate-200 bg-white text-foreground"
      }
    },
    defaultVariants: {
      variant: "outline"
    }
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
