# Economics — SpendSense as a lead-gen channel for Credex

Spreadsheet-style breakdown. All inputs are rough estimates; the math is the point, not the precision.

## What a converted lead is worth to Credex

Credex sells discounted AI infrastructure credits. Public reference points + reasonable assumptions:

| Input | Value | Why |
|-------|-------|-----|
| Avg annual AI tool spend per Credex customer | **$24,000** | Mid-market range; 10–15 seats × ~$150/seat/mo blended |
| Avg credit discount Credex passes through | **~10–15%** | Inferred from "discounted credits sourced from overforecasting companies" model; conservative |
| Credex take rate on those credits | **~15% of gross savings** | Standard marketplace cut; reasonable for a credit aggregator |
| Avg gross annual savings delivered to a customer | $24k × 12% = **~$2,900** | |
| Credex annual revenue per customer | $2,900 × 15% = **~$435** | |
| Avg customer lifetime (years) | **2.5** | Annual renewal product; modest churn |
| **LTV per closed customer** | **~$1,100** | |

A SpendSense **lead** is a captured email post-audit. Not every lead converts; the chain is:

`audit completed → email captured → high-savings (>$500/mo) → consultation booked → credit purchase`

Modelled conversion at each step (conservative):

| Step | Rate | Cumulative |
|------|------|------------|
| Audit completed → email captured | 45% | 45% |
| Email captured → high-savings cohort | 12% / 45% = ~27% | 12% |
| High-savings → consultation booked | 8% | 1.0% |
| Consultation → closed deal | 30% | 0.3% |

So **1 in ~330 audits becomes a Credex customer**. At $1,100 LTV per customer, the **expected value of a single completed audit ≈ $3.30** ($1,100 × 0.003).

Expected value of a single **captured email** ≈ $3.30 / 0.45 = **~$7.30**.

These are the unit-economic anchors. Every channel decision below references them.

## CAC at each GTM channel

Using the $7.30/email and $3.30/audit anchors:

| Channel | Cost / 100 audits | Effective CAC / email | Verdict |
|---------|--------------------|------------------------|---------|
| **Hacker News Show HN** | $0 | $0 | Best-case viral launch; ranks or doesn't. Risk: zero-shot, hard to repeat. |
| **X / Twitter cold replies** (founder time only) | $0 cash, ~6 hours / 100 audits | Time-priced ~$0.50/email at $50/hr labour | Highest ROI of paid attention; doesn't scale past ~10/week without spam risk. |
| **Reddit organic** (r/SaaS, r/cursor, etc.) | $0 cash, ~3 hours / 100 audits | ~$0.30/email | Modest volume, very warm leads. |
| **Indie Hackers / Slack / Discord** | $0 cash, ~4 hours / 100 audits | ~$0.40/email | Repeat-able weekly with low fatigue. |
| **Content / SEO** (2 blog posts, evergreen) | ~10 hours one-time → ~50 audits/month at steady state | ~$1/email amortised over 6 months | Slowest, highest long-term ROI. |
| **Credex existing customer email** | Effectively free (existing list) | ~$0 | **Highest absolute volume and highest LTV match** — Credex's customers are pre-qualified. |
| **Paid X promotion** (if tested) | $200/100 audits ($2 CPM × ~10k impressions) | $2/email | Worthwhile only if break-even via measured downstream Credex revenue. |
| **Paid Reddit ads** (r/startups) | $300/100 audits | $3/email | Borderline at $7.30 lead value; only with strong copy. |

**Channel hierarchy from this math:**

1. Credex customer list — first send week 1
2. X / Reddit organic — habitual weekly cadence
3. HN Show HN — one-shot launch attempt
4. Content / SEO — long horizon
5. Paid promotion — only after organic CAC is measured

## Audit → Credex consultation → credit purchase conversion needed for profitability

Infra costs are tiny. With:

| Cost | Monthly |
|------|---------|
| Vercel Pro | $20 |
| Supabase Pro | $25 |
| Resend Pro | $20 |
| Anthropic API | ~$0.005/audit × 5,000 audits = ~$25 |
| Domain + misc | $5 |
| **Total infra** | **~$95/mo** |

Plus my time, valued at $5,000/mo opportunity cost = **fully loaded ≈ $5,100/mo**.

Break-even requires **$5,100/mo Credex revenue attributable to SpendSense**, which at $435/yr-per-customer = $36/mo per customer = **~140 active Credex customers attributable** to SpendSense's lifetime contribution. At 0.3% audit-to-customer rate, that's **~47,000 cumulative completed audits**.

At 5,000 audits/month sustained pace (achievable post-month-3 with the GTM above), break-even hits **month 10**. At 1,000 audits/month (bear case), it never breaks even — SpendSense is then a marketing expense Credex absorbs for brand and SEO benefit, not a P&L-positive line.

## What would have to be true for $1M ARR in 18 months

$1M ARR from a $1,100 LTV product ≈ **910 active Credex customers** at any given time. With a 0.3% audit-to-customer rate, that requires **~300,000 cumulative completed audits**.

| What has to be true | Likely? |
|---------------------|---------|
| ~17,000 completed audits / month sustained from month 6 onward | **Plausible** if Hacker News + one viral X moment hits + Credex existing-customer push delivers |
| Email capture rate holds at ~45% (no drop as traffic gets colder) | **Plausible** with the "email after value" pattern; **at risk** if traffic shifts to paid where intent is lower |
| High-savings audit rate stays at ~12% | **Plausible**; large stacks self-select into this tool |
| Consultation → close rate stays at ~30% | **Optimistic** — assumes Credex sales motion is well-tuned |
| LTV doesn't degrade as Credex's customer base broadens | **Risk** — early Credex customers are pre-qualified; broader cohort may churn faster |

**Headline answer:** $1M ARR in 18 months is **achievable but not the base case**. The realistic 18-month outcome is **$200k–$500k attributable ARR**, which is still a >5x return on the build cost and the strongest organic lead channel Credex has.

## Sensitivity table

| Scenario | Audits/mo (steady) | Emails/mo | Credex customers/mo (closed) | Annual revenue |
|----------|---------------------|-----------|--------------------------------|----------------|
| Bear | 500 | 225 | ~1.5 | **~$8,000** |
| Base | 5,000 | 2,250 | ~15 | **~$80,000** |
| Bull | 17,000 | 7,650 | ~50 | **~$270,000** |

Even the bear case covers infra by ~7x. The base case justifies a part-time owner. The bull case justifies a small dedicated growth team inside Credex.

## Why this is defensible for Credex specifically

1. **Existing customer leverage.** No competitor can email Credex's list. This single channel is likely 30–50% of attributable revenue.
2. **Honest "you're spending well" path** protects Credex sales bandwidth — Credex AMs only talk to qualified ($500+/mo) leads.
3. **Top-of-funnel SEO moat.** "AI tool spend audit" / "Cursor vs Copilot cost" are searchable terms Credex doesn't currently own. SpendSense ranking pulls organic intent traffic into Credex's funnel.
4. **No paid CAC dependency.** Even if all paid channels fail, the tool generates leads via content + community at near-zero marginal cost.
