# Reflection

Five questions, each answered honestly in 150–400 words.

---

## 1. The hardest bug I hit this week, and how I debugged it

The hardest bug was a silent persistence failure that only appeared after I started running the smoke script against a real Supabase project, not the in-memory fallback.

The symptom: `POST /api/audit` returned a 200 with a valid id, but `GET /audit/[id]` rendered "Audit not found" about half the time. My first hypothesis was a race condition between insert and select — maybe Supabase's read-after-write was lagging. I added a 500ms sleep in `getAudit`. No change. Second hypothesis: the `id` from `nanoid(10)` was being coerced or truncated somewhere. I logged the inserted id and the queried id side by side; they matched exactly.

Third hypothesis was the real one. I checked the Supabase logs and saw that the insert was returning a Postgres "permission denied" error — but the API was *still* responding 200. The bug was in `saveAudit`: I was destructuring `{ error }` from the Supabase insert but returning `true` regardless. The function was lying to the route handler about success. On a misconfigured RLS setup the insert silently failed; on a correctly configured one it worked, which is why it was intermittent until I fixed the RLS policy.

Fix: `saveAudit` now returns `false` on error, the route returns 503 to the client, and the client surfaces a real error. I also added an explicit warning when `NEXT_PUBLIC_SUPABASE_URL` is set but `SUPABASE_SERVICE_ROLE_KEY` is missing — that exact misconfiguration cost me 40 minutes.

What I learned: never let an API return success based on a function that doesn't propagate database errors. The fail-loud pattern is mandatory for any persistence path.

---

## 2. A decision I reversed mid-week and why

I started with a "credit savings" line item baked into every audit recommendation as a flat `15%` of list price, with reasoning text claiming "enterprise credit programs typically save 10–20%". It looked impressive on the results page and made the totals more dramatic.

I reversed it after the audit pass I did on my own work. A reviewer with the Credex pricing page open would push back immediately: where does 15% come from? Is that gross or net? Does Credex publish it? The answer is no — Credex sells custom-quoted credits. Asserting a specific percentage as a recommendation crosses from defensible math into manufactured savings, which is exactly what the assignment warns against ("Don't manufacture savings").

The reversal: the engine still surfaces a "Credex credits" path when monthly spend is high and the user is on list pricing, but the reason string was reframed from "save 10–20%" to a softer "credit programs can offer meaningful savings — Credex quotes per stack". I also gated this recommendation behind `currentSpend >= $200` and `currentSpend > catalogCost * 0.9` so it never fires on small spenders or already-discounted plans. The Credex CTA on the results page is now the place where the "captures additional savings" claim lives, not the audit math itself.

The general principle I want to internalise: the audit's credibility depends on every line being defensible to a finance person reading the source URL. Any number that can't trace to a vendor page is a liability.

---

## 3. What I would build in week 2

Three things, in order:

**Dynamic per-audit OG image.** The viral loop depends on the screenshot of `/audit/[id]`, and right now the Twitter/Slack preview shows a static brand card. A Next.js `opengraph-image.tsx` route that renders the user's specific savings number as a 1200×630 PNG would dramatically improve share-CTR and is the single biggest lever for organic growth.

**Pricing data freshness automation.** I'd add a weekly GitHub Action that fetches each vendor's pricing page, diffs against `src/lib/pricing.ts`, and opens a PR when prices change. The audit's defensibility depends on numbers being current; right now `PRICING_DATA.md` says "verified 2026-05-19" and that decays the day after submission.

**Benchmark mode (bonus from the brief).** "Your AI spend per developer is $X — companies your size average $Y." This requires aggregating real audit data, which we'll have after week 1 of live traffic. It's the feature that converts a one-time audit into a returning-user product.

I would deliberately *not* build PDF export, embeddable widget, or referral codes in week 2 — they're rubric-bonus features that don't move the core funnel. Week 2 should compound on the existing audit viewership, not fragment effort across new surfaces.

---

## 4. How I used AI tools (and a specific time AI was wrong)

I built this primarily with **Cursor** running **Claude Opus** and **Claude Sonnet** depending on context size. I used AI for:

- **Scaffolding** — initial Next.js + shadcn setup, route handlers, Tailwind config.
- **UI iteration** — the dark-mode revamp, the tool-palette drag-and-drop form, the aurora background. I described intent and iterated on the result.
- **Test writing** — drafting Vitest cases for the audit engine; I reviewed and tightened every assertion.
- **Documentation drafts** — early versions of ARCHITECTURE, GTM, ECONOMICS; I rewrote sections that read as generic.

What I did **not** trust AI with:

- **Pricing data.** Every number in `src/lib/pricing.ts` was pulled by me from the live vendor pricing page and recorded in `PRICING_DATA.md` with the URL. LLMs hallucinate prices, especially Claude Team's seat minimums.
- **The audit recommendation logic.** I drafted the rules myself based on what I'd actually push back on as a finance reviewer. AI is too eager to manufacture savings.
- **User interviews.** I conducted real conversations (or am in the process of — see `USER_INTERVIEWS.md` for the sourcing log).

**Specific time AI was wrong, that I caught:** Mid-day on 2026-05-20, Cursor (Claude) suggested setting the Anthropic model to `claude-sonnet-4-20250514`. That model id is plausible-looking but does not exist on Anthropic's published API. If I'd shipped it, every audit summary would have silently fallen back to the template — the AI summary feature would have been technically present but functionally dead, and a reviewer testing live would notice. I caught it because I read the diff before accepting and the version date looked like a placeholder pattern. Replaced with `claude-3-5-sonnet-20241022`, which I verified against Anthropic's docs.

A second smaller catch: an early DEVLOG draft fabricated five days of work spanning 2026-05-13 → 2026-05-20. Git history shows two days. I rewrote DEVLOG to match reality. Honesty over polish.

---

## 5. Self-rating (1–10) with one-sentence reasons

| Dimension | Score | One-sentence reason |
|-----------|-------|---------------------|
| **Discipline** | **5/10** | I started late and compressed the work into a 2-day sprint instead of distributing across the 7-day window — a real failure against the "5 distinct commit days" requirement that I'm now backfilling with real daily work. |
| **Code quality** | **7/10** | TypeScript strict, clean separation of math from LLM, tests cover the failure paths — but `src/lib/supabase.ts` mixes too many concerns and the `SpendForm` component is doing more state work than it should. |
| **Design sense** | **7/10** | The Vercel-style dark default and tool palette are credible, but the placeholder "C" Credex mark and identical 8-px rhythm everywhere still read as AI-generated to a sharp eye. |
| **Problem-solving** | **8/10** | I made the right call to keep math out of the LLM, the right call to bail on the 15% credit claim, and the right call to delete my own AI build-prompt artifacts when I noticed they were submission liabilities. |
| **Entrepreneurial thinking** | **6/10** | The honest "you're spending well" path and the gated Credex CTA show product thinking, but the GTM is still channel-listy rather than truly unfair-advantage-led, and my interview sourcing was reactive rather than weekly habit. |
