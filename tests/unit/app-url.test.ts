import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { getAppUrl } from "@/lib/app-url";

describe("getAppUrl", () => {
  const env = { ...process.env };

  beforeEach(() => {
    delete process.env.NEXT_PUBLIC_APP_URL;
    delete process.env.VERCEL_PROJECT_PRODUCTION_URL;
    delete process.env.VERCEL_URL;
  });

  afterEach(() => {
    process.env = { ...env };
  });

  it("prefers NEXT_PUBLIC_APP_URL when set", () => {
    process.env.NEXT_PUBLIC_APP_URL = "https://credex-intern.vercel.app/";
    expect(getAppUrl()).toBe("https://credex-intern.vercel.app");
  });

  it("uses VERCEL_PROJECT_PRODUCTION_URL before VERCEL_URL", () => {
    process.env.VERCEL_PROJECT_PRODUCTION_URL = "credex-intern.vercel.app";
    process.env.VERCEL_URL = "credex-intern-abc123.vercel.app";
    expect(getAppUrl()).toBe("https://credex-intern.vercel.app");
  });

  it("falls back to localhost when no env", () => {
    expect(getAppUrl()).toBe("http://localhost:3000");
  });
});
