import { describe, expect, it } from "vitest";
import {
  getProjectedMonthlySpend,
  getSavingsPercent,
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
});
