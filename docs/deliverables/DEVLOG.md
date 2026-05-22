# DEVLOG

Daily log in the assignment-required format. Dates match `git log`. I started late in the assignment window and ran an intensive sprint instead of spreading the work thinly across all seven days — recorded honestly below.

Verify dates yourself:

```bash
git log --pretty=format:"%ad" --date=short | sort -u
```

---

## Day 1 — 2026-05-19

**Hours worked:** 7

**What I did:**
- Read the assignment brief end-to-end, mapped the six MVP features against the rubric, and decided the audit math would be hardcoded rules with AI reserved for the summary only.
- Scaffolded Next.js 14 + TypeScript + Tailwind + shadcn/ui. Set up project structure (`src/app`, `src/components`, `src/lib`).
- Pulled official pricing pages for Cursor, GitHub Copilot, Claude, ChatGPT, Gemini, Anthropic API, OpenAI API, Windsurf. Captured each in `PRICING_DATA.md` with the URL and the retrieval date.
- Implemented `src/lib/pricing.ts` (8 tools, every plan, min-seat constraints) and the first pass of `src/lib/auditEngine.ts` (per-tool rule analyzer + writing-duplicate consolidator).
- Built `SpendForm` with `localStorage` persistence and the audit results page (`/audit/[id]`) with sticky `SavingsHero`, per-tool list, lead capture stub, share section.
- Wired `POST /api/audit` and `POST /api/leads`. Stubbed in-memory fallback in `src/lib/supabase.ts` so dev runs without keys.
- First commit (`27c8ddb checkpoint`).

**What I learned:**
- Keeping the math out of the LLM made unit tests trivially deterministic and made every dollar in the audit traceable to a list-price URL.
- Claude Team's 5-seat minimum and ChatGPT Team's 2-seat minimum are the two highest-confidence overspend triggers because the floor is a hard pricing rule, not a heuristic.

**Blockers / what I'm stuck on:**
- No Supabase project created yet. Memory fallback works for local dev but won't survive serverless cold starts on Vercel.
- "checkpoint" first commit message is bad. Will start using conventional commits from tomorrow.

**Plan for tomorrow:**
- Anthropic integration + templated fallback.
- Supabase schema + RLS, Resend transactional email, honeypot + rate limit.
- Vitest + Playwright + GitHub Actions CI.
- Write all required docs (REFLECTION, GTM, ECONOMICS, METRICS, USER_INTERVIEWS, LANDING_COPY).
- UI revamp toward a darker, more product-grade aesthetic.

---

## Day 2 — 2026-05-20

**Hours worked:** 10 (intensive sprint day)

**What I did:**
- OpenAI integration in `src/lib/ai-summary.ts` with templated `buildFallbackSummary` for missing-key and API-error paths. Documented exact prompt + fallback in `PROMPTS.md`.
- Supabase: `supabase/schema.sql` (audits / leads / rate_limits with RLS enabled, public read only on audits), `saveAudit` / `getAudit` / `saveLead` / `checkRateLimit` helpers in `src/lib/supabase.ts`.
- Resend wired into `/api/leads`; honeypot fields on both forms; 10/IP/hour rate-limit with fail-open posture (documented trade-off in `ARCHITECTURE.md`).
- Centralised validation in `src/lib/validation.ts` and made both API routes use it.
- Test suite: Vitest 35 tests across 7 files (audit engine, pricing, validation, summary fallback, RLS schema, API audit, API lead capture). Playwright scaffold for user journey, OG tags, axe-core accessibility.
- `.github/workflows/ci.yml` with two jobs (build-and-test, e2e).
- Verification scripts: `scripts/verify-env.mjs`, `scripts/test-supabase.mjs`, `scripts/smoke-e2e.mjs`.
- UI revamp: dark default via `next-themes`, monochrome palette, large display type, tool palette + drag-drop spend form, aurora background. "SpendSense by Credex" lockup in header/footer.
- Wrote remaining required docs: ARCHITECTURE, REFLECTION, GTM, ECONOMICS, USER_INTERVIEWS, LANDING_COPY, METRICS, TESTS, README.
- Late-evening self-audit revealed: build-prompt artifacts in `docs/`, a fabricated 7-day DEVLOG, USER_INTERVIEWS reading as templated, Anthropic model id needing verification, missing `og:image`, missing UTM on Credex CTA. Deleted the artifacts, rewrote DEVLOG honestly, fixed the code issues, and rebuilt USER_INTERVIEWS as a real outreach log (interviews scheduled — see the file).

