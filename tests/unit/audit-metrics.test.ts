import { describe, expect, it } from "vitest";
import {
  getOptimizationScore,
  getProjectedMonthlySpend,
  getSavingsPercent,
  getStackHealthNarrative,
  getTotalMonthlySpend,
} from "@/lib/audit-metrics";
import type { ToolEntry } from "@/types";

const tools: ToolEntry[] = [
  { tool: "cursor", plan: "pro", monthlySpend: 100, seats: 2 },
  { tool: "claude", plan: "team", monthlySpend: 300, seats: 5 },
];

describe("audit-metrics", () => {
  it("sums monthly spend across tools", () => {
    expect(getTotalMonthlySpend(tools)).toBe(400);
  });

  it("computes savings percent", () => {
    expect(getSavingsPercent(400, 80)).toBe(20);
  });

  it("returns null percent when spend is zero", () => {
    expect(getSavingsPercent(0, 50)).toBeNull();
  });

  it("computes projected spend after savings", () => {
    expect(getProjectedMonthlySpend(400, 80)).toBe(320);
  });

  it("optimization score is 100 minus savings percent", () => {
    expect(getOptimizationScore(38)).toBe(62);
    expect(getOptimizationScore(null)).toBe(100);
    expect(getOptimizationScore(0)).toBe(100);
  });

  it("narrative references actual savings percent for material waste", () => {
    const text = getStackHealthNarrative({
      savingsPercent: 35,
      totalMonthlySavings: 140,
      totalMonthlySpend: 400,
      teamSize: 5,
      useCase: "coding",
    });
    expect(text).toContain("35%");
    expect(text).toContain("materially over-provisioned");
  });

  it("narrative for zero savings says optimized", () => {
    const text = getStackHealthNarrative({
      savingsPercent: 0,
      totalMonthlySavings: 0,
      totalMonthlySpend: 400,
      teamSize: 3,
      useCase: "mixed",
    });
    expect(text).toContain("relatively optimized");
  });
});
