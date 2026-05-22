# Metrics — Product Analytics

SpendSense is B2B lead-gen for Credex — founders audit when hiring forces a stack review, not daily. **DAU measures the wrong behavior.** We track pipeline outcomes.

## North Star metric

**Qualified leads per week** — unique emails captured from audits where `total_monthly_savings > $500` (`is_high_savings`).

Credex only wins when a founder with real overspend enters the sales pipeline. Visits, completed audits, and even total emails are inputs; they are not the outcome. This metric ties directly to [`ECONOMICS.md`](ECONOMICS.md) EV math (~12% of audits qualify at steady state) and [`GTM.md`](GTM.md) week-1 targets (3–5 qualified leads from ~75 audits).

## Three input metrics

| # | Metric | Why it drives the North Star | Steady-state target |
|---|--------|------------------------------|---------------------|
| 1 | **Completed audits / week** | Caps all downstream volume | ≥ 1,000 |
| 2 | **Post-audit email capture rate** | Audits → contactable leads | ≥ 40% |
| 3 | **High-savings rate** (`>$500/mo` on completed audits) | Share of leads that are sales-ready | ≥ 10% |

**North Star math:** `audits × email_rate × high_savings_rate`. At target: 1,000 × 0.40 × 0.10 ≈ **40 qualified leads/week**.

**Downstream (not an input, but watched):** **Consultation conversion** — % of high-savings Credex CTA clicks that book a call. [`ECONOMICS.md`](ECONOMICS.md) assumes ~8%; if this stalls while qualified leads rise, the bridge to revenue is broken, not top-of-funnel.

## What to instrument first

Week 1, in order — each step is already persisted or trivial to add:

1. **`POST /api/audit` successes** — daily count; confirms funnel top.
2. **`/audit/[id]` views** — did they see savings before leaving?
3. **`POST /api/leads` by `is_high_savings`** — North Star numerator.
4. **Credex CTA clicks** — UTM on `credex.rocks` (`utm_source=spendsense`, `audit_id`); measures consultation intent.
5. **Share-link copies** — viral coefficient on results hero.

Supabase counts + Vercel Analytics + optional `POST /api/log/event` for clicks. **Counter-metrics:** honesty rate (savings ≥ $100; expect 40–60%), AI fallback rate, audit-to-share ratio.

## Pivot threshold

Pivot if **any** condition holds for **two consecutive weeks** of real traffic (not a one-off launch spike):

| Trigger | Threshold | Pivot |
|---------|-----------|-------|
| North Star (qualified leads/week) | **< 5** | GTM wrong at 30 days; product wrong at 60 days → benchmark/community mode |
| Email capture after audit | **< 20%** | Optional email + save-link UX; capture on follow-up |
| Audit completion (visitors → submit) | **< 15%** | Shorten form; fix value prop |
| Credex consultation booking (CTA clicks → booked) | **< 5%** | Move CTA earlier; simplify booking |
| "Report wrong" on recommendations | **> 10%** of leads | Pause new rules; revalidate against vendor pricing |

**Hardest commitment:** under 5 qualified leads/week at day 30 → fix GTM; still under 5 at day 60 → pivot product, not just channels.
