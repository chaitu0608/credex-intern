import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { POST as auditPost } from "@/app/api/audit/route";
import { POST as leadPost } from "@/app/api/leads/route";

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
