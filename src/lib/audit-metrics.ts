import type { ToolEntry } from "@/types";

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
