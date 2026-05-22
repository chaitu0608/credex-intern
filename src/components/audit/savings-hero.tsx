import { HONEST_PATH_MAX_MONTHLY } from "@/lib/auditEngine";
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
  const isModestSavings =
    totalMonthlySavings > 0 &&
    totalMonthlySavings < HONEST_PATH_MAX_MONTHLY &&
    !isHighSavings;

  if (totalMonthlySavings > 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 lg:sticky lg:top-24">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          {isModestSavings ? "Small wins available" : "Potential savings"}
        </p>
        <p className="font-display mt-4 text-5xl font-bold tabular-nums tracking-tight text-foreground md:text-6xl lg:text-7xl">
          ${totalMonthlySavings.toLocaleString()}
        </p>
        <p className="mt-2 text-lg text-muted-foreground">per month</p>
        {isModestSavings && (
          <p className="mt-3 text-sm text-muted-foreground">
            Your stack is mostly right-sized — a few line items are worth
            revisiting.
          </p>
        )}
        <p className="mt-4 font-mono text-sm text-muted-foreground">
          <span className="text-foreground">
            ${totalAnnualSavings.toLocaleString()}
          </span>{" "}
          per year
        </p>
        {isHighSavings && (
          <Badge
            variant="outline"
            className="mt-6 border-accent/50 font-mono text-xs text-foreground"
          >
            High savings — Credex can help capture more
          </Badge>
        )}
        <p className="mt-6 font-mono text-xs text-muted-foreground">
          Across {toolCount} tool{toolCount === 1 ? "" : "s"} analyzed
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card p-8 text-center lg:sticky lg:top-24">
      <span className="mx-auto mb-4 inline-flex h-2 w-2 rounded-full bg-accent" />
      <p className="font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
        Stack optimized
      </p>
      <p className="mt-2 text-muted-foreground">
        Your AI tools look right-sized for your team
      </p>
      <p className="mt-6 font-mono text-xs text-muted-foreground">
        Across {toolCount} tool{toolCount === 1 ? "" : "s"} analyzed
      </p>
    </div>
  );
}
