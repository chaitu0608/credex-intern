# Economics — SpendSense as a lead-gen channel for Credex

Spreadsheet-style unit economics for deploying tomorrow. Inputs are rough; the math is the point.

## Lead value

Credex takes a marketplace cut on discounted AI credits sourced from overforecasted capacity.

| Input | Estimate | Reasoning |
|-------|----------|-----------|
| Avg annual AI spend / customer | **$24,000** | 10–15 seats × ~$150/seat/mo |
| Discount passed through | **12%** | Conservative |
| Credex take rate | **15% of savings** | Marketplace cut |
| Credex revenue / customer / yr | $24k × 12% × 15% = **$435** | |
| Lifetime | **2.5 yr** | Renewal product |
| **LTV (closed customer)** | **≈ $1,100** | |

## Funnel → expected value

| Step | Rate | Cumulative |
|------|------|------------|
| Audit → email captured | 45% | 45% |
| Email → high-savings (>$500/mo) | 27% of emails | 12% |
| High-savings → consultation | 8% | 1.0% |
| Consultation → credit purchase | 30% | **0.30%** |

EV/audit = $1,100 × 0.003 = **$3.30** · EV/email = **$7.30**

## CAC by channel ([`GTM.md`](GTM.md))

| Channel | Cost / 100 audits | CAC / email | vs $7.30 EV |
|---------|-------------------|-------------|-------------|
| Credex list + credex.rocks embed | $0 | $0 | ✅ Pre-qualified |
| Hacker News Show HN | $0 | $0 | ✅ Volatile |
| X invoice DMs (~6 hr) | ~$300 labour | ~$0.50 | ✅ |
| Reddit / Slack / Discord | ~$175 labour | ~$0.35 | ✅ |
| Content / SEO | ~10 hr upfront | ~$1 amortized | ✅ Long tail |
| Paid X | $200 | $2.00 | ✅ |
| Paid Reddit | $300 | $3.00 | ⚠️ Borderline |

Paid Reddit needs ~10× better close rate than cold traffic to pay back — test only after organic CAC is measured.

## Infra + LLM (negligible)

| @ 5k audits/mo | Monthly |
|----------------|---------|
| Vercel + Supabase + Resend + domain | ~$70 |
| OpenAI `gpt-4o-mini` (~600 tok/audit) | ~$10 |
| **Infra total** | **~$80** |

Fully loaded (+$5k/mo builder time): **~$5,080/mo**.

## Profitability simulation

**Fully loaded break-even:** $5,080 ÷ ($435/12) ≈ **140 customers** → at 0.30% audit→customer, **~47,000 cumulative audits**.

| Audits/mo | Time to 47k | Steady-state Credex ARR |
|-----------|-------------|-------------------------|
| 500 | >18 mo | ~$8k |
| 5,000 | ~10 mo | ~$80k |
| 17,000 | ~3 mo | ~$270k |

**Infra-only break-even:** $80/mo ÷ $36/mo per customer ≈ **3 customers/mo** → **~730 audits/mo** at 0.30%.

**Close-rate sensitivity** (other steps fixed):

| Consultation → purchase | Audit→customer | Audits for 140 customers |
|-------------------------|----------------|--------------------------|
| 20% | 0.20% | 70,000 |
| 30% | 0.30% | 47,000 |
| 40% | 0.40% | 35,000 |

## $1M ARR in 18 months

$1M ÷ $435/customer/yr ≈ **2,300 active customers** → **~770,000 audits** at 0.30% (≈43k audits/mo sustained from month 6).

| Must hold | Plausible? |
|-----------|------------|
| Volume + Credex list + one viral moment | Hard |
| 45% email capture, 12% high-savings | Yes for founder-intent traffic |
| 30% consultation→close | Optimistic |
| LTV ≥ $1,100 as cohort broadens | At risk |

**Base case 18 mo:** **$200k–$500k ARR** (~460–1,150 customers) — still >5× build cost; Credex owns channels competitors cannot copy.

## Why ship anyway

Unfair distribution (customer list + credex.rocks), honest >$500/mo filter, SEO moat on "AI spend audit," and flat COGS as audits scale — LLM is a rounding error because audit math is deterministic.
