#!/usr/bin/env node
/**
 * Verify required env vars without printing secrets.
 * Usage: node scripts/verify-env.mjs
 */
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = resolve(root, ".env.local");

const required = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "NEXT_PUBLIC_APP_URL",
];

const optional = ["OPENAI_API_KEY", "RESEND_API_KEY"];

if (!existsSync(envPath)) {
  console.error("Missing .env.local — copy from .env.example");
  process.exit(1);
}

const raw = readFileSync(envPath, "utf8");
const vars = Object.fromEntries(
  raw
    .split("\n")
    .filter((l) => l && !l.startsWith("#"))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i), l.slice(i + 1).trim()];
    })
);

let ok = true;
console.log("Required:");
for (const key of required) {
  const val = vars[key] ?? "";
  const set = val.length > 0;
  console.log(`  ${set ? "✓" : "✗"} ${key}`);
  if (!set) ok = false;
}

console.log("Optional (app degrades gracefully if missing):");
for (const key of optional) {
  const val = vars[key] ?? "";
  const set = val.length > 0;
  console.log(`  ${set ? "✓" : "○"} ${key}`);
}

process.exit(ok ? 0 : 1);
