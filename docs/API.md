# API reference

All routes are Next.js App Router handlers under `src/app/api/`. No separate backend service.

## `POST /api/audit`

Creates an audit from the landing form.

**Flow:** rate limit → honeypot → validate → `runAudit` → `generateAISummary` → `saveAudit`

| Status | When |
|--------|------|
| 200 | Success — `{ id, totalMonthlySavings, totalAnnualSavings, isHighSavings }` |
| 400 | Invalid body (unknown tool/plan, empty stack, bad `teamSize`/`useCase`) |
| 429 | Rate limit exceeded (10 POSTs per IP per hour) |
| 503 | Supabase configured but insert failed |

**Honeypot:** Non-empty `website` → 200 with fake id, zero savings, **no DB write**.

**Body (JSON):** tools array, `teamSize`, `useCase`, optional honeypot `website` (stripped before persist).

**Implementation:** [`src/app/api/audit/route.ts`](../src/app/api/audit/route.ts)

---

## `POST /api/leads`

Captures email after user sees full audit report.

| Status | When |
|--------|------|
| 200 | Lead saved (or honeypot decoy success) |
| 400 | Invalid email / missing fields |
| 429 | Same IP rate bucket as audits |

**Honeypot:** Non-empty `phone` → fake success, no DB.

**Optional:** Resend confirmation when `RESEND_API_KEY` is set.

**Implementation:** [`src/app/api/leads/route.ts`](../src/app/api/leads/route.ts)

---

## `POST /api/audit/[id]/chat`

Q&A about a **saved** audit only. Does not recompute savings or mutate DB.

| Status | When |
|--------|------|
| 200 | `{ reply }` from OpenAI |
| 404 | Unknown audit id |
| 429 | Rate limited |
| 503 | OpenAI unavailable — static fallback message |

**Implementation:** [`src/app/api/audit/[id]/chat/route.ts`](../src/app/api/audit/[id]/chat/route.ts)

---

## Read paths (not under `/api`)

| Route | Method | Purpose |
|-------|--------|---------|
| `/audit/[id]` | GET (SSR) | Share page — `getAudit` via anon key |
| `/audit/[id]/opengraph-image` | GET | Dynamic OG PNG |

See [`SEO.md`](SEO.md) for metadata.

**Related:** [`SECURITY.md`](SECURITY.md), [`FAILURE_CASES.md`](FAILURE_CASES.md), [`ARCHITECTURE.md`](../ARCHITECTURE.md)
