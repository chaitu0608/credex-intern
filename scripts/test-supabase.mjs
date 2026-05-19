#!/usr/bin/env node
/**
 * Test Supabase connectivity when keys are in .env.local
 * Loads .env.local manually (no dotenv dep)
 */
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = resolve(root, ".env.local");

if (!existsSync(envPath)) {
  console.error("Missing .env.local");
  process.exit(1);
}

for (const line of readFileSync(envPath, "utf8").split("\n")) {
  if (!line || line.startsWith("#")) continue;
  const i = line.indexOf("=");
  if (i < 0) continue;
  const k = line.slice(0, i);
  const v = line.slice(i + 1).trim();
  if (v) process.env[k] = v;
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !anon || !service) {
  console.error("Supabase keys missing in .env.local — see docs/KEYS_CHECKLIST.md");
  process.exit(1);
}

const admin = createClient(url, service);
const pub = createClient(url, anon);

const testId = `test-${Date.now()}`;

const row = {
  id: testId,
  input: { tools: [], teamSize: 1, useCase: "coding" },
  recommendations: [],
  total_monthly_savings: 0,
  total_annual_savings: 0,
  ai_summary: "connectivity test",
  is_high_savings: false,
};

const { error: insertErr } = await admin.from("audits").insert(row);
if (insertErr) {
  console.error("✗ Insert failed:", insertErr.message);
  console.error("  Did you run supabase/schema.sql?");
  process.exit(1);
}
console.log("✓ Service role insert");

const { data, error: readErr } = await pub
  .from("audits")
  .select("id")
  .eq("id", testId)
  .maybeSingle();

if (readErr || !data) {
  console.error("✗ Anon read failed:", readErr?.message);
  process.exit(1);
}
console.log("✓ Anon public read");

await admin.from("audits").delete().eq("id", testId);
console.log("✓ Cleanup done\nSupabase is ready.");
