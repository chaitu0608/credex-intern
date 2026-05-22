# Reflection

Honest week-1 log for SpendSense — written so a reviewer can judge whether I'd be good to work with: how I debug, when I reverse myself, and what I won't outsource to AI.

---

## 1. The hardest bug I hit this week, and how I debugged it

The hardest bug was a silent persistence failure that only showed up after I ran `scripts/smoke-e2e.mjs` against a real Supabase project instead of the in-memory fallback in `src/lib/supabase.ts`.

**Symptom:** `POST /api/audit` returned HTTP 200 with a valid `id`, but opening `/audit/[id]` in another tab (or incognito) rendered "Audit not found" roughly half the time. Locally with memory-only storage it always worked, which made me think the bug was environmental, not logic.

**Hypothesis 1 — read-after-write lag:** Supabase might not be immediately consistent between insert and select. I added a 500ms `setTimeout` before `getAudit` in the smoke script. No change. Ruled out.

**Hypothesis 2 — id corruption:** Maybe `nanoid(10)` was truncated or coerced in the JSON payload. I logged the id returned from `saveAudit` and the id passed to `getAudit` on the failing requests. They matched character-for-character. Ruled out.

**Hypothesis 3 — permissions + lying success path:** I opened the Supabase dashboard logs. The insert was failing with Postgres `permission denied for table audits` — but our API still returned 200. Reading `saveAudit`, I had destructured `{ error }` from the Supabase client but the function returned `true` unconditionally after the call. The route handler treated any non-throwing return as success and issued a shareable id even when nothing was persisted. Intermittency came from mixed states: sometimes RLS/service-role was correct (insert worked), sometimes only the anon key was set (insert failed silently). A missing `SUPABASE_SERVICE_ROLE_KEY` with only the public URL configured cost me another 40 minutes before I understood why memory fallback "worked" on one machine and not on Vercel.

**Fix:** `saveAudit` now returns `false` when `error` is set; `POST /api/audit` responds **503** with a clear message; the client surfaces the failure instead of sending users to a dead share URL. I added a console warning when `NEXT_PUBLIC_SUPABASE_URL` is set but the service role key is absent. RLS policies were aligned so service-role inserts succeed while public read stays open for share URLs.

**Lesson:** Never return success from a persistence helper that swallows database errors. Fail-loud is non-negotiable for anything a user will screenshot and share.

---

## 2. A decision I reversed mid-week and why

I reversed two decisions this week — one architectural, one product — both driven by the same principle: financial recommendations must be explainable to a skeptical finance reviewer.

**Reversal A — LLM for audit math → deterministic rules (the big one).** My first draft sent the raw stack (tools, plans, seats, spend) to the model and asked it to *both* find overspend *and* write the summary. Documented in `PROMPTS.md` as "what didn't work": it hallucinated ChatGPT Team's seat minimum (said 3, actual is 2), invented a non-existent Cursor "Startup" plan, and claimed specific API savings by "switching to OpenAI" with no pricing basis. I killed that path entirely. All dollars now come from `src/lib/auditEngine.ts` against `src/lib/pricing.ts`, each number traced to `PRICING_DATA.md` with a vendor URL. OpenAI (`gpt-4o-mini` in `src/lib/ai-summary.ts`) only writes the ~100-word paragraph and powers the results-page chat widget — totals never change after the LLM step. That split is what makes Vitest deterministic and what I'd defend in a customer call.

**Reversal B — flat 15% "credit savings" in the engine.** I had baked a `15%` line item into recommendations with copy like "enterprise credit programs typically save 10–20%." It inflated totals and looked great on the hero. A reviewer with Credex's pricing page open would ask: where does 15% come from? Credex quotes custom credits; the assignment explicitly says don't manufacture savings. I removed the hard percentage. The engine still surfaces a `use-credits` recommendation when `currentSpend >= $200` and spend is near catalog list price, but the reason string is qualitative ("Credex quotes per stack") and the dollar impact is not fabricated. The Credex consultation CTA on the results page owns the "capture additional savings" claim — not the audit math.

**Principle I want to keep:** If a number can't be opened on a vendor pricing page, it doesn't belong in the recommendation list.

---

## 3. What I would build in week 2

Week 1 shipped the core funnel: form → deterministic audit → optional AI narrative → share URL → lead capture. Week 2 should compound viewership, not scatter effort across rubric-bonus surfaces.

**1. Benchmark mode (top priority).** "Your AI spend is $X per developer; teams your size average $Y." This needs aggregated audit data from real traffic — which we'll have after week 1 — and turns a one-time audit into a reason to return. It aligns with the pivot logic in `METRICS.md` (if leads stall, benchmark/community becomes the product bet).

