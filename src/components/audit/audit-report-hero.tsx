"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { PRICING_VERIFIED_AT } from "@/lib/pricing";
import { cn } from "@/lib/utils";

interface AuditReportHeroProps {
  totalMonthlySpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  savingsPercent: number | null;
  optimizationScore: number;
  healthNarrative: string;
  isHighSavings: boolean;
}

export default function AuditReportHero({
  totalMonthlySpend,
  totalMonthlySavings,
  totalAnnualSavings,
  savingsPercent,
  optimizationScore,
  healthNarrative,
  isHighSavings,
}: AuditReportHeroProps) {
  const hasSavings = totalMonthlySavings > 0;

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={cn(
        "rounded-2xl border bg-card p-6 shadow-sm sm:p-10",
        isHighSavings ? "border-accent/35 bg-accent/[0.03]" : "border-border"
      )}
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-start">
        <div className="min-w-0 space-y-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            Audit outcome
          </p>

          {hasSavings ? (
            <div>
              <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
                Potential monthly savings
              </p>
              <p className="font-display mt-2 text-4xl font-bold tabular-nums tracking-tight text-savings sm:text-5xl md:text-6xl lg:text-7xl">
                ${totalMonthlySavings.toLocaleString()}
              </p>
              <p className="mt-2 text-sm text-muted-foreground sm:text-lg">
                <span className="tabular-nums text-foreground">
                  ${totalAnnualSavings.toLocaleString()}
                </span>{" "}
                per year · from ${totalMonthlySpend.toLocaleString()}/mo spend
                {savingsPercent !== null && (
                  <span className="text-savings"> ({savingsPercent}%)</span>
                )}
              </p>
            </div>
          ) : (
            <div>
              <p className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
                Stack optimized
              </p>
              <p className="mt-2 text-sm text-muted-foreground sm:text-lg">
                ${totalMonthlySpend.toLocaleString()}/month current spend
              </p>
            </div>
          )}

          <p className="max-w-2xl text-base leading-relaxed text-foreground/90 sm:text-lg">
            {healthNarrative}
          </p>

          <p className="font-mono text-[10px] text-muted-foreground">
            Rule-based audit · list prices verified {PRICING_VERIFIED_AT} ·
            financially explainable recommendations
          </p>
        </div>

        <div className="flex w-full flex-col items-center gap-3 rounded-xl border border-border bg-muted/20 px-6 py-5 sm:w-auto sm:px-8 sm:py-6 lg:min-w-[180px]">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Optimization score
          </p>
          <p className="font-display text-5xl font-bold tabular-nums tracking-tight">
            {optimizationScore}
            <span className="text-2xl font-normal text-muted-foreground">
              /100
            </span>
          </p>
          <p className="text-center text-xs text-muted-foreground">
            {optimizationScore >= 85
              ? "Well optimized"
              : optimizationScore >= 60
                ? "Room to improve"
                : "Significant savings available"}
          </p>
          {isHighSavings && (
            <Badge
              variant="outline"
              className="border-accent/50 font-mono text-[10px] uppercase tracking-wide"
            >
              Credex eligible
            </Badge>
          )}
        </div>
      </div>
    </motion.section>
  );
}
