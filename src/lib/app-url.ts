/**
 * Resolve public app URL for OG tags, share links, and emails.
 * Prefer NEXT_PUBLIC_APP_URL; fall back to Vercel-injected host in deploys.
 */
export function getAppUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");

  // Stable production hostname on Vercel (e.g. credex-intern.vercel.app), not per-deploy URLs
  const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (productionHost) return `https://${productionHost}`;

  const vercelHost = process.env.VERCEL_URL?.trim();
  if (vercelHost) return `https://${vercelHost}`;

  return "http://localhost:3000";
}

/** Hostname only — for OG image footer, etc. */
export function getAppHostname(): string {
  try {
    return new URL(getAppUrl()).hostname;
  } catch {
    return "localhost";
  }
}
