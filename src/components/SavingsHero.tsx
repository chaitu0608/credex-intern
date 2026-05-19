import { TrendingDown, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SavingsHeroProps {
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  isHighSavings: boolean;
  toolCount: number;
}

export default function SavingsHero({
  totalMonthlySavings,
  totalAnnualSavings,
  isHighSavings,
  toolCount,
}: SavingsHeroProps) {
  if (totalMonthlySavings > 0) {
    return (
      <div className="overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-white to-accent/30 shadow-lg">
        <div className="h-1 bg-gradient-to-r from-primary to-[hsl(var(--spendsense-indigo))]" />
        <div className="p-8 text-center">
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-primary/10">
            <TrendingDown className="h-5 w-5 text-primary" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Potential savings
          </p>
          <p className="font-display mt-2 text-5xl font-bold tabular-nums text-foreground sm:text-6xl">
            ${totalMonthlySavings.toLocaleString()}
            <span className="mt-1 block text-xl font-medium text-muted-foreground sm:text-2xl">
              per month
            </span>
          </p>
          <p className="mt-3 text-lg text-muted-foreground">
            <span className="font-semibold text-foreground">
              ${totalAnnualSavings.toLocaleString()}
            </span>{" "}
            per year
          </p>
          {isHighSavings && (
            <Badge className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
              High savings — Credex can help capture more
            </Badge>
          )}
          <p className="mt-4 text-sm text-muted-foreground">
            Across {toolCount} tool{toolCount === 1 ? "" : "s"} analyzed
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-white p-8 text-center shadow-sm">
      <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-accent">
        <CheckCircle2 className="h-5 w-5 text-primary" />
      </div>
      <p className="font-display text-2xl font-bold text-primary sm:text-3xl">
        Stack optimized
      </p>
      <p className="mt-2 text-muted-foreground">
        Your AI tools look right-sized for your team
      </p>
      <p className="mt-4 text-sm text-muted-foreground">
        Across {toolCount} tool{toolCount === 1 ? "" : "s"} analyzed
      </p>
    </div>
  );
}
