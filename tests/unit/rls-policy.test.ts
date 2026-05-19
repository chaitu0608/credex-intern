import { describe, expect, it } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

const schema = readFileSync(
  resolve(__dirname, "../../supabase/schema.sql"),
  "utf8"
);

describe("Supabase RLS policy (security baseline)", () => {
  it("enables RLS on every table", () => {
    expect(schema).toMatch(/alter table audits enable row level security/i);
    expect(schema).toMatch(/alter table leads enable row level security/i);
    expect(schema).toMatch(
      /alter table rate_limits enable row level security/i
    );
  });

  it("only audits has a public read policy", () => {
    expect(schema).toMatch(/policy "audits public read"/i);
    // No public read policy on leads — PII protection
    expect(schema).not.toMatch(/policy[^;]+leads[^;]+for select/i);
  });

  it("does not grant public insert/update/delete on audits or leads", () => {
    expect(schema).not.toMatch(/policy[^;]+audits[^;]+for insert/i);
    expect(schema).not.toMatch(/policy[^;]+leads[^;]+for insert/i);
    expect(schema).not.toMatch(/policy[^;]+leads[^;]+for update/i);
    expect(schema).not.toMatch(/policy[^;]+leads[^;]+for delete/i);
  });
});