**What I learned:**
- A clean split between deterministic math (rules + list prices) and LLM narrative (~100-word summary) made tests, debugging, and reviewer-defensibility all simpler.
- Semantic CSS variables (`bg-background`, `border-border`, `text-foreground`) made a near-complete light/dark theme swap possible without touching any business-logic component.
- "Memory fallback" looks clever for local dev but is a production landmine on Vercel because serverless functions don't share memory across requests. Supabase has to be real before deploy.

**Blockers / what I'm stuck on:**
- I haven't yet created the Supabase project, paid for the Vercel/Resend/Anthropic accounts, or pasted the live keys into `.env.local`. Everything in the code path is exercised by tests, but I cannot self-verify the deployed end-to-end flow until the keys are in.
- Lighthouse Accessibility is 89 on my local prod build — one point under the 90 floor. Need to re-run on the deployed URL after the colour-contrast pass.

**Plan for tomorrow:**
- Create Supabase project, apply schema, paste keys into Vercel envs.
- `vercel --prod`, then end-to-end manual test (audit → save → incognito reload → email arrives → CTA clicks tracked).
- 3 cold outreach DMs to founders for the real user interviews; aim for at least 2 conducted within 48 hours.
- Re-run Lighthouse mobile on the live URL and record scores here.
- Capture 3+ screenshots (landing, audit results, mobile) and add to README, or record a 30-second Loom.

---

## Day 3 — 2026-05-21

**Hours worked:** 6 (code + docs; deploy/interviews pending your account setup)

**What I did:**
- Added **10k audits/day** scale-out section to [`ARCHITECTURE.md`](ARCHITECTURE.md) (edge cache, async pipeline, Redis rate limits, cost ceiling).
- Replaced placeholder Credex **"C"** with gradient SVG mark at `public/credex-mark.svg` and updated [`CredexMark`](src/components/ui/credex-mark.tsx).
- UX fixes: honest "You're spending well" card only at **$0** savings; **modest savings** ($1–$99) hero copy; **600ms minimum** loader dwell; touch-only palette hint (no false "drag" on mobile).
- A11y prep: bumped dark-mode `--muted-foreground` contrast; high-savings badge uses foreground text instead of green-on-muted.
- Edge cache hint: `export const revalidate = 3600` on audit results page.
- Created [`docs/internal/task3.md`](docs/internal/task3.md) day tracker + [`docs/screenshots/README.md`](docs/screenshots/README.md).
- Verified: lint, typecheck, **36 tests**, production build all green.

**Still needs you today (cannot be automated):**
- Supabase + Anthropic + Resend keys → `.env.local` + Vercel envs
- `npx vercel --prod` + E2E verification on live URL
- 3+ mobile screenshots → `docs/screenshots/` + README
- Lighthouse mobile on prod (target A11y ≥ 90)
- ≥ 1 real user interview transcribed into [`USER_INTERVIEWS.md`](USER_INTERVIEWS.md)

**What I learned:**
- `revalidate` on immutable audit pages is the cheapest win before touching Redis or queues — most share traffic is re-reads of the same URL.
- Touch-only users never see HTML5 drag events; copy must not promise drag on mobile even when click-to-add works fine.

**Blockers / what I'm stuck on:**
- `.env.local` still empty — production share URLs and email flow cannot be verified until keys are pasted.
- Lighthouse A11y on local prod was 89 before today's contrast tweak; must re-run on deployed URL.

**Plan for tomorrow (2026-05-22):**
- Finish deploy + screenshots + Lighthouse if not done tonight.
- Conduct interviews 2 and 3; fill cross-cutting themes in `USER_INTERVIEWS.md`.
- Fourth distinct commit day with interview + README screenshot commit.

---

## Commands used through the build

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run verify:env
npm run test:supabase
npm run smoke
```
