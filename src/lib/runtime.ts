/** True on Vercel production and `next start` — not local `next dev`. */
export function isProductionRuntime(): boolean {
  return (
    process.env.NODE_ENV === "production" ||
    process.env.VERCEL_ENV === "production"
  );
}

/** Memory-only Supabase fallback is allowed only outside production. */
export function allowsMemoryOnlyPersistence(): boolean {
  return !isProductionRuntime();
}

/**
 * Rate limits apply in real deployments only — not Playwright e2e servers
 * (`next start` is production NODE_ENV but must not share one IP bucket with prod).
 */
export function isRateLimitEnabled(): boolean {
  if (process.env.E2E_SKIP_RATE_LIMIT === "1") return false;
  return true;
}
