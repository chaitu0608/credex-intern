# Deploy SpendSense to Vercel

## Prerequisites

1. Run `npm run verify:env` — all 6 vars must be set in `.env.local`
2. Run `npm run test:supabase` — confirms DB connectivity
3. Push repo to GitHub

## CLI deploy

```bash
npm i -g vercel
vercel login
vercel
# follow prompts — link to existing project or create new
```

Add environment variables:

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add OPENAI_API_KEY
vercel env add RESEND_API_KEY
vercel env add NEXT_PUBLIC_APP_URL
```

Set `NEXT_PUBLIC_APP_URL` to your production URL (e.g. `https://spendsense-xxx.vercel.app`), then:

```bash
vercel --prod
```

## Dashboard deploy

1. [vercel.com/new](https://vercel.com/new) → Import Git repo
2. Framework: Next.js (auto-detected)
3. **Settings → Environment Variables** — paste all 6 from `.env.local`
4. Deploy → copy URL → update `NEXT_PUBLIC_APP_URL` → Redeploy

## Post-deploy verify

```bash
curl -s -o /dev/null -w "%{http_code}" https://YOUR_URL/
SMOKE_BASE_URL=https://YOUR_URL npm run smoke
```

Update `README.md` Deployed URL section.
