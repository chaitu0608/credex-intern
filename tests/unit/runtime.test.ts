import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  allowsMemoryOnlyPersistence,
  isProductionRuntime,
  isRateLimitEnabled,
} from "@/lib/runtime";

describe("runtime persistence policy (P1-4)", () => {
  const env = { ...process.env };

  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  afterEach(() => {
    process.env = { ...env };
    vi.unstubAllEnvs();
  });

  it("treats Vercel production as production", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("VERCEL_ENV", "production");
    expect(isProductionRuntime()).toBe(true);
    expect(allowsMemoryOnlyPersistence()).toBe(false);
  });

  it("allows memory-only persistence in development", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("VERCEL_ENV", "development");
    expect(isProductionRuntime()).toBe(false);
    expect(allowsMemoryOnlyPersistence()).toBe(true);
  });
});

describe("isRateLimitEnabled", () => {
  const env = { ...process.env };

  beforeEach(() => {
    vi.unstubAllEnvs();
    delete process.env.E2E_SKIP_RATE_LIMIT;
  });

  afterEach(() => {
    process.env = { ...env };
    vi.unstubAllEnvs();
  });

  it("is enabled by default", () => {
    expect(isRateLimitEnabled()).toBe(true);
  });

  it("is disabled when E2E_SKIP_RATE_LIMIT is set", () => {
    vi.stubEnv("E2E_SKIP_RATE_LIMIT", "1");
    expect(isRateLimitEnabled()).toBe(false);
  });
});
