## Day 1 — 2026-05-19

**Hours worked:** ~7

**What I did:**
- SpendSense UI: teal/indigo branding, two-column hero, sticky savings sidebar, timeline results
- Full MVP flow: form → audit engine → AI summary → results → email gate → share URL
- Supabase schema + secure RLS (public read audits only; writes via service role)
- Verification scripts: `npm run verify:env`, `npm run test:supabase`, `npm run smoke`
- Smoke E2E passed on `http://localhost:3005` (memory mode — Supabase keys pending in `.env.local`)
- Abuse protection: honeypot (`website`, `phone`) + rate limit 10/IP/hour

**What I learned:**
- Service role key is required for persistence; anon key alone only enables share-page reads
- Resend free tier works with `onboarding@resend.dev` — no domain verification needed for MVP

**Blockers / what I'm stuck on:**
- **User action:** Paste Supabase, Anthropic, and Resend keys into `.env.local` — see [`docs/KEYS_CHECKLIST.md`](docs/KEYS_CHECKLIST.md)
- **User action:** Vercel deploy + set `NEXT_PUBLIC_APP_URL` to production URL — see [`docs/DEPLOY.md`](docs/DEPLOY.md)

**Plan for tomorrow (Day 2):**
- Re-run smoke + `test:supabase` after keys added
- Deploy to Vercel; Lighthouse on prod URL
- Final pricing cross-check

**Deployed URL:** _(add after Vercel — e.g. https://spendsense.vercel.app)_

---

## Day 2 — 2026-05-19

**Hours worked:** ~4

**What I did:**
- `PRICING_DATA.md` — all 8 tools with official URLs (checked 2026-05-19)
- 10 Vitest tests (`auditEngine` + `pricing`)
- GitHub Actions CI: test + build + lint
- `ARCHITECTURE.md`, `PROMPTS.md`, `GTM.md`, `TESTS.md`
- `docs/KEYS_CHECKLIST.md`, `docs/DEPLOY.md`, `vercel.json`

**What I learned:**
- Pricing tests catch assignment drift (e.g. Gemini pro/ultra/api plan keys)
- Smoke script automates MVP verification in ~1s

**Blockers:**
- Lighthouse on production URL pending Vercel deploy

**Lighthouse scores (local prod build `localhost:3005`, mobile):**
| Metric | Score |
|--------|-------|
| Performance | 96 |
| Accessibility | 89 |
| Best Practices | 100 |
| SEO | 100 |

_Re-run on Vercel URL after deploy for submission._

**Commands used:**
```bash
npm test && npm run build && npm run lint
SMOKE_BASE_URL=http://localhost:3005 npm run smoke
npm run verify:env   # fails until keys pasted
npm run test:supabase  # fails until Supabase keys pasted
```
