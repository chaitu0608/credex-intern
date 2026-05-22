# Deployment

**Target:** Vercel (Next.js 14 App Router)  
**Database:** Supabase Postgres  
**Detailed env checklist:** [`setup/inputs-needed.md`](setup/inputs-needed.md)

## Prerequisites

```bash
npm run verify:env    # all 6 vars non-empty in .env.local
npm run test:supabase # insert + read round-trip
```

## Environment variables

| Variable | Required in prod | Purpose |
|----------|------------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Public read for share pages |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Writes: audits, leads, rate_limits |
| `OPENAI_API_KEY` | Optional | AI summary + chat (template fallback) |
| `RESEND_API_KEY` | Optional | Lead confirmation email |
| `NEXT_PUBLIC_APP_URL` | Yes | OG URLs and share links (no trailing slash) |
| `E2E_SKIP_RATE_LIMIT` | Test only | Playwright / smoke |

## Vercel CLI

```bash
npm i -g vercel
vercel login
vercel
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add OPENAI_API_KEY
vercel env add RESEND_API_KEY
vercel env add NEXT_PUBLIC_APP_URL
vercel --prod
```

Set `NEXT_PUBLIC_APP_URL` to production URL, then redeploy.

## Supabase setup

1. New project at [supabase.com](https://supabase.com)
2. SQL Editor → paste [`supabase/schema.sql`](../supabase/schema.sql) → Run
3. Settings → API → copy URL, anon key, service_role key

See [`setup/supabase.md`](setup/supabase.md).

## Post-deploy verify

```bash
curl -s -o /dev/null -w "%{http_code}" https://YOUR_URL/
SMOKE_BASE_URL=https://YOUR_URL npm run smoke
```

Log results in [`internal/verify-prod.md`](internal/verify-prod.md).

## Known gap

Without production keys, the live URL may run audits but **not persist** them. [`README.md`](../README.md) documents this honestly.

**Related:** [`DATABASE_SCHEMA.md`](DATABASE_SCHEMA.md), [`BENCHMARKING.md`](BENCHMARKING.md)
