import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  allowsMemoryOnlyPersistence,
  isProductionRuntime,
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
