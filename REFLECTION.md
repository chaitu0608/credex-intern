# Reflection

## What worked

- **Splitting math from LLM.** Hardcoded rules in [`src/lib/auditEngine.ts`](src/lib/auditEngine.ts) make every dollar traceable. The LLM is only used for the ~100-word summary in [`src/lib/anthropic.ts`](src/lib/anthropic.ts) — that boundary made debugging fast and the audit defensible to a CFO.
- **Memory-mode fallback.** [`src/lib/supabase.ts`](src/lib/supabase.ts) gracefully degrades to an in-memory `Map` when Supabase env vars are missing. Local dev unblocked before any account was created.
- **Tiny verification scripts.** `npm run verify:env`, `npm run test:supabase`, and `npm run smoke` made each task gate explicit and re-runnable.

## What I would change with more time

- **OG image.** Currently static metadata; a dynamic `opengraph-image` route per audit would dramatically improve viral share quality.
- **Pricing data freshness.** [`PRICING_DATA.md`](PRICING_DATA.md) is checked manually; a weekly scheduled GitHub Action that pings vendor pricing pages and opens a PR on diffs would prevent drift.
- **Email idempotency.** Re-submitting the lead form would currently send a second Resend email. A dedupe on `(audit_id, email)` would make the lead API truly idempotent.
- **Anthropic prompt engineering.** Current prompt is good but rigid; few-shot examples for "already optimal" vs "high savings" cases would tighten tone.

## Hardest decision

**Whether to use AI for the audit math.** Tempting because it feels modern. Rejected because: prices are public, the comparison is arithmetic, and an LLM cannot cite a URL deterministically. Finance teams need numbers that match the vendor's pricing page exactly. AI is reserved for the *narrative*, not the *math* — and I think that judgment is the most important part of the test.

## What I would tell another founder building this

- Ship the math first, deploy second, polish copy last.
- The hero number on the results page is the entire viral loop — design it as if every audit screenshot lives on Twitter.
- Email gate **after** value; never before. Anything else burns the cold visitor.
- Free tier first (Vercel, Supabase, Resend, Anthropic) — domain + paid tier come after you have proof of usage.

## Honest limitations

- AI summary depends on Anthropic credits; template fallback exists but is less personalized.
- Pricing rules are heuristic — I tuned the most common overspend patterns (Claude Team, Cursor Business solo, duplicate writing assistants) and an over-quota Copilot Enterprise downgrade. Edge cases (mixed API + flat, very large teams) fall back to a conservative "right-sized" note rather than guess.
- Rate limiting via Supabase is a fail-open design. If Supabase is down, audits still run. That is a deliberate trade-off for a free public tool.
