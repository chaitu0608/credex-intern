# Economics — SpendSense as a lead-gen channel for Credex

## Unit assumptions (conservative)

| Metric | Value | Notes |
|--------|-------|-------|
| Cold visitors / mo | 5,000 | After 1 HN front-page + 2 viral X threads |
| Audit completion rate | 35% | Friction = form length |
| High-savings audits (> $500/mo) | 12% of completions | Realistic for SaaS w/ 5+ AI tools |
| Email capture rate (post-value) | 45% of completions | Email after value is shown |
| Credex consultation booking rate | 8% of high-savings | Of those, a fraction convert |
| Credex average deal size (gross savings/yr) | $25,000 | Mid-market enterprise credit deal |
| Credex take rate | 15% of savings | Conservative blended |

## Funnel math

- Visitors: **5,000**
- Audits completed: 5,000 × 35% = **1,750**
- High-savings audits: 1,750 × 12% = **210**
- Emails captured: 1,750 × 45% = **788**
- Credex consultations booked: 210 × 8% = **~17**
- Deals closed (assume 30% close): **~5**
- Credex revenue / mo: 5 × $25,000 × 15% = **~$18,750**

## Cost side (per month)

| Item | Cost |
|------|------|
| Vercel (Hobby/Pro) | $0 - $20 |
| Supabase (Free / Pro) | $0 - $25 |
| Resend (Free 3k / Pro) | $0 - $20 |
| Anthropic API (~$0.005/audit × 1,750) | ~$9 |
| Domain | ~$1 |
| **Total infra** | **~$30 - $75** |

## Margin

Even at the conservative funnel, $18,750 revenue on ~$75 cost = **>99% margin** at this scale because SpendSense is a marketing asset, not a product.

## Why this is defensible for Credex

- **Real value before ask.** Visitor gets an actual audit. The lead is warm because they saw their own savings number first.
- **Honest "spending well" path.** Low-savings audits don't waste Credex's sales time — they're funneled into a notify-me list for future re-engagement when new optimizations apply.
- **>$500/mo qualifier.** Credex only gets surfaced when there's real money on the table; protects Credex's brand from spamming small spenders.

## Risks

- **Pricing data drift.** Vendors change prices. Mitigated by `PRICING_DATA.md` re-verification and a planned scheduled job (see [`REFLECTION.md`](REFLECTION.md)).
- **Anthropic credit exhaustion.** Falls back to a templated summary; no UX failure.
- **Supabase free tier pause** after 7 days idle. Mitigated with in-memory cache + a `keep-warm` cron later.
- **Abuse.** Honeypot + rate limit + no public write policy. Documented in [`ARCHITECTURE.md`](ARCHITECTURE.md).

## Sensitivity

| Scenario | Audits / mo | Consultations | Revenue |
|----------|-------------|---------------|---------|
| Bear (no virality) | 200 | 2 | ~$2,250 |
| Base | 1,750 | 17 | ~$18,750 |
| Bull (HN front + TC pickup) | 8,000 | 70 | ~$78,000 |

Even the bear case covers infra by 30×.
