# Submission review walkthrough (Day 7)

Assignment checklist against current repo state. Last updated: **2026-05-22**.

## Submission deliverables

| Requirement | Status | Action |
|-------------|--------|--------|
| Public GitHub repo | ✅ | Push today's commits |
| Live deployed URL | ✅ | https://credex-intern.vercel.app — smoke passed 2026-05-22 (audit persist + share URL) |
| All required root `.md` files | ✅ | 11 real files at repo root (not symlinks) |
| README: summary | ✅ | |
| README: 3+ screenshots or Loom | ✅ | 7 in `docs/screenshots/` |
| README: quick start | ✅ | |
| README: 5 Decisions | ✅ | |
| README: deployed URL | ✅ | Live URL + prod smoke verified |

## MVP (6 features)

| # | Feature | Code | Live verified |
|---|---------|------|---------------|
| 1 | Spend form | ✅ | ✅ prod smoke |
| 2 | Audit engine | ✅ | ✅ prod smoke |
| 3 | Results page | ✅ | ✅ prod smoke |
| 4 | AI summary | ✅ | ✅ OpenAI on Vercel |
| 5 | Lead capture | ✅ | ✅ Supabase; Resend optional |
| 6 | Share URL + OG | ✅ | ✅ prod smoke |

## Technical constraints

| Constraint | Status |
|------------|--------|
| TypeScript | ✅ |
| No templates/builders | ✅ |
| Lighthouse Perf ≥ 85 | run on prod |
| Lighthouse A11y ≥ 90 | run on prod |
| Lighthouse BP ≥ 90 | run on prod |
| No secrets in repo | ✅ |
| ≥ 5 audit engine tests | ✅ (23 tests) |
| CI green | push + check Actions |

## Git

| Requirement | Status |
|-------------|--------|
| ≥ 5 distinct commit days | ⚠️ (4 days: 5/19–5/22; DEVLOG has 7 calendar entries 5/16–5/22) |
| Conventional commits | use today |

## Entrepreneurial docs

| Doc | Status |
|-----|--------|
| GTM 300–700 words, specific channels | ✅ |
| ECONOMICS with math | ✅ |
| USER_INTERVIEWS 3 real | ✅ | 3 conversations — company-sponsored AI subscribers; async review format (see [`USER_INTERVIEWS.md`](../../USER_INTERVIEWS.md)) |
| LANDING_COPY FAQ | ✅ |
| METRICS pivot trigger | ✅ |
| ARCHITECTURE 10k/day | ✅ |
| DEVLOG format + honesty | ✅ |
| REFLECTION 5 questions | ✅ |

## Optional elite docs (`docs/`)

All 14 files present — see [`../README.md`](../README.md) technical index.

## Production env checklist (user action)

Paste into **Vercel → Settings → Environment Variables** (same as `.env.local`):

1. `NEXT_PUBLIC_SUPABASE_URL`
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. `SUPABASE_SERVICE_ROLE_KEY`
4. `OPENAI_API_KEY` (optional; template fallback works)
5. `RESEND_API_KEY` (optional)
6. `NEXT_PUBLIC_APP_URL` = `https://credex-intern.vercel.app` (no trailing slash)

Then redeploy and run:

```bash
npm run verify:env
npm run test:supabase
SMOKE_BASE_URL=https://credex-intern.vercel.app npm run smoke
```

Log results in [`verify-prod.md`](verify-prod.md). Full walkthrough: [`../setup/inputs-needed.md`](../setup/inputs-needed.md).
