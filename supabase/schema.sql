-- Run in Supabase SQL Editor (task 1.4)

create table if not exists audits (
  id text primary key,
  input jsonb not null,
  recommendations jsonb not null,
  total_monthly_savings numeric not null,
  total_annual_savings numeric not null,
  ai_summary text,
  is_high_savings boolean default false,
  created_at timestamp with time zone default now()
);

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  company_name text,
  role text,
  team_size integer,
  audit_id text references audits(id),
  created_at timestamp with time zone default now()
);

create table if not exists rate_limits (
  ip text primary key,
  count integer default 1,
  window_start timestamp with time zone default now()
);

alter table audits enable row level security;
alter table leads enable row level security;
alter table rate_limits enable row level security;

create policy "audits public read" on audits for select using (true);
create policy "audits service insert" on audits for insert with check (true);
create policy "leads service insert" on leads for insert with check (true);
create policy "rate_limits all" on rate_limits using (true) with check (true);
