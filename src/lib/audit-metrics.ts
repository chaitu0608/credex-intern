import type { ToolEntry, UseCase } from "@/types";

export function getTotalMonthlySpend(tools: ToolEntry[]): number {
  return tools.reduce((sum, t) => sum + t.monthlySpend, 0);
}

export function getSavingsPercent(
  totalSpend: number,
  monthlySavings: number
): number | null {
  if (totalSpend <= 0) return null;
  return Math.round((monthlySavings / totalSpend) * 100);
}

export function getProjectedMonthlySpend(
  totalSpend: number,
  monthlySavings: number
): number {
  return Math.max(0, totalSpend - monthlySavings);
}

/**
 * Stack optimization score: 100 = fully optimized, lower = more recoverable waste.
 * Derived from savings % of reported spend (display-only, not stored).
 */
export function getOptimizationScore(savingsPercent: number | null): number {
  if (savingsPercent === null) return 100;
  return Math.max(0, Math.min(100, 100 - savingsPercent));
}

export type StackHealthNarrativeParams = {
  savingsPercent: number | null;
  totalMonthlySavings: number;
  totalMonthlySpend: number;
  teamSize: number;
  useCase: UseCase;
};

/** Dynamic hero copy from audit metrics — template bands, real numbers inserted. */
export function getStackHealthNarrative(
  params: StackHealthNarrativeParams
): string {
  const {
    savingsPercent,
    totalMonthlySavings,
    totalMonthlySpend,
    teamSize,
    useCase,
  } = params;

  if (totalMonthlySavings === 0 || savingsPercent === null) {
    return `Your ${teamSize}-person team's AI stack for ${useCase} work appears already relatively optimized at ~$${totalMonthlySpend.toLocaleString()}/month across your reported tools.`;
  }

  if (savingsPercent >= 30) {
    return `Your AI stack appears materially over-provisioned for a ${teamSize}-person ${useCase} team. You could reduce costs by about ${savingsPercent}% (~$${totalMonthlySavings.toLocaleString()}/month) without significantly affecting productivity if you act on the recommendations below.`;
  }

  if (savingsPercent >= 10) {
    return `Your AI stack appears moderately over-provisioned. You could reduce costs by about ${savingsPercent}% (~$${totalMonthlySavings.toLocaleString()}/month) by right-sizing plans and seats for your ${teamSize}-person ${useCase} team.`;
  }

  return `Your stack is mostly right-sized for ${useCase} work, with small optimizations worth ~$${totalMonthlySavings.toLocaleString()}/month (${savingsPercent}% of current spend).`;
}
