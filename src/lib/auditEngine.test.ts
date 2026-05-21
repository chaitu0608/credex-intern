import { describe, expect, it } from "vitest";
import { calculateCurrentCost } from "@/lib/pricing";
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

  it("drops the lower-spend writing assistant, not the higher", () => {
    const result = runAudit(
      baseInput({
        teamSize: 4,
        useCase: "writing",
        tools: [
          { tool: "claude", plan: "pro", monthlySpend: 80, seats: 4 },
          { tool: "chatgpt", plan: "plus", monthlySpend: 20, seats: 4 },
        ],
      })
    );

    const dup = result.recommendations.find((r) => r.tool === "chatgpt");
    expect(dup).toBeDefined();
    expect(dup?.savings).toBe(20);
    expect(dup?.alternativeTool).toBe("Claude");

    const claudeDrop = result.recommendations.find(
      (r) =>
        r.tool === "claude" &&
        r.savings > 0 &&
        r.recommendationType === "switch-tool"
    );
    expect(claudeDrop).toBeUndefined();
  });

  it("downgrades Gemini Ultra to Pro using list prices from PRICING_DATA", () => {
    const result = runAudit(
      baseInput({
        teamSize: 3,
        useCase: "writing",
        tools: [
          { tool: "gemini", plan: "ultra", monthlySpend: 249.99, seats: 1 },
        ],
      })
    );
    const ultraList = calculateCurrentCost("gemini", "ultra", 1)!;
    const proList = calculateCurrentCost("gemini", "pro", 1)!;
    const gemini = result.recommendations.find((r) => r.tool === "gemini");
    expect(gemini?.recommendationType).toBe("downgrade");
    expect(gemini?.recommendedAction).toMatch(/Gemini Pro/i);
    expect(gemini?.savings).toBe(ultraList - proList);
    expect(gemini?.savings).toBeCloseTo(229.99, 2);
    expect(gemini?.reason).toMatch(/\$249\.99|\$250/);
  });

  it("downgrades solo Gemini Ultra regardless of use case", () => {
    const result = runAudit(
      baseInput({
        teamSize: 1,
        useCase: "coding",
        tools: [
          { tool: "gemini", plan: "ultra", monthlySpend: 249.99, seats: 1 },
        ],
      })
    );
    const gemini = result.recommendations.find((r) => r.tool === "gemini");
    expect(gemini?.savings).toBeCloseTo(229.99, 2);
  });

  it("surfaces API benchmark guidance for anthropic-api with zero fabricated savings", () => {
    const result = runAudit(
      baseInput({
        teamSize: 5,
        useCase: "data",
        tools: [
          { tool: "anthropic-api", plan: "api", monthlySpend: 1200, seats: 1 },
        ],
      })
    );
    const api = result.recommendations.find((r) => r.tool === "anthropic-api");
    expect(api?.recommendationType).toBe("use-credits");
    expect(api?.savings).toBe(0);
    expect(api?.reason).toMatch(/usage-based|token/i);
    expect(api?.reason).toMatch(/Anthropic API/i);
  });

  it("surfaces API benchmark guidance for claude api plan", () => {
    const result = runAudit(
      baseInput({
        teamSize: 4,
        useCase: "data",
        tools: [{ tool: "claude", plan: "api", monthlySpend: 900, seats: 1 }],
      })
    );
    const api = result.recommendations.find((r) => r.tool === "claude");
    expect(api?.recommendationType).toBe("use-credits");
    expect(api?.savings).toBe(0);
    expect(api?.reason).toMatch(/Claude/i);
  });

  it("surfaces API benchmark guidance for chatgpt api plan", () => {
    const result = runAudit(
      baseInput({
        teamSize: 3,
        useCase: "data",
        tools: [{ tool: "chatgpt", plan: "api", monthlySpend: 450, seats: 1 }],
      })
    );
    const api = result.recommendations.find((r) => r.tool === "chatgpt");
    expect(api?.savings).toBe(0);
    expect(api?.reason).toMatch(/ChatGPT/i);
  });

  it("surfaces API benchmark guidance for gemini api plan", () => {
    const result = runAudit(
      baseInput({
        teamSize: 2,
        useCase: "data",
        tools: [{ tool: "gemini", plan: "api", monthlySpend: 300, seats: 1 }],
      })
    );
    const api = result.recommendations.find((r) => r.tool === "gemini");
    expect(api?.recommendationType).toBe("use-credits");
    expect(api?.savings).toBe(0);
    expect(api?.reason).toMatch(/Google Gemini/i);
  });

  it("does not downgrade Gemini Ultra for coding teams with multiple seats", () => {
    const result = runAudit(
      baseInput({
        teamSize: 5,
        useCase: "coding",
        tools: [
          { tool: "gemini", plan: "ultra", monthlySpend: 249.99, seats: 1 },
        ],
      })
    );
    const gemini = result.recommendations.find((r) => r.tool === "gemini");
    expect(gemini?.recommendationType).not.toBe("downgrade");
    expect(gemini?.savings).toBe(0);
  });

  it("surfaces API benchmark guidance for openai-api", () => {
    const result = runAudit(
      baseInput({
        teamSize: 3,
        useCase: "data",
        tools: [{ tool: "openai-api", plan: "api", monthlySpend: 800, seats: 1 }],
      })
    );
    const api = result.recommendations.find((r) => r.tool === "openai-api");
    expect(api?.savings).toBe(0);
    expect(api?.reason).toMatch(/token|usage-based/i);
  });

  it("mentions Credex credits on high-spend direct API usage", () => {
    const result = runAudit(
      baseInput({
        teamSize: 10,
        useCase: "data",
        tools: [
          { tool: "openai-api", plan: "api", monthlySpend: 600, seats: 1 },
        ],
      })
    );
    const api = result.recommendations.find((r) => r.tool === "openai-api");
    expect(api?.reason).toMatch(/Credex/i);
  });

  it("caps writing-duplicate savings at catalog list price not reported overspend", () => {
    const result = runAudit(
      baseInput({
        teamSize: 2,
        useCase: "writing",
        tools: [
          { tool: "gemini", plan: "pro", monthlySpend: 50, seats: 1 },
          { tool: "chatgpt", plan: "plus", monthlySpend: 200, seats: 4 },
        ],
      })
    );
    const listCap = calculateCurrentCost("gemini", "pro", 1)!;
    const dup = result.recommendations.find((r) => r.tool === "gemini");
    expect(dup?.savings).toBe(listCap);
    expect(dup?.savings).toBe(20);
    expect(dup?.savings).toBeLessThan(50);
  });

  it("includes Gemini in writing-duplicate consolidation", () => {
    const result = runAudit(
      baseInput({
        teamSize: 2,
        useCase: "writing",
        tools: [
          { tool: "gemini", plan: "pro", monthlySpend: 20, seats: 1 },
          { tool: "claude", plan: "pro", monthlySpend: 80, seats: 4 },
        ],
      })
    );
    const drop = result.recommendations.find((r) => r.tool === "gemini");
    expect(drop?.savings).toBe(20);
    expect(drop?.alternativeTool).toBe("Claude");
  });

  it("does not double-count per-tool and overlap savings beyond one line per tool", () => {
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
    const toolsWithSavings = result.recommendations.filter((r) => r.savings > 0);
    const toolIds = toolsWithSavings.map((r) => r.tool);
    expect(new Set(toolIds).size).toBe(toolIds.length);
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
