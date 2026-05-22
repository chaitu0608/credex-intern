# DEVLOG

Seven calendar days (May 16–22). **Days 1–3** are honest rest/planning days with **no commits**. **Days 4–7** match `git log`. I started late in the assignment window and compressed the build into four intensive days instead of spreading work evenly — I am not inventing output for May 16–18.

Verify commit dates yourself:

```bash
git log --pretty=format:"%ad" --date=short | sort -u
```

---

## Day 1 — 2026-05-16

**Hours worked:** 1

**What I did:**
- Received the Credex intern assignment; read the rubric end-to-end, including the line that **DEVLOG is the most important file they read**.
- Skimmed credex.rocks to understand the product context (discounted infra credits, not a generic SaaS audit).
- Did **not** scaffold a repo. Procrastinated — other obligations and anxiety about the 7-day window.

**What I learned:**
- Starting three days before my first commit is a real submission risk (7 daily entries + ≥5 distinct commit days in git).
- Decided I would **not** retroactively fabricate early DEVLOG entries to look disciplined — honesty beats polish.

**Blockers / what I'm stuck on:**
- No codebase, no pricing research filed yet.
- Guilt about delay instead of action.

**Plan for tomorrow:**
- Block 2–3 hours to stack-rank the six MVP features and note "don't manufacture savings" as a hard rule.
- If I still don't code, commit to a hard start on May 19.

---

## Day 2 — 2026-05-17

**Hours worked:** 0

**What I did:**
- No commits. No code.
- Mental stack-rank of MVP: (1) spend form, (2) deterministic audit engine, (3) results page, (4) AI summary as **copy only**, (5) lead capture after value, (6) share URL + OG.
- Re-read assignment warning against manufactured savings numbers.

**What I learned:**
- Logging a zero-hour day still matters — it shows I understand the required daily format even when output is zero.
- The assignment evaluates consistency and discipline over heroics; my failure mode is delay, not lack of ideas.

**Blockers / what I'm stuck on:**
- Still avoiding `create-next-app`. Fear of a slow start with only four build days left.

**Plan for tomorrow:**
- Paper architecture: form → `POST /api/audit` → rules engine → optional AI paragraph → Supabase → public share URL.
- List the eight tools I need in `PRICING_DATA.md` before writing TypeScript.

---

## Day 3 — 2026-05-18

**Hours worked:** 2

**What I did:**
- Whiteboarded the data flow: `SpendForm` → `POST /api/audit` → `runAudit()` → `generateAISummary()` → `saveAudit()` → `/audit/[id]` SSR + OG.
- Listed eight tools for pricing research: Cursor, GitHub Copilot, Claude, ChatGPT, Gemini, Anthropic API, OpenAI API, Windsurf.
- **Rejected** the idea of LLM-generated recommendations before writing code — first instinct was to feed the stack to a model and ask for savings; I killed that on paper after reading about hallucinated seat minimums and fake plan names (later documented in `PROMPTS.md`).
- **No code**, no git.

**What I learned:**
- Pre-committing to **deterministic math + sourced list prices** is the only defensible architecture for a finance-facing audit.
- Separating "rules engine" from "LLM paragraph" early saved me from a failed experiment I never had to ship.

**Blockers / what I'm stuck on:**
- Four-day crunch starting tomorrow; still no Supabase project or API keys.

**Plan for tomorrow:**
- Scaffold Next.js 14 + TypeScript + Tailwind + shadcn/ui.
- Implement `pricing.ts`, `auditEngine.ts` v1, `SpendForm`, audit results page, API routes.
- First real commit with a proper message (not "checkpoint").

---

## Day 4 — 2026-05-19

**Hours worked:** 7

**What I did:**
- Read the assignment brief again; mapped six MVP features to files; locked architecture: **hardcoded rules for every dollar**, AI only for the ~100-word summary.
- Scaffolded Next.js 14 + TypeScript + Tailwind + shadcn/ui (`src/app`, `src/components`, `src/lib`).
- Pulled official pricing pages for all eight tools; captured each in `PRICING_DATA.md` with URL and retrieval date.
- Implemented `src/lib/pricing.ts` (every plan, min-seat constraints) and first pass of `src/lib/auditEngine.ts` (per-tool analyzer + writing-duplicate consolidator).
- Built `SpendForm` with `localStorage` persistence and `/audit/[id]` with sticky savings hero, per-tool list, lead capture stub, share section.
- Wired `POST /api/audit` and `POST /api/leads`. In-memory fallback in `src/lib/supabase.ts` for keyless local dev.
- First commit (`27c8ddb`) — message was literally `checkpoint` (bad habit I fixed the next day).

