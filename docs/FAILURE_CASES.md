# Failure cases

Explicit fail-open vs fail-closed behavior — reviewers asked for this in architecture reviews.

## Summary table

| Failure | Production | Development / E2E |
|---------|------------|-------------------|
| Rate limit DB unavailable | **Fail closed** → 429 | Fail open — allow request |
| OpenAI unavailable | Template summary; audit still saves | Same |
| Supabase insert fails (configured) | **503** — no shareable id | — |
| Supabase not configured | In-memory `Map` per instance | Same; `E2E_SKIP_RATE_LIMIT=1` for tests |
| Honeypot triggered | 200 decoy — no DB | Same |
| Chat without OpenAI | Static “unavailable” message | Same |

## In-memory audit store

[`src/lib/supabase.ts`](../src/lib/supabase.ts) + [`src/lib/runtime.ts`](../src/lib/runtime.ts):

- **Dev / Playwright:** audits may live in process memory only
- **Production:** must have `SUPABASE_SERVICE_ROLE_KEY` — otherwise inserts return **503**
- **Risk:** silent landmine if prod deploys without keys but appears to “work” locally

Documented honestly in [`README.md`](../README.md) and [`DEVLOG.md`](../DEVLOG.md).

## AI summary fallback

[`src/lib/ai-summary.ts`](../src/lib/ai-summary.ts) → `buildFallbackSummary` sets `summarySource: "template"`. Totals unchanged.

## Rate limit race

`checkRateLimit` retries on Postgres unique violation `23505` on `rate_limits.ip`.

## What we do not fail closed on

OpenAI errors — product still delivers deterministic recommendations and share URL.

**Related:** [`SECURITY.md`](SECURITY.md), [`ARCHITECTURE.md`](../ARCHITECTURE.md) section B
