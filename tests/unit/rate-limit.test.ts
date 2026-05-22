import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("checkRateLimit (P3 fail-closed)", () => {
  const env = { ...process.env };

  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  });

  afterEach(() => {
    process.env = { ...env };
    vi.unstubAllEnvs();
  });

  it("allows requests in dev when admin client is missing", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("VERCEL_ENV", "development");
    const { checkRateLimit } = await import("@/lib/supabase");
    expect(await checkRateLimit("1.2.3.4")).toBe(true);
  });

  it("blocks requests in production when admin client is missing", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("VERCEL_ENV", "production");
    const { checkRateLimit } = await import("@/lib/supabase");
    expect(await checkRateLimit("1.2.3.4")).toBe(false);
  });

  it("allows requests when CI disables rate limiting", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("CI", "true");
    const { checkRateLimit } = await import("@/lib/supabase");
    expect(await checkRateLimit("1.2.3.4")).toBe(true);
  });

  it("allows requests when E2E_SKIP_RATE_LIMIT is set", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("E2E_SKIP_RATE_LIMIT", "1");
    const { checkRateLimit } = await import("@/lib/supabase");
    expect(await checkRateLimit("1.2.3.4")).toBe(true);
  });
});
