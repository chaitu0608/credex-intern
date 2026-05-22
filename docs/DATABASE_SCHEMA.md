# Database schema

**Source of truth:** [`supabase/schema.sql`](../supabase/schema.sql) — run in Supabase SQL Editor on new projects.

## Tables

### `audits`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `text` PK | `nanoid(10)` from app |
| `input` | `jsonb` | Persisted form payload (honeypot stripped) |
| `recommendations` | `jsonb` | Engine output array |
| `total_monthly_savings` | `numeric` | Sum of line savings |
| `total_annual_savings` | `numeric` | Monthly × 12 |
| `ai_summary` | `text` | Narrative paragraph |
| `summary_source` | `text` | `'ai'` or `'template'` |
| `is_high_savings` | `boolean` | &gt; $500/mo |
| `created_at` | `timestamptz` | Default `now()` |

**Index:** `audits_created_at_idx` on `created_at DESC`

### `leads`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` PK | Auto |
| `email` | `text` | Required |
| `company_name`, `role`, `team_size` | optional | Lead form |
| `audit_id` | `text` FK → `audits` | Nullable, `on delete set null` |

### `rate_limits`

| Column | Type | Notes |
|--------|------|-------|
| `ip` | `text` PK | Client IP |
| `count` | `integer` | Requests in window |
| `window_start` | `timestamptz` | Rolling hour bucket |

## Row Level Security

| Table | Public access |
|-------|----------------|
| `audits` | **SELECT** for `anon` + `authenticated` (share URLs) |
| `leads` | No public policies |
| `rate_limits` | No public policies |

Writes use `SUPABASE_SERVICE_ROLE_KEY` in API routes (bypasses RLS).

## Local / E2E fallback

When Supabase is not configured, [`src/lib/supabase.ts`](../src/lib/supabase.ts) uses an in-memory `Map` per server instance — **not** for production. See [`FAILURE_CASES.md`](FAILURE_CASES.md).

**Related:** [`SECURITY.md`](SECURITY.md), [`docs/setup/supabase.md`](setup/supabase.md)