**2. Pricing freshness automation.** A weekly GitHub Action that fetches each vendor pricing page, diffs against `src/lib/pricing.ts`, and opens a PR on change. `PRICING_DATA.md` is dated 2026-05-19; the audit's credibility decays the day a vendor changes list price. Automation is cheaper than manual re-verification and gives reviewers confidence the tool stays current.

**3. Per-audit OG v2.** Basic dynamic OG routes exist now (`opengraph-image` on landing and audit pages). The next step is rendering the *user's* savings number and top tool on the 1200×630 card — that's what makes Slack/Twitter previews clickable, not a generic brand tile.

**Deliberately not week 2:** PDF export, embeddable widget, referral codes. They're rubric bonuses that don't move the core loop (audit → share → lead). I'd only add them after benchmark mode proves retention.

---

## 4. How I used AI tools (and a specific time AI was wrong)

I built primarily in **Cursor** with **Claude Opus/Sonnet** for large refactors and **Composer** for tight UI edits. Later in the week I switched the LLM provider to **OpenAI `gpt-4o-mini`** for summaries and the audit chat widget (`src/lib/openai-client.ts`), after verifying the model id against OpenAI's docs.

**What AI helped with:**
- Scaffolding — Next.js 14 App Router, shadcn/ui, API route structure, Tailwind tokens.
- UI iteration — dark-mode revamp, tool palette, aurora background, May 22 brand pass (`credex-icon`, `brand-lockup`, SVG mark).
- Test drafts — Vitest skeletons for engine edge cases; I tightened every assertion and added failure-path cases myself.
- Documentation — first passes on ARCHITECTURE, GTM, ECONOMICS; I rewrote anything that read generic.

**What I did not trust AI with:**
- **Pricing data** — every figure in `pricing.ts` came from live vendor pages, logged in `PRICING_DATA.md` with URL and date. LLMs routinely wrong-seat Claude Team and invent plans.
- **Audit recommendation logic** — `auditEngine.ts` rules are hand-written against what I'd challenge as a finance reviewer.
- **User interviews** — outreach and synthesis in `USER_INTERVIEWS.md`; AI can't substitute for "would you pay for this?" conversations.

**Prompt experiments I reverted (judgment, not blind acceptance):** JSON-structured summary output sounded mechanical; streaming made the page feel slower because users waited for the full paragraph before sharing. Both documented in `PROMPTS.md`; kept single-shot plain paragraph.

**Specific time AI was wrong — caught before ship:** On 2026-05-20, Cursor suggested Anthropic model `claude-sonnet-4-20250514`. Plausible syntax, not on Anthropic's published API — every summary would have silently fallen back to the template while the feature looked "implemented." I caught it reading the diff: the date pattern looked fabricated. I verified against vendor docs before merging any model string. When I migrated to OpenAI, I applied the same check to `gpt-4o-mini`.

**Second catch — honesty:** An early DEVLOG claimed seven active build days; `git log --date=short | sort -u` showed fewer. I rewrote DEVLOG with real dates, including zero-hour rest days. Polish that contradicts git history is a submission liability.

---

## 5. Self-rating (1–10) with one-sentence reasons

| Dimension | Score | One-sentence reason |
|-----------|-------|---------------------|
| **Discipline** | **6/10** | I started late (May 16–18 rest/planning, first commit May 19) and compressed the build into four sprint days; DEVLOG now has seven honest calendar entries including zero-hour days, but git still shows only four commit days vs the ≥5 rubric target. |
| **Code quality** | **7/10** | TypeScript strict mode, deterministic math separated from LLM narrative, 69 Vitest tests plus Playwright e2e — but `supabase.ts` still bundles persistence, rate limits, and memory fallback in one module, and `SpendForm` carries more client state than ideal. |
| **Design sense** | **8/10** | The dark product shell and tool palette read credible for a B2B audit tool; the May 22 brand pass replaced the placeholder "C" with a real SVG mark and tighter lockup, though some spacing still feels uniformly 8px in a way a senior designer would vary. |
| **Problem-solving** | **8/10** | I traced the silent Supabase failure through three hypotheses, moved audit math out of the LLM, removed manufactured credit percentages, and deleted AI build-prompt artifacts once I saw they'd hurt reviewer trust. |
| **Entrepreneurial thinking** | **6/10** | The honest zero-savings path ("we won't manufacture savings") and gated Credex CTA show product judgment, but GTM is still a channel list rather than a sharp unfair-advantage story, and interview sourcing stayed reactive until I forced a daily outreach habit. |
