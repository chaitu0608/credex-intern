import { describe, expect, it } from "vitest";
import {
  isHoneypotTriggered,
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
