-- Run in Supabase SQL Editor (Settings → SQL → New query)
-- SpendSense / AI Spend Audit

create table if not exists audits (
  id text primary key,
  input jsonb not null,
  recommendations jsonb not null,
  total_monthly_savings numeric not null,
  total_annual_savings numeric not null,
  ai_summary text,
  is_high_savings boolean default false,
  created_at timestamptz default now()
);

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  company_name text,
  role text,
  team_size integer,
  audit_id text references audits(id) on delete set null,
  created_at timestamptz default now()
);

create table if not exists rate_limits (
  ip text primary key,
  count integer not null default 1,
  window_start timestamptz not null default now()
);

create index if not exists audits_created_at_idx on audits (created_at desc);

alter table audits enable row level security;
alter table leads enable row level security;
alter table rate_limits enable row level security;

-- Public share URLs: read audits only (no email/PII in this table)
drop policy if exists "audits public read" on audits;
create policy "audits public read"
  on audits for select
  to anon, authenticated
  using (true);

-- Do NOT add insert/update/delete policies for audits or leads.
-- API routes use SUPABASE_SERVICE_ROLE_KEY which bypasses RLS.

-- rate_limits: no public policies (service role only)
