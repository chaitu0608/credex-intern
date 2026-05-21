import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "@/app/api/audit/route";

function makeRequest(body: unknown) {
  return new NextRequest("http://localhost/api/audit", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": "127.0.0.1" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/audit (INT-001)", () => {
  it("creates an audit and returns a public share id", async () => {
    const res = await POST(
      makeRequest({
        tools: [
          { tool: "cursor", plan: "business", monthlySpend: 40, seats: 1 },
        ],
        teamSize: 1,
        useCase: "coding",
      })
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.id).toBeTruthy();
    expect(typeof json.totalMonthlySavings).toBe("number");
    expect(typeof json.isHighSavings).toBe("boolean");
  });

  it("returns 400 on invalid input", async () => {
    const res = await POST(
      makeRequest({ tools: [], teamSize: 0, useCase: "bogus" })
    );
    expect(res.status).toBe(400);
  });

  it("returns 400 for unknown tool", async () => {
    const res = await POST(
      makeRequest({
        tools: [{ tool: "fake-tool", plan: "pro", monthlySpend: 20, seats: 1 }],
        teamSize: 1,
        useCase: "coding",
      })
    );
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/unknown tool/i);
  });

  it("returns 400 for invalid plan", async () => {
    const res = await POST(
      makeRequest({
        tools: [{ tool: "claude", plan: "hobby", monthlySpend: 20, seats: 1 }],
        teamSize: 1,
        useCase: "writing",
      })
    );
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/invalid plan/i);
  });

  it("INT-003 returns fake id when honeypot is filled (no DB write)", async () => {
    const res = await POST(
      makeRequest({
        website: "bot@evil.com",
        tools: [
          { tool: "cursor", plan: "pro", monthlySpend: 20, seats: 1 },
        ],
        teamSize: 1,
        useCase: "coding",
      })
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.id.startsWith("fake-")).toBe(true);
  });
});
