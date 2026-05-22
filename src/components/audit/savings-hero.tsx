import { HONEST_PATH_MAX_MONTHLY } from "@/lib/auditEngine";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface TopRecommendationHighlight {
  toolName: string;
  savings: number;
  action: string;
}

interface SavingsHeroProps {
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  isHighSavings: boolean;
  toolCount: number;
  topRecommendation?: TopRecommendationHighlight;
  className?: string;
}

export default function SavingsHero({
  totalMonthlySavings,
  totalAnnualSavings,
  isHighSavings,
  toolCount,
  topRecommendation,
  className,
}: SavingsHeroProps) {
  const isModestSavings =
    totalMonthlySavings > 0 &&
    totalMonthlySavings < HONEST_PATH_MAX_MONTHLY &&
    !isHighSavings;

  const shell = cn(
    "rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8 lg:sticky lg:top-24",
    className
  );

  if (totalMonthlySavings > 0) {
    return (
      <div className={shell}>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {isModestSavings ? "Small wins available" : "At a glance"}
        </p>
        <p className="font-display mt-5 text-4xl font-bold tabular-nums tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          ${totalMonthlySavings.toLocaleString()}
        </p>
        <p className="mt-2 text-base text-muted-foreground">per month</p>
        {isModestSavings && (
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Your stack is mostly right-sized — a few line items are worth
            revisiting.
          </p>
        )}
        <div className="mt-6 space-y-1 border-t border-border pt-5">
          <p className="font-mono text-xs text-muted-foreground">Annualized</p>
          <p className="font-mono text-lg font-medium tabular-nums text-foreground">
            ${totalAnnualSavings.toLocaleString()}
            <span className="text-sm font-normal text-muted-foreground">
              /yr
            </span>
          </p>
        </div>
        {topRecommendation && (
          <p className="mt-5 rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm leading-snug text-foreground">
            <span className="font-medium">Top action:</span>{" "}
            {topRecommendation.action} on {topRecommendation.toolName} — save
            ${topRecommendation.savings}/mo
          </p>
        )}
        {isHighSavings && (
          <Badge
            variant="outline"
            className="mt-5 border-accent/50 font-mono text-[10px] uppercase tracking-wide text-foreground"
          >
            High savings — Credex eligible
          </Badge>
        )}
        <p className="mt-6 font-mono text-[10px] text-muted-foreground">
          {toolCount} tool{toolCount === 1 ? "" : "s"} analyzed
        </p>
      </div>
    );
  }

  return (
    <div className={cn(shell, "text-center")}>
      <span className="mx-auto mb-4 inline-flex h-2 w-2 rounded-full bg-accent" />
      <p className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        Stack optimized
      </p>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Your AI tools look right-sized for your team
      </p>
      <p className="mt-8 font-mono text-[10px] text-muted-foreground">
        {toolCount} tool{toolCount === 1 ? "" : "s"} analyzed
      </p>
    </div>
  );
}
