import { describe, expect, it } from "vitest";
import {
  isHoneypotResponseId,
  isHoneypotTriggered,
  toPersistedAuditInput,
  validateAuditInput,
  validateLeadInput,
} from "@/lib/validation";

describe("validateAuditInput", () => {
  it("UNIT-004 rejects negative team size", () => {
    const result = validateAuditInput({
      tools: [{ tool: "cursor", plan: "pro", monthlySpend: 20, seats: 1 }],
      teamSize: -1,
      useCase: "coding",
    });
    expect(result.ok).toBe(false);
  });

  it("UNIT-004 rejects negative monthly spend", () => {
    const result = validateAuditInput({
      tools: [{ tool: "cursor", plan: "pro", monthlySpend: -50, seats: 1 }],
      teamSize: 1,
      useCase: "coding",
    });
    expect(result.ok).toBe(false);
  });

  it("rejects empty tool list", () => {
    expect(
      validateAuditInput({ tools: [], teamSize: 1, useCase: "coding" }).ok
    ).toBe(false);
  });

  it("rejects unknown use case", () => {
    expect(
      validateAuditInput({
        tools: [{ tool: "cursor", plan: "pro", monthlySpend: 20, seats: 1 }],
        teamSize: 1,
        useCase: "bogus",
      }).ok
    ).toBe(false);
  });

  it("rejects seats < 1", () => {
    expect(
      validateAuditInput({
        tools: [{ tool: "cursor", plan: "pro", monthlySpend: 20, seats: 0 }],
        teamSize: 1,
        useCase: "coding",
      }).ok
    ).toBe(false);
  });

  it("accepts valid input including zero monthly spend (free tier)", () => {
    expect(
      validateAuditInput({
        tools: [{ tool: "claude", plan: "free", monthlySpend: 0, seats: 1 }],
        teamSize: 3,
        useCase: "writing",
      }).ok
    ).toBe(true);
  });

  it("rejects unknown tool", () => {
    const result = validateAuditInput({
      tools: [{ tool: "fake-tool", plan: "pro", monthlySpend: 20, seats: 1 }],
      teamSize: 1,
      useCase: "coding",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/unknown tool/i);
  });

  it("rejects invalid plan for tool", () => {
    const result = validateAuditInput({
      tools: [{ tool: "cursor", plan: "plus", monthlySpend: 20, seats: 1 }],
      teamSize: 1,
      useCase: "coding",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/invalid plan/i);
  });

  it("accepts gemini ultra and anthropic-api", () => {
    expect(
      validateAuditInput({
        tools: [
          { tool: "gemini", plan: "ultra", monthlySpend: 199.99, seats: 1 },
          { tool: "anthropic-api", plan: "api", monthlySpend: 100, seats: 1 },
        ],
        teamSize: 2,
        useCase: "data",
      }).ok
    ).toBe(true);
  });

  it("rejects duplicate tool in stack", () => {
    const result = validateAuditInput({
      tools: [
        { tool: "cursor", plan: "pro", monthlySpend: 20, seats: 1 },
        { tool: "cursor", plan: "business", monthlySpend: 40, seats: 1 },
      ],
      teamSize: 2,
      useCase: "coding",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/duplicate tool/i);
  });
});

describe("validateLeadInput", () => {
  it("rejects bad email", () => {
    expect(validateLeadInput({ email: "nope", auditId: "abc" }).ok).toBe(false);
  });

  it("rejects missing auditId", () => {
    expect(validateLeadInput({ email: "a@b.co" }).ok).toBe(false);
  });

  it("accepts valid email + auditId", () => {
    expect(
      validateLeadInput({ email: "a@b.co", auditId: "abc123" }).ok
    ).toBe(true);
  });

  it("rejects invalid teamSize when provided", () => {
    expect(
      validateLeadInput({ email: "a@b.co", auditId: "abc", teamSize: 0 }).ok
    ).toBe(false);
  });
});

describe("toPersistedAuditInput", () => {
  it("strips website honeypot from persisted audit input", () => {
    const persisted = toPersistedAuditInput({
      tools: [{ tool: "cursor", plan: "pro", monthlySpend: 20, seats: 1 }],
      teamSize: 2,
      useCase: "coding",
      website: "spam@bot.com",
    });
    expect(persisted).toEqual({
      tools: [{ tool: "cursor", plan: "pro", monthlySpend: 20, seats: 1 }],
      teamSize: 2,
      useCase: "coding",
    });
    expect("website" in persisted).toBe(false);
  });
});

describe("isHoneypotTriggered", () => {
  it("INT-003 detects filled honeypot", () => {
    expect(isHoneypotTriggered("bot@evil.com")).toBe(true);
  });

  it("ignores empty and undefined", () => {
    expect(isHoneypotTriggered("")).toBe(false);
    expect(isHoneypotTriggered(undefined)).toBe(false);
    expect(isHoneypotTriggered("   ")).toBe(false);
  });
});

describe("isHoneypotResponseId", () => {
  it("detects fake audit ids from honeypot API responses", () => {
    expect(isHoneypotResponseId("fake-abc123")).toBe(true);
    expect(isHoneypotResponseId("xFake-abc")).toBe(false);
    expect(isHoneypotResponseId("abc1234567")).toBe(false);
    expect(isHoneypotResponseId(undefined)).toBe(false);
  });
});
