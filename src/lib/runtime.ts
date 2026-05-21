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
