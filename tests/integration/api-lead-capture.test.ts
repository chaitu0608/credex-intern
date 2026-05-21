import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST as auditPost } from "@/app/api/audit/route";
import { POST as leadPost } from "@/app/api/leads/route";

const { mockSend } = vi.hoisted(() => ({
  mockSend: vi.fn(),
}));

vi.mock("resend", () => ({
  Resend: class MockResend {
    emails = { send: mockSend };
  },
}));

function jsonRequest(url: string, body: unknown) {
  return new NextRequest(url, {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": "127.0.0.1" },
    body: JSON.stringify(body),
  });
}

async function createAudit() {
  const res = await auditPost(
    jsonRequest("http://localhost/api/audit", {
      tools: [{ tool: "cursor", plan: "business", monthlySpend: 40, seats: 1 }],
      teamSize: 1,
      useCase: "coding",
    })
  );
  return (await res.json()).id as string;
}

describe("POST /api/leads (INT-002)", () => {
  beforeEach(() => {
    mockSend.mockReset();
    vi.stubEnv("RESEND_API_KEY", "re_test_key");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("captures email with optional company/role after a real audit", async () => {
    const auditId = await createAudit();
    const res = await leadPost(
      jsonRequest("http://localhost/api/leads", {
        email: "founder@example.com",
        companyName: "Acme",
        role: "Founder",
        auditId,
      })
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
  });

  it("rejects invalid email with 400", async () => {
    const res = await leadPost(
      jsonRequest("http://localhost/api/leads", {
        email: "nope",
        auditId: "doesntmatter",
      })
    );
    expect(res.status).toBe(400);
  });

  it("rejects unknown auditId with 400", async () => {
    const res = await leadPost(
      jsonRequest("http://localhost/api/leads", {
        email: "founder@example.com",
        auditId: "not-real",
      })
    );
    expect(res.status).toBe(400);
  });

  it("returns emailSent false when Resend reports an error", async () => {
    mockSend.mockResolvedValue({ error: { message: "send failed" } });
    const auditId = await createAudit();
    const res = await leadPost(
      jsonRequest("http://localhost/api/leads", {
        email: "founder@example.com",
        auditId,
      })
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.emailSent).toBe(false);
  });

  it("returns emailSent true when Resend succeeds", async () => {
    mockSend.mockResolvedValue({ data: { id: "email_123" }, error: null });
    const auditId = await createAudit();
    const res = await leadPost(
      jsonRequest("http://localhost/api/leads", {
        email: "founder@example.com",
        auditId,
      })
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.emailSent).toBe(true);
  });

  it("INT-003 honeypot returns success without writing", async () => {
    const res = await leadPost(
      jsonRequest("http://localhost/api/leads", {
        email: "bot@example.com",
        auditId: "irrelevant",
        phone: "+1-bot",
      })
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
  });
});
