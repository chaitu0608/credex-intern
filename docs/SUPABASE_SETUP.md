# Supabase setup (5 minutes)

## 1. Create project

1. Go to [supabase.com](https://supabase.com) → New project
2. Copy **Project URL**, **anon public** key, and **service_role** key (Settings → API)

## 2. Run schema

1. Supabase dashboard → **SQL Editor** → New query
2. Paste entire contents of [`supabase/schema.sql`](../supabase/schema.sql)
3. Click **Run**

If you ran an older schema with `audits service insert` policies, re-run the new schema file — it drops the unsafe insert policy.

## 3. `.env.local`

```bash
cp .env.example .env.local
```

Fill in:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**All three Supabase keys are required** for audits to persist and share links to work after deploy.

## 4. Verify

```bash
npm run dev
```

Submit an audit, then open the share URL in an **incognito** window. If it loads, Supabase is working.

Check tables in **Table Editor** → `audits` and `leads`.

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `503 Could not save audit` | Run `schema.sql`; confirm `SUPABASE_SERVICE_ROLE_KEY` |
| Share link works once, then 404 on redeploy | Service role key missing — audits only in memory |
| Lead saves but no email | Add `RESEND_API_KEY` (optional) |
