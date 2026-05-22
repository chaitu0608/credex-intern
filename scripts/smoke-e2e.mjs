#!/usr/bin/env node
/**
 * Local smoke test for SpendSense MVP flow.
 * Usage: npm run dev (in another terminal) then node scripts/smoke-e2e.mjs
 */
const BASE = process.env.SMOKE_BASE_URL || "http://localhost:3000";

const auditPayload = {
  tools: [
    { tool: "cursor", plan: "business", monthlySpend: 40, seats: 1 },
    { tool: "claude", plan: "team", monthlySpend: 150, seats: 5 },
  ],
  teamSize: 2,
  useCase: "writing",
};

async function req(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, options);
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text.slice(0, 200) };
  }
  return { status: res.status, json };
}

async function main() {
  console.log(`Smoke test → ${BASE}\n`);

  const home = await req("/");
  if (home.status !== 200) {
    console.error("✗ Home page", home.status);
    process.exit(1);
  }
  console.log("✓ Home page 200");

  const audit = await req("/api/audit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(auditPayload),
  });

  if (audit.status !== 200 || !audit.json.id) {
    console.error("✗ POST /api/audit", audit.status, audit.json);
    process.exit(1);
  }
  console.log("✓ POST /api/audit", audit.json.id, `$${audit.json.totalMonthlySavings}/mo`);

  const results = await req(`/audit/${audit.json.id}`);
  if (results.status !== 200) {
    console.error("✗ GET /audit/[id]", results.status);
    process.exit(1);
  }
  const html = results.json.raw ?? "";
  if (typeof results.json.raw === "string" && !html.includes("SpendSense")) {
    // parsed as json incorrectly - refetch as text
  }
  const pageRes = await fetch(`${BASE}/audit/${audit.json.id}`);
  const pageHtml = await pageRes.text();
  if (pageHtml.includes("Audit not found")) {
    console.error(
      "✗ GET /audit/[id] — audit not found (set Supabase keys on Vercel for persistence)"
    );
    process.exit(1);
  }
  if (
    !pageHtml.includes("Potential savings") &&
    !pageHtml.includes("Small wins available") &&
    !pageHtml.includes("Stack optimized")
  ) {
    console.error("✗ Results page missing savings hero");
    process.exit(1);
  }
  console.log("✓ GET /audit/[id] renders results");

  if (!pageHtml.includes("og:title") && !pageHtml.includes("openGraph")) {
    // Next.js metadata may be in meta tags
    if (!pageHtml.includes('property="og:title"') && !pageHtml.includes("twitter:card")) {
      console.warn("⚠ OG meta tags not found in HTML (may still be set via metadata API)");
    }
  } else {
    console.log("✓ OG / metadata present");
  }

  const lead = await req("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "smoke-test@example.com",
      auditId: audit.json.id,
      companyName: "Smoke Co",
    }),
  });

  if (lead.status !== 200 || !lead.json.success) {
    console.error("✗ POST /api/leads", lead.status, lead.json);
    process.exit(1);
  }
  console.log("✓ POST /api/leads", lead.json.emailSent ? "(email sent)" : "(no Resend key)");

  const honeypot = await req("/api/audit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...auditPayload, website: "bot@test.com" }),
  });
  if (honeypot.status !== 200 || !String(honeypot.json.id).startsWith("fake-")) {
    console.error("✗ Honeypot should return fake id");
    process.exit(1);
  }
  console.log("✓ Honeypot on /api/audit");

  const invalidTool = await req("/api/audit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...auditPayload,
      tools: [{ tool: "fake-tool", plan: "pro", monthlySpend: 10, seats: 1 }],
    }),
  });
  if (invalidTool.status !== 400) {
    console.error("✗ Unknown tool should return 400", invalidTool.status, invalidTool.json);
    process.exit(1);
  }
  console.log("✓ Unknown tool rejected (400)");

  const geminiUltra = await req("/api/audit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      tools: [{ tool: "gemini", plan: "ultra", monthlySpend: 199.99, seats: 1 }],
      teamSize: 1,
      useCase: "writing",
    }),
  });
  if (geminiUltra.status !== 200) {
    console.error("✗ Gemini Ultra audit", geminiUltra.status, geminiUltra.json);
    process.exit(1);
  }
  const geminiSavings = geminiUltra.json.totalMonthlySavings;
  if (typeof geminiSavings !== "number" || Math.abs(geminiSavings - 229.99) > 0.02) {
    console.error("✗ Gemini Ultra → Pro savings expected ~229.99, got", geminiSavings);
    process.exit(1);
  }
  console.log("✓ P2 Gemini Ultra downgrade $229.99/mo");

  const apiOnly = await req("/api/audit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      tools: [{ tool: "anthropic-api", plan: "api", monthlySpend: 1200, seats: 1 }],
      teamSize: 5,
      useCase: "data",
    }),
  });
  if (apiOnly.status !== 200 || apiOnly.json.totalMonthlySavings !== 0) {
    console.error("✗ API tool audit should have $0 savings", apiOnly.json);
    process.exit(1);
  }
  console.log("✓ P2 direct API $0 fabricated savings");

  console.log("\nAll smoke checks passed.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
