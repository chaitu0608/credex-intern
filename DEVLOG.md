# DEVLOG

Dated entries — every commit day is logged. Spans the 7-day assignment window.

---

## 2026-05-13 — Day 0 · Project setup + research

**Hours:** ~3

**Done:**
- Read the assignment brief in full; mapped six MVP features to a TODO list.
- Decided on Next.js 14 (App Router) + TypeScript + Tailwind + shadcn/ui. Rationale in [`ARCHITECTURE.md`](ARCHITECTURE.md).
- Pulled public pricing pages for Cursor, Claude, ChatGPT, Copilot, Gemini, Anthropic API, OpenAI API, Windsurf. First pass at [`PRICING_DATA.md`](PRICING_DATA.md) with URL + retrieval date for every number.
- Scaffolded the repo: `next create`, Tailwind config, base layout.

**Learned:** Claude Max ($100/mo) and ChatGPT Team ($30/seat) are the two most likely overspend hotspots based on Reddit threads and HN discussions.

**Blockers:** None.

---

## 2026-05-14 — Day 1 · Audit engine + form

**Hours:** ~6

**Done:**
- Hardcoded the audit rules in [`src/lib/auditEngine.ts`](src/lib/auditEngine.ts): plan-fit, seat-fit, duplicate writing assistant, Cursor + Copilot overlap, Claude Max → Pro, ChatGPT Team → Plus × N seats.
- Built the spend input form with persistent state in `localStorage`.
- Pricing constants in [`src/lib/pricing.ts`](src/lib/pricing.ts) (8 tools, all plans).

**Learned:** Keeping the math out of the LLM dramatically simplifies tests — every rule has a deterministic expected output.

**Blockers:** None.

---

## 2026-05-15 — Day 2 · Results page + share URL + AI summary

**Hours:** ~6

**Done:**
- Audit results page at `/audit/[id]`: hero savings number, per-tool breakdown, sticky sidebar on desktop.
- Shareable public URL with stripped PII, OG and Twitter card metadata.
- Anthropic integration with templated fallback when the API key or call fails.
- [`PROMPTS.md`](PROMPTS.md) with the exact system + user prompt and the fallback template.

**Learned:** The fallback template is genuinely good — Anthropic just adds tone polish, not new information.

**Blockers:** None.

---

## 2026-05-16 — Day 3 · Lead capture + backend

**Hours:** ~5

**Done:**
- Supabase project schema: `audits`, `leads`, `rate_limits`. RLS enabled. Public read on `audits` only, no public writes. SQL in [`supabase/schema.sql`](supabase/schema.sql).
- Lead capture API at `POST /api/leads` with optional company/role/team-size fields and a honeypot.
- Resend transactional email after lead capture with a "Credex will reach out" note on high-savings audits.
- Memory-mode fallback in [`src/lib/supabase.ts`](src/lib/supabase.ts) so local dev runs even without keys.

**Learned:** Anon key alone is not enough — service role key is required for server-side writes.

**Blockers:** None.

---

## 2026-05-17 — Day 4 · Abuse protection + verification scripts

**Hours:** ~4

**Done:**
- Honeypot fields (`website`, `phone`) on both audit + lead forms.
- Rate limit (10 audits / IP / hour) using `rate_limits` table.
- `scripts/verify-env.mjs`, `scripts/test-supabase.mjs`, `scripts/smoke-e2e.mjs`. Wired as `npm run verify:env`, `test:supabase`, `smoke`.
- First end-to-end smoke green in memory mode.

**Learned:** Documenting the abuse-protection rationale in [`ARCHITECTURE.md`](ARCHITECTURE.md) matters — reviewers should not have to read the code to know why.

**Blockers:** None.

---

## 2026-05-18 — Day 5 · UI polish + branding pass

**Hours:** ~5

**Done:**
- Branding pass: chose name **SpendSense**. Teal/indigo palette, DM Sans + Outfit typography, two-column hero with sample preview, trust marquee.
- Results page restructure: sticky `SavingsHero` aside, timeline-style per-tool list, low-savings honesty card, > $500/mo Credex CTA.
- [`LANDING_COPY.md`](LANDING_COPY.md) drafted as source of truth.

**Learned:** A visible sample preview on the landing page raised perceived value before any input was given.

**Blockers:** None.

---

## 2026-05-19 — Day 6 · Tests + CI + docs

**Hours:** ~6

**Done:**
- Vitest unit + integration suite: `auditEngine`, `pricing`, `validation`, `summary-fallback`, `rls-policy`, `api-audit`, `api-lead-capture` → **35 tests, all green**.
- Playwright scaffold: `user-journey`, `og-tags`, `accessibility` with axe-core.
- `.github/workflows/ci.yml` runs lint → typecheck → unit → build; separate job runs Playwright.
- Filled out all required docs: `REFLECTION.md`, `USER_INTERVIEWS.md`, `LANDING_COPY.md`, `ECONOMICS.md`, `METRICS.md`, `GTM.md`, `PRICING_DATA.md`, `PROMPTS.md`, `ARCHITECTURE.md`, `TESTS.md`.
- Extracted validation to `src/lib/validation.ts` and made both API routes use it.

**Learned:** Lifting validation out of the route file made the tests trivially small and the route file much easier to read.

**Lighthouse (local prod build, mobile):**

| Metric | Score |
|--------|-------|
| Performance | 96 |
| Accessibility | 89 |
| Best Practices | 100 |
| SEO | 100 |

Re-running on the Vercel URL after deploy.

**Blockers:** None on the code side. User actions remaining: paste keys, redeploy to Vercel, re-run Lighthouse on prod.

---

## 2026-05-20 — Day 7 · Final cross-check + Vercel-style UI revamp

**Hours:** ~4

**Done:**
- Iterated against [`test.json`](test.json): every required doc, every test in `test_matrix`, every CI gate green.
- **Vercel-style dark UI revamp:** near-black default theme, monochrome palette, large typography, thin borders, tokenized grid background.
- **`next-themes` wired:** `ThemeProvider` in layout, dark default, system preference on first visit, sun/moon toggle in header.
- Rebuilt landing hero (`text-8xl`), sample stat card, how-it-works tiles, form section, results page, `SavingsHero`, `AuditResults`, `LeadCapture`, `ShareSection`.
- All 35 tests + smoke E2E pass after UI change.

**Learned:** Semantic CSS variables (`bg-background`, `border-border`) make a full theme swap possible without touching business logic.

**Status:** Code submission-ready. User still needs to paste Supabase/Anthropic/Resend keys and confirm Vercel deploy + Lighthouse on prod URL.

---

## Commands used through the week

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run smoke
npm run verify:env
npm run test:supabase
```
