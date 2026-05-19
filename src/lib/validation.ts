import type { AuditInput, LeadCapture, UseCase } from "@/types";

export const USE_CASES: UseCase[] = [
  "coding",
  "writing",
  "data",
  "research",
  "mixed",
];

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ValidationResult =
  | { ok: true }
  | { ok: false; error: string };

/** Validates audit input shape. Honeypot check is separate. */
export function validateAuditInput(input: unknown): ValidationResult {
  if (!input || typeof input !== "object") {
    return { ok: false, error: "Invalid input" };
  }
  const body = input as Partial<AuditInput>;

  if (!Array.isArray(body.tools) || body.tools.length === 0) {
    return { ok: false, error: "At least one tool is required" };
  }

  if (typeof body.teamSize !== "number" || body.teamSize < 1) {
    return { ok: false, error: "Team size must be at least 1" };
  }

  if (!body.useCase || !USE_CASES.includes(body.useCase)) {
    return { ok: false, error: "Invalid use case" };
  }

  for (const t of body.tools) {
    if (!t || typeof t !== "object") {
      return { ok: false, error: "Invalid tool entry" };
    }
    if (!t.tool || !t.plan) {
      return { ok: false, error: "Tool and plan are required" };
    }
    if (typeof t.monthlySpend !== "number" || t.monthlySpend < 0) {
      return { ok: false, error: "Monthly spend must be >= 0" };
    }
    if (typeof t.seats !== "number" || t.seats < 1) {
      return { ok: false, error: "Seats must be at least 1" };
    }
  }

  return { ok: true };
}

/** Honeypot — bots fill hidden fields. */
export function isHoneypotTriggered(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

export function validateLeadInput(input: unknown): ValidationResult {
  if (!input || typeof input !== "object") {
    return { ok: false, error: "Invalid input" };
  }
  const body = input as Partial<LeadCapture>;

  if (!body.email || !EMAIL_RE.test(body.email)) {
    return { ok: false, error: "Invalid email" };
  }

  if (!body.auditId || typeof body.auditId !== "string") {
    return { ok: false, error: "Missing auditId" };
  }

  if (
    body.teamSize !== undefined &&
    (typeof body.teamSize !== "number" || body.teamSize < 1)
  ) {
    return { ok: false, error: "Invalid teamSize" };
  }

  return { ok: true };
}
