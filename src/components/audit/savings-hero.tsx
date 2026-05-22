import { HONEST_PATH_MAX_MONTHLY } from "@/lib/auditEngine";
import { getProjectedMonthlySpend } from "@/lib/audit-metrics";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface TopRecommendationHighlight {
  toolName: string;
  savings: number;
  action: string;
}

interface SavingsHeroProps {
  totalMonthlySpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  savingsPercent: number | null;
  isHighSavings: boolean;
  toolCount: number;
  topRecommendation?: TopRecommendationHighlight;
  className?: string;
}

function StatRow({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span
        className={cn(
          "font-mono text-sm font-medium tabular-nums text-foreground",
          valueClassName
        )}
      >
        {value}
      </span>
    </div>
  );
}

export default function SavingsHero({
  totalMonthlySpend,
  totalMonthlySavings,
  totalAnnualSavings,
  savingsPercent,
  isHighSavings,
  toolCount,
  topRecommendation,
  className,
}: SavingsHeroProps) {
  const isModestSavings =
    totalMonthlySavings > 0 &&
    totalMonthlySavings < HONEST_PATH_MAX_MONTHLY &&
    !isHighSavings;

  const projectedSpend = getProjectedMonthlySpend(
    totalMonthlySpend,
    totalMonthlySavings
  );

  const shell = cn(
    "rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8 lg:sticky lg:top-24",
    className
  );

  const statsBlock = (
    <div className="mt-6 space-y-3 border-t border-border pt-5">
      {totalMonthlySavings === 0 && (
        <StatRow
          label="Savings rate"
          value={savingsPercent !== null ? "0% identified" : "—"}
        />
      )}
      {totalMonthlySavings > 0 && (
        <StatRow
          label="After changes"
          value={`~$${projectedSpend.toLocaleString()}/mo`}
        />
      )}
      <StatRow
        label="Annualized savings"
        value={`$${totalAnnualSavings.toLocaleString()}/yr`}
      />
    </div>
  );

  if (totalMonthlySavings > 0) {
    return (
      <div className={shell}>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {isModestSavings ? "Small wins available" : "At a glance"}
        </p>
        <StatRow
          label="Current spend"
          value={`$${totalMonthlySpend.toLocaleString()}/mo`}
        />
        <p className="font-mono mt-4 text-[10px] uppercase tracking-wide text-muted-foreground">
          Potential savings
        </p>
        <p className="font-display mt-1 text-4xl font-bold tabular-nums tracking-tight text-savings sm:text-5xl lg:text-6xl">
          ${totalMonthlySavings.toLocaleString()}
        </p>
        <p className="mt-1 text-base text-muted-foreground">per month</p>
        {savingsPercent !== null && (
          <p className="mt-2 font-mono text-sm text-savings">
            {savingsPercent}% of current spend
          </p>
        )}
        {isModestSavings && (
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Your stack is mostly right-sized — a few line items are worth
            revisiting.
          </p>
        )}
        {statsBlock}
        {topRecommendation && (
          <p className="mt-5 rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm leading-snug text-foreground">
            <span className="font-medium">Top action:</span>{" "}
            {topRecommendation.action} on {topRecommendation.toolName} — save $
            {topRecommendation.savings}/mo
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
    <div className={cn(shell, "text-center sm:text-left")}>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        At a glance
      </p>
      <p className="font-mono mt-4 text-[10px] uppercase tracking-wide text-muted-foreground">
        Current spend
      </p>
      <p className="font-display mt-1 text-4xl font-bold tabular-nums tracking-tight text-foreground sm:text-5xl">
        ${totalMonthlySpend.toLocaleString()}
      </p>
      <p className="mt-1 text-base text-muted-foreground">per month</p>
      <span className="mx-auto mt-4 inline-flex h-2 w-2 rounded-full bg-accent sm:mx-0" />
      <p className="font-display mt-3 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
        Stack optimized
      </p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Your AI tools look right-sized for your team
      </p>
      {statsBlock}
      <p className="mt-6 font-mono text-[10px] text-muted-foreground">
        {toolCount} tool{toolCount === 1 ? "" : "s"} analyzed
      </p>
    </div>
  );
}
