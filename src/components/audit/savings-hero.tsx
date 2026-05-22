import { getProjectedMonthlySpend } from "@/lib/audit-metrics";
import { cn } from "@/lib/utils";

interface SavingsHeroProps {
  totalMonthlySpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  savingsPercent: number | null;
  optimizationScore: number;
  toolCount: number;
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

/** Compact sticky sidebar — full hero lives in AuditReportHero. */
export default function SavingsHero({
  totalMonthlySpend,
  totalMonthlySavings,
  totalAnnualSavings,
  savingsPercent,
  optimizationScore,
  toolCount,
  className,
}: SavingsHeroProps) {
  const projectedSpend = getProjectedMonthlySpend(
    totalMonthlySpend,
    totalMonthlySavings
  );

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-5 shadow-sm lg:sticky lg:top-24",
        className
      )}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        At a glance
      </p>
      <div className="mt-4 space-y-3">
        <StatRow
          label="Monthly spend"
          value={`$${totalMonthlySpend.toLocaleString()}`}
        />
        <StatRow
          label="Savings"
          value={
            totalMonthlySavings > 0
              ? `$${totalMonthlySavings.toLocaleString()}/mo`
              : "—"
          }
          valueClassName={
            totalMonthlySavings > 0 ? "text-savings" : undefined
          }
        />
        {savingsPercent !== null && (
          <StatRow
            label="Savings rate"
            value={
              totalMonthlySavings > 0
                ? `${savingsPercent}%`
                : "0% identified"
            }
            valueClassName={
              totalMonthlySavings > 0 ? "text-savings" : undefined
            }
          />
        )}
        {totalMonthlySavings > 0 && (
          <StatRow
            label="After changes"
            value={`~$${projectedSpend.toLocaleString()}/mo`}
          />
        )}
        <StatRow
          label="Score"
          value={`${optimizationScore}/100`}
        />
        <StatRow
          label="Annual savings"
          value={`$${totalAnnualSavings.toLocaleString()}`}
        />
      </div>
      <p className="mt-5 font-mono text-[10px] text-muted-foreground">
        {toolCount} tool{toolCount === 1 ? "" : "s"} in this audit
      </p>
    </div>
  );
}
