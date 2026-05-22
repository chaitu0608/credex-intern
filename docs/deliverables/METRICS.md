# Metrics — what to track and why

## North-star metric

**Qualified leads generated for Credex per week**
= count of unique emails captured from audits with `total_monthly_savings > $500`.

This is the metric Credex cares about. Not visits, not audits, not even total emails — *qualified* leads. SpendSense exists to feed Credex's sales pipeline; any metric that doesn't tie back to that is a vanity number.

## Three input metrics that drive the North Star

| # | Input metric | Why it drives the North Star | Target (steady state) |
|---|--------------|------------------------------|------------------------|
| 1 | **Completed audits / week** | Top-of-funnel volume — every other metric is bounded by this | ≥ 1,000 |
| 2 | **Post-audit email capture rate** | Determines how many audits convert to a lead | ≥ 40% |
| 3 | **% of completed audits where `total_monthly_savings > $500`** | Determines the share of leads that are *qualified* | ≥ 10% |

North-star math: `audits × email-rate × high-savings-rate = qualified leads/week`. At target (1,000 × 0.40 × 0.10) = **40 qualified leads / week**.

If any one input drops below target, the North Star drops proportionally — so each input gets its own dashboard tile, not just the aggregate.

## What I'd instrument first

In strict order, week 1 of live traffic:

1. **`POST /api/audit` success counter** — by day, by IP. Confirms the funnel top is alive.
2. **`/audit/[id]` page-view counter** — tells me how many people actually see the savings number after submitting.
3. **`POST /api/leads` success counter** — by `is_high_savings` flag — the qualified-lead numerator.
4. **Credex CTA click-through** — via the UTM (`utm_source=spendsense&utm_medium=audit&utm_campaign=high_savings&audit_id=…`) on the `https://credex.rocks` button. Confirms intent past email capture.
5. **Share-link copies** — `Copy link` + `Share on X` button clicks per audit. Drives viral coefficient.

Implementation: Vercel Analytics for page views, Supabase row counts for funnel steps, and a thin client-side `fetch("/api/log/event")` for in-page interactions. All zero-cost on free tiers.

## Counter-metrics (don't game the funnel)

- **Honesty rate** = % of completed audits where `total_monthly_savings >= $100`. Should sit around **40–60%**. If it creeps to 90%+ the rules are exaggerating savings; if it drops to <20% the form isn't capturing accurate inputs. Either is a red flag.
- **AI fallback rate** = % of audits where the summary came from the template, not OpenAI. Spike above ~5% = OpenAI API health issue.
- **Audit-to-share-click ratio** — high audits, zero shares = the savings number isn't shareable enough; redesign the hero.

## Operational health thresholds

| Metric | Threshold | Action |
|--------|-----------|--------|
| `POST /api/audit` p95 latency | < 3s | Investigate OpenAI call timing |
| 5xx rate | < 1% | Page on-call |
| Rate-limit 429s as % of audits | < 5% | Tune limit (currently 10/IP/hour) |
| Supabase row insert delta | > 0 per active day | Persistence is broken if this is 0 |

## What number triggers a pivot decision

I would seriously consider pivoting if **any one of these** holds for two consecutive weeks of steady-state traffic:

| Trigger | Threshold (sustained 2 weeks) | What it means | Pivot direction |
|---------|--------------------------------|---------------|------------------|
| **Email capture rate after audit** | **< 20%** | Email-after-value isn't worth more than the lost conversion | Switch to anonymous "save link" UX with optional email; lead capture on follow-up email only |
| **Audits per visitor** | **< 15%** (i.e. completion rate below the bar) | The form is too long, or the value prop isn't believable enough to push through it | Cut the form to 3 questions max and iterate on copy |
| **Qualified leads (high-savings) per week** | **< 5** | Either the rules don't surface enough savings, or our traffic isn't the right segment | Recalibrate the $500/mo threshold downward + double-check which segments are submitting |
| **Credex consultation booking rate from CTA clicks** | **< 5%** | The audit-to-Credex bridge is broken — leads come, but they don't connect | Move the CTA earlier on the page or simplify the consultation booking flow |
| **% of audits where user reports our recommendation was wrong** | **> 10%** of leads (via a "report wrong" link) | The audit math has lost defensibility | Pause new rule additions and audit the existing rules against vendor pricing pages |

The hardest commitment: if at **30 days** the North Star is below **5 qualified leads/week**, the GTM is wrong. If at **60 days** it's still below 5, the *product* is wrong and a pivot to a benchmark-mode/community-driven model is on the table.

## Tools (free tier)

- **Vercel Analytics** — page views, web vitals
- **Supabase logs + SQL queries** — funnel counts straight from the tables
- **UTM-tagged Credex link** — referrer attribution
- **GitHub Actions CI badge** — engineering health visible in README

## Quick SQL snippets

```sql
-- Daily audits + high-savings
select date_trunc('day', created_at) as d,
       count(*) as audits,
       count(*) filter (where is_high_savings) as high_savings
from audits
group by 1
order by 1 desc;

-- Conversion: audits → leads
select count(distinct a.id) as audits,
       count(distinct l.audit_id) as leads,
       round(100.0 * count(distinct l.audit_id) / nullif(count(distinct a.id),0), 1) as pct
from audits a
left join leads l on l.audit_id = a.id
where a.created_at > now() - interval '7 days';

-- Honesty rate
select round(100.0 * avg(case when total_monthly_savings >= 100 then 1 else 0 end), 1) as honesty_pct
from audits
where created_at > now() - interval '7 days';
```

## Public dashboard (later)

A read-only `/stats` page exposing `audits_this_week`, `avg_savings_shown`, `share_clicks_per_audit` as a transparent commitment to honest reporting. Public dashboards build trust faster than blog posts.