**What I learned:**
- Keeping math out of the LLM made unit tests deterministic and every dollar traceable to a vendor URL.
- Claude Team's 5-seat minimum and ChatGPT Team's 2-seat minimum are high-confidence overspend triggers — hard pricing rules, not heuristics.
- Memory fallback feels convenient locally but is a **production landmine** on Vercel (serverless instances don't share memory).

**Blockers / what I'm stuck on:**
- No Supabase project yet — audits won't persist across cold starts until Postgres is real.
- Bad first commit message; need conventional commits from Day 5 onward.

**Plan for tomorrow:**
- OpenAI summary + templated fallback (not Anthropic — I standardized on one provider).
- Supabase schema + RLS, Resend email, honeypot + rate limit.
- Vitest + Playwright + GitHub Actions CI.
- Draft required docs (REFLECTION, GTM, ECONOMICS, METRICS, USER_INTERVIEWS, LANDING_COPY).

---

## Day 5 — 2026-05-20

**Hours worked:** 10 (intensive sprint day)

**What I did:**
- OpenAI integration in `src/lib/ai-summary.ts` with `buildFallbackSummary` for missing-key and API-error paths. Documented prompt + failures in `PROMPTS.md`.
- Supabase: `supabase/schema.sql` (audits / leads / rate_limits, RLS, public read on audits only); `saveAudit` / `getAudit` / `saveLead` / `checkRateLimit` in `src/lib/supabase.ts`.
- **Pivot — manufactured savings:** I briefly added a flat **15% "credit savings"** line on every audit to inflate totals. Reversed after self-review: Credex quotes custom credits; asserting 15% is not defensible math. Reframed to a gated "explore Credex credits" path only when spend ≥ $200 and list-priced — see `REFLECTION.md` §2.
- **Bug caught in code review — `saveAudit` lying:** Destructured `{ error }` from Supabase insert but returned `true` regardless; route could return 200 while Postgres returned RLS "permission denied". Fixed to propagate failure → 503 to client (full prod repro in `REFLECTION.md` §1 once keys were live).
- Resend on `/api/leads`; honeypot on both forms; 10/IP/hour rate limit (fail-open initially, documented in `ARCHITECTURE.md`).
- Centralised validation in `src/lib/validation.ts`; both API routes use it.
- Tests: **35 Vitest** across 7 files; Playwright scaffold (journey, OG, axe-core). `.github/workflows/ci.yml` (build-and-test + e2e).
- Scripts: `verify-env.mjs`, `test-supabase.mjs`, `smoke-e2e.mjs`.
- UI revamp: dark default (`next-themes`), tool palette + drag-drop form, aurora background, "SpendSense by Credex" lockup.
- Wrote doc pack: ARCHITECTURE, REFLECTION, GTM, ECONOMICS, USER_INTERVIEWS, LANDING_COPY, METRICS, TESTS, README.
- Late-evening self-audit: deleted build-prompt artifacts in `docs/`, **deleted a fabricated 7-day DEVLOG** (fake dates with no git), reset `USER_INTERVIEWS.md` to an honest outreach log, fixed missing `og:image` and Credex CTA UTM.
- Caught fake Anthropic model id `claude-sonnet-4-20250514` in a Cursor diff — plausible-looking but unpublished; would have silently killed AI summaries.

**What I learned:**
- Deterministic math + LLM narrative is the right split for tests, debugging, and reviewer trust.
- Semantic CSS variables (`bg-background`, `text-foreground`) made light/dark swap possible without touching business logic.
- Honesty over polish: deleting my own fabricated DEVLOG was embarrassing but necessary — Credex reads this file first.

**Blockers / what I'm stuck on:**
- `.env.local` still empty that night — could not verify deploy, email, or live AI summaries.
- Lighthouse Accessibility **89** on local prod build (one point under the 90 floor).

**Plan for tomorrow:**
- Create Supabase project, apply schema, paste keys into `.env.local` + Vercel.
- `vercel --prod`; E2E test audit → share URL in incognito → lead email.
- Send ≥5 outreach DMs for real user interviews.
- Re-run Lighthouse mobile on prod; capture README screenshots.

---

## Day 6 — 2026-05-21

**Hours worked:** 6

**What I did:**
- Added **10k audits/day** scale-out to `ARCHITECTURE.md` (edge cache, async pipeline, Redis rate limits, cost ceiling).
- Replaced placeholder Credex "C" with gradient SVG at `public/credex-mark.svg` + `CredexMark` component.
- UX: "You're spending well" card only at **$0** savings; modest savings ($1–$99) hero copy; **600ms minimum** loader dwell; touch-only palette hint (no false "drag" on mobile).
- A11y: bumped dark-mode `--muted-foreground` contrast; high-savings badge uses foreground text.
- `export const revalidate = 3600` on audit results page.
- OG fixes: explicit absolute image URLs for landing and audit share (`d00c9b2`, `a86425e`); prefer Vercel production hostname for OG routes.
- Real brand logos for every tool across the app (`6d15298`).
- Added `summarySource` on audit results so UI can show AI vs template honestly (`67c7d9e`).
- `docs/internal/task3.md` tracker + `docs/screenshots/README.md`.
- Verified: lint, typecheck, **36 tests**, production build green.
- Deployed to https://credex-intern.vercel.app (README updated); keys still not in local `.env.local` at end of day.

**What I learned:**
- `revalidate` on immutable audit pages is the cheapest scale win — share traffic is mostly re-reads of the same URL.
- Touch devices never fire HTML5 drag events; copy must not promise drag when tap-to-add works fine.
- Showing `summarySource` builds trust when the OpenAI key is missing — users see "template" not fake AI.

**Blockers / what I'm stuck on:**
- `.env.local` still empty — could not run `npm run test:supabase` or verify lead email locally.
- User interviews: **0 outreach sent** (see `USER_INTERVIEWS.md` table — honest gap).
- Lighthouse A11y 89 locally before contrast tweak; need prod re-run after deploy.

**Plan for tomorrow:**
- Close MVP checklist gaps: honeypot hardening, engine edge cases, dynamic OG, chat widget.
- Paste Supabase / OpenAI / Resend keys; verify Vercel env parity.
- Start interview DMs; commit Day 7 work with conventional messages.

---

## Day 7 — 2026-05-22

**Hours worked:** 9

**What I did:**
- **Provider pivot:** Migrated AI summary from Anthropic to OpenAI (`41bb962`) — single `OPENAI_API_KEY`, default `gpt-4o-mini`; template fallback unchanged.
- **Engine hardening:** Gemini Ultra/Pro downgrade rules, API $0 spend guidance, validation expansion (`537efa4`, `7809dd0`).
- **Abuse controls:** Honeypot returns `fake-*` ids with zero savings and no DB write; rate limit fail-closed in production; CI/E2E bypass + `AUDIT_RUNTIME=e2e` memory-only persistence so Playwright never hits prod Supabase (`be24fe7` … `69bb4d2`).
- **Product completeness:** Dynamic per-audit `opengraph-image`, audit chat widget (explains stored `reason` strings — never recomputes math), sample audit preview dialog, premium results hero with pricing sources, MVP checklist closure (`b03f212`, `ffbfeb9`, `a47fd2d`, `dfd30f1`).
- **Repo hygiene:** Assignment deliverables at repo root; technical docs in `docs/` (`25c3577`, `cca9a8e`, later flatten).
- Pasted Supabase, Resend, and OpenAI keys into `.env.local`; ran `npm run verify:env` green.
- **UI polish (same day, pre-commit):** Credex icon/lockup refresh (`credex-icon.tsx`, `brand-lockup.tsx`), landing sections, audit report hero/coverage/chat widgets, globals.css tokens — aligning visual quality with the audit trust story.
- Test count end of day: **86 Vitest** (23 audit-engine) + Playwright e2e per `TESTS.md` Engineering Trust Doc.

**What I learned:**
- E2E must not depend on prod Supabase — memory persistence in `e2e` mode beats flaky CI and accidental data pollution.
- Audit chat follows the same rule as the summary: **explain precomputed numbers, never invent new savings** — users asking to "change my total" get redirected to the report as source of truth.
- `npm run lint && npm run typecheck && npm test && npm run build` is the daily sanity loop; I stopped listing it as a separate appendix because the habit matters more than the command names.

**Blockers / what I'm stuck on:**
- Vercel production env vars must mirror `.env.local` (especially `NEXT_PUBLIC_APP_URL` for OG absolute URLs).
- Lead email flow not re-verified on prod after keys — need one live submit → inbox check.
- **3 real user interviews** still outstanding (`USER_INTERVIEWS.md` shows 0/5 DMs sent — instant reject if fabricated).
- Lighthouse mobile on https://credex-intern.vercel.app not recorded here yet (target A11y ≥ 90).
- README still needs 3+ screenshots or a Loom.

**Plan for tomorrow:**
- Only if submission slips past May 22: send interview DMs, transcribe calls into `USER_INTERVIEWS.md`, paste Lighthouse scores into this entry, push UI polish commit, capture screenshots for README.
