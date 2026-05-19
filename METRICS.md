# Metrics — what to track and why

## North-star metric

**Qualified leads generated for Credex per week**
= count of unique emails captured from audits with `total_monthly_savings > $500`.

## Funnel metrics (top-down)

| Step | Event | Where measured |
|------|-------|----------------|
| 1. Visit | `page_view` on `/` | Vercel Analytics + Plausible (optional) |
| 2. Form start | First keystroke / select on `SpendForm` | Frontend event |
| 3. Audit submit | `POST /api/audit` 200 | Server log + `audits` table count |
| 4. Results view | `GET /audit/[id]` | Server log |
| 5. Email captured | `POST /api/leads` 200 | `leads` table |
| 6. High-savings hit | `audits.is_high_savings = true` | DB query |
| 7. Credex CTA click | UTM on `https://credex.rocks?source=spendsense&audit=[id]` | Vercel referrer logs |

## Counter-metrics (don't game the funnel)

- **Honesty rate** = % of completed audits where `total_monthly_savings >= $100` — should not creep to 100%. If it does, the rules are exaggerating savings.
- **AI fallback rate** = % of audits where the summary came from template, not Claude. Spike = API health issue.
- **Share clicks per audit** = `Copy link` + `Share on X` per `/audit/[id]` view. Drives viral coefficient.

## Operational health

| Metric | Threshold | Action |
|--------|-----------|--------|
| `POST /api/audit` p95 | < 3s | Investigate Anthropic latency |
| 5xx rate | < 1% | Page on-call |
| Rate-limit 429s | < 5% of audits | Tune limit (currently 10/IP/hr) |
| Supabase row count delta | > 0 / day | Confirm persistence |

## Tools (free tier)

- **Vercel Analytics** — page views, web vitals
- **Supabase logs + table queries** — funnel counts via SQL
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

-- Conversion: audits to leads
select count(distinct a.id) as audits,
       count(distinct l.audit_id) as leads,
       round(100.0 * count(distinct l.audit_id) / nullif(count(distinct a.id),0), 1) as pct
from audits a
left join leads l on l.audit_id = a.id
where a.created_at > now() - interval '7 days';
```

## Public dashboard later

Optional: a Supabase view exposed as a read-only `/stats` page showing audits/week + average savings — a transparent commitment to honesty.
