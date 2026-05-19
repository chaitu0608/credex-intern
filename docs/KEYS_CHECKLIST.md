# Keys checklist — paste into `.env.local`

Copy [`.env.example`](../.env.example) if needed. Fill every line below, then run:

```bash
npm run verify:env
npm run dev
npm run smoke
```

## 1. Supabase (required)

1. [supabase.com](https://supabase.com) → New project
2. **SQL Editor** → paste [`supabase/schema.sql`](../supabase/schema.sql) → Run
3. **Settings → API** → copy:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
```

## 2. Anthropic (required for MVP-4)

1. [console.anthropic.com](https://console.anthropic.com) → API keys → Create
2. Add:

```env
ANTHROPIC_API_KEY=sk-ant-api03-...
```

## 3. Resend (required for MVP-5 email)

1. [resend.com](https://resend.com) → API Keys → Create
2. Add:

```env
RESEND_API_KEY=re_...
```

Emails send from `onboarding@resend.dev` (no custom domain needed on free tier).

## 4. App URL

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

For Vercel production, change to `https://your-app.vercel.app` and redeploy.

## 5. Vercel (Day 1 deploy)

Add the same 6 variables in Vercel → Project → Settings → Environment Variables.
