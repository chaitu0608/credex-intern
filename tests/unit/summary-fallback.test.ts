import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { generateAISummary } from "@/lib/anthropic";
import { runAudit } from "@/lib/auditEngine";
import type { AuditInput } from "@/types";

const sampleInput: AuditInput = {
  teamSize: 3,
  useCase: "coding",
  tools: [{ tool: "cursor", plan: "business", monthlySpend: 120, seats: 3 }],
};

describe("AI summary fallback (UNIT-006)", () => {
  const originalKey = process.env.ANTHROPIC_API_KEY;

  beforeEach(() => {
    delete process.env.ANTHROPIC_API_KEY;
  });

  afterEach(() => {
    if (originalKey !== undefined) process.env.ANTHROPIC_API_KEY = originalKey;
  });

  it("returns templated summary with source template when no API key", async () => {
    const result = runAudit(sampleInput);
    const { summary, source } = await generateAISummary(result, sampleInput);
    expect(source).toBe("template");
    expect(typeof summary).toBe("string");
    expect(summary.length).toBeGreaterThan(40);
    expect(summary).toMatch(/\$\d+/);
  });

  it("mentions Credex only when isHighSavings", async () => {
    const highInput: AuditInput = {
      teamSize: 8,
      useCase: "writing",
      tools: [
        { tool: "claude", plan: "max", monthlySpend: 800, seats: 8 },
        { tool: "chatgpt", plan: "team", monthlySpend: 240, seats: 8 },
      ],
    };
    const result = runAudit(highInput);
    const { summary } = await generateAISummary(result, highInput);
    if (result.isHighSavings) {
      expect(summary.toLowerCase()).toContain("credex");
    }
  });

  it("does not throw on edge inputs (zero savings)", async () => {
    const input: AuditInput = {
      teamSize: 1,
      useCase: "coding",
      tools: [{ tool: "cursor", plan: "pro", monthlySpend: 20, seats: 1 }],
    };
    const result = runAudit(input);
    const { summary, source } = await generateAISummary(result, input);
    expect(summary).toBeTruthy();
    expect(source).toBe("template");
  });
});
