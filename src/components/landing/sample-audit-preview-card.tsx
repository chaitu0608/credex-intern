import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ToolLogo } from "@/components/ui/tool-logo";
import {
  getConfidenceLabel,
  getMigrationRiskLabel,
  TYPE_DISPLAY,
} from "@/lib/audit-recommendation-meta";
import { getProjectedMonthlySpend } from "@/lib/audit-metrics";
import { cn } from "@/lib/utils";
import {
  SAMPLE_AUDIT_PREVIEW,
  SAMPLE_PREVIEW_SECTION,
} from "@/components/landing/sample-audit-preview-data";

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

function RecommendationRow({
  rec,
  index,
}: {
  rec: (typeof SAMPLE_AUDIT_PREVIEW.recommendations)[number];
  index: number;
}) {
  const typeMeta = TYPE_DISPLAY[rec.recommendationType];
  const hasSavings = rec.savings > 0;

  return (
    <li>
      <article
        className={cn(
          "rounded-xl border bg-card p-4 shadow-sm transition-colors hover:bg-muted/20 sm:p-5",
          hasSavings
            ? "border-l-[3px] border-l-accent border-border"
            : "border-border"
        )}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="font-mono text-xs text-muted-foreground">
              {String(index + 1).padStart(2, "0")}
            </span>
            <ToolLogo tool={rec.tool} className="h-9 w-9 shrink-0" />
            <div className="min-w-0">
              <p className="font-semibold text-foreground">{rec.toolName}</p>
              <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
                {typeMeta.label}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                <span className="capitalize text-foreground/80">
                  {rec.currentPlan}
                </span>
                {" → "}
                {rec.recommendedAction}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:flex-col sm:items-end">
            <Badge variant="outline" className="font-mono text-[10px]">
              {getConfidenceLabel(rec.recommendationType)}
            </Badge>
            <Badge variant="secondary" className="font-mono text-[10px]">
              {getMigrationRiskLabel(rec.recommendationType)}
            </Badge>
            {hasSavings && (
              <p className="font-mono text-base font-semibold tabular-nums text-savings sm:text-lg">
                ${rec.savings}/mo
              </p>
            )}
          </div>
        </div>
        <p className="mt-4 border-l-2 border-accent/40 pl-3 text-sm leading-relaxed text-muted-foreground">
          {rec.reasoning}
        </p>
      </article>
    </li>
  );
}

function PreviewMetricsHeader() {
  const { monthlySpend, monthlySavings, annualSavings, savingsPercent, optimizationScore } =
    SAMPLE_AUDIT_PREVIEW;
  const projected = getProjectedMonthlySpend(monthlySpend, monthlySavings);

  return (
    <div className="border-b border-border/60 pb-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        Sample savings report
      </p>
      <p className="font-mono mt-3 text-xs uppercase tracking-wide text-muted-foreground">
        Potential monthly savings
      </p>
      <p className="font-display mt-1 text-4xl font-bold tabular-nums tracking-tight text-savings sm:text-5xl">
        ${monthlySavings.toLocaleString()}
      </p>
      <p className="mt-2 text-sm text-muted-foreground sm:text-base">
        <span className="tabular-nums text-foreground">
          ${annualSavings.toLocaleString()}
        </span>{" "}
        per year · from ${monthlySpend.toLocaleString()}/mo spend
        <span className="text-savings"> ({savingsPercent}%)</span>
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Badge
          variant="outline"
          className="font-mono text-[10px] uppercase tracking-wider"
        >
          Optimization score {optimizationScore}/100
        </Badge>
        <Badge
          variant="secondary"
          className="font-mono text-[10px] uppercase tracking-wider"
        >
          {SAMPLE_AUDIT_PREVIEW.teamContext}
        </Badge>
      </div>
      <div className="mt-6 space-y-2.5 rounded-lg border border-border bg-muted/20 p-4">
        <StatRow
          label="Monthly spend"
          value={`$${monthlySpend.toLocaleString()}`}
        />
        <StatRow
          label="Projected spend"
          value={`$${projected.toLocaleString()}`}
        />
        <StatRow
          label="Savings rate"
          value={`${savingsPercent}%`}
          valueClassName="text-savings"
        />
      </div>
    </div>
  );
}

function TrustStrip() {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-2 border-t border-border/60 pt-4">
      {SAMPLE_PREVIEW_SECTION.trustPoints.map((point) => (
        <li
          key={point}
          className="flex items-center gap-1.5 text-xs text-muted-foreground"
        >
          <Check className="h-3.5 w-3.5 shrink-0 text-accent" aria-hidden />
          {point}
        </li>
      ))}
    </ul>
  );
}

export function SampleAuditPreviewCard({ className }: { className?: string }) {
  const { recommendations } = SAMPLE_AUDIT_PREVIEW;

  return (
    <div
      className={cn(
        "rounded-2xl border border-accent/30 bg-accent/[0.03] p-5 shadow-sm sm:p-6",
        className
      )}
    >
      <PreviewMetricsHeader />

      <div className="pt-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Per-tool recommendations
        </p>
        <ul className="mt-4 space-y-4" aria-label="Sample audit recommendations">
          {recommendations.map((rec, index) => (
            <RecommendationRow key={rec.tool} rec={rec} index={index} />
          ))}
        </ul>
      </div>

      <TrustStrip />
    </div>
  );
}
