import { describe, expect, it } from "vitest";
import {
  HIGH_SAVINGS_THRESHOLD_MONTHLY,
  runAudit,
} from "@/lib/auditEngine";
import type { AuditInput } from "@/types";

const baseInput = (overrides: Partial<AuditInput> = {}): AuditInput => ({
  tools: [],
  teamSize: 3,
  useCase: "coding",
  ...overrides,
});

describe("runAudit", () => {
  it("flags high savings when total exceeds $500/mo", () => {
    const result = runAudit(
      baseInput({
        teamSize: 8,
        useCase: "writing",
        tools: [
          {
            tool: "claude",
            plan: "max",
            monthlySpend: 800,
            seats: 8,
          },
          {
            tool: "chatgpt",
            plan: "team",
            monthlySpend: 240,
            seats: 8,
          },
        ],
      })
    );
    expect(result.isHighSavings).toBe(true);
    expect(result.totalMonthlySavings).toBeGreaterThan(
      HIGH_SAVINGS_THRESHOLD_MONTHLY
    );
  });

  it("returns zero savings for an already-optimal solo stack", () => {
    const result = runAudit(
      baseInput({
        teamSize: 1,
        useCase: "coding",
        tools: [
          {
            tool: "cursor",
            plan: "pro",
            monthlySpend: 20,
            seats: 1,
          },
        ],
      })
    );
    expect(result.totalMonthlySavings).toBe(0);
    expect(result.isHighSavings).toBe(false);
    expect(
      result.recommendations.every((r) => r.recommendationType === "right-sized")
    ).toBe(true);
  });

  it("recommends Claude Team to Pro downgrade for small teams", () => {
    const result = runAudit(
      baseInput({
        teamSize: 2,
        useCase: "writing",
        tools: [
          {
            tool: "claude",
            plan: "team",
            monthlySpend: 150,
            seats: 5,
          },
        ],
      })
    );
    const claude = result.recommendations.find((r) => r.tool === "claude");
    expect(claude?.recommendationType).toBe("optimize-seats");
    expect(claude?.savings).toBeGreaterThan(0);
    expect(claude?.reason).toMatch(/\$\d+/);
  });

  it("recommends Cursor Business to Pro for single seat", () => {
    const result = runAudit(
      baseInput({
        teamSize: 1,
        tools: [
          {
            tool: "cursor",
            plan: "business",
            monthlySpend: 40,
            seats: 1,
          },
        ],
      })
    );
    const cursor = result.recommendations.find((r) => r.tool === "cursor");
    expect(cursor?.recommendedAction).toMatch(/Pro/i);
    expect(cursor?.savings).toBe(20);
  });

  it("suggests Windsurf alternative for large Copilot Business coding teams", () => {
    const result = runAudit(
      baseInput({
        teamSize: 10,
        useCase: "coding",
        tools: [
          {
            tool: "github-copilot",
            plan: "business",
            monthlySpend: 190,
            seats: 10,
          },
        ],
      })
    );
    const copilot = result.recommendations.find(
      (r) => r.tool === "github-copilot"
    );
    expect(copilot?.recommendationType).toBe("switch-tool");
    expect(copilot?.alternativeTool).toBe("Windsurf");
    expect(copilot?.savings).toBeGreaterThan(0);
  });

  it("detects duplicate writing assistants in mixed stacks", () => {
    const result = runAudit(
      baseInput({
        teamSize: 4,
        useCase: "writing",
        tools: [
          { tool: "claude", plan: "pro", monthlySpend: 80, seats: 4 },
          { tool: "chatgpt", plan: "plus", monthlySpend: 80, seats: 4 },
        ],
      })
    );
    expect(result.totalMonthlySavings).toBeGreaterThan(0);
    const dup = result.recommendations.find((r) => r.savings > 0);
    expect(dup?.reason).toMatch(/writing|duplicate|standardize/i);
  });

  it("flags Cursor + Copilot overlap on a coding team and drops the cheaper seat", () => {
    const result = runAudit(
      baseInput({
        teamSize: 6,
        useCase: "coding",
        tools: [
          { tool: "cursor", plan: "pro", monthlySpend: 120, seats: 6 },
          { tool: "github-copilot", plan: "business", monthlySpend: 114, seats: 6 },
        ],
      })
    );
    const overlap = result.recommendations.find(
      (r) => r.recommendationType === "switch-tool" && /IDE/i.test(r.recommendedAction)
    );
    expect(overlap).toBeDefined();
    expect(overlap?.savings).toBe(114);
    expect(overlap?.alternativeTool).toBe("Cursor");
  });
});
