# Roadmap (post-MVP)

Not in scope for the intern submission; ordered by impact if this became a real Credex lead-gen product.

## P0 — Production completeness

1. **Wire production Supabase keys** — live URL persists audits ([`DEPLOYMENT.md`](DEPLOYMENT.md))
2. **3+ spend-owner interviews** — founders / eng leads with real invoices ([`USER_INTERVIEWS.md`](../USER_INTERVIEWS.md))
3. **Lighthouse scores** in DEVLOG — mobile performance + a11y

## P1 — Trust and conversion

- CSV export of audit recommendations
- “Email me this report” only after scroll depth or 30s on results page (A/B vs current gate)
- Turnstile if honeypot + rate limit insufficient

## P2 — Engine depth

- More tools (Replit, Codeium, Perplexity Enterprise)
- Usage-based pricing tiers from vendor APIs (not just list price)
- Team-level benchmarks (“teams your size spend $X on Cursor”)

## P3 — Scale

- Redis rate limits ([`PERFORMANCE.md`](PERFORMANCE.md))
- Async audit creation (202 + queue)
- Summary cache by input hash

## P4 — GTM

- Execute channels in [`GTM.md`](../GTM.md) — X threads, Indie Hackers, Credex customer intros
- Track [`METRICS.md`](../METRICS.md) — audit completion rate, lead capture %, Credex call booking

**Related:** [`ECONOMICS.md`](../ECONOMICS.md), [`internal/submission-review.md`](internal/submission-review.md)
