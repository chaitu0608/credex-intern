# Day 3 — Quickstart (your 90-minute deploy block)

Do these in order. Code is ready; this unblocks the live URL.

## 1. Keys (30 min)

| Service | Get key from | Paste into `.env.local` |
|---------|--------------|-------------------------|
| Supabase | supabase.com → New project → Settings → API | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` |
| Anthropic | console.anthropic.com | `ANTHROPIC_API_KEY` |
| Resend | resend.com → API Keys | `RESEND_API_KEY` |

Run SQL: copy [`supabase/schema.sql`](../supabase/schema.sql) → Supabase SQL Editor → Run.

```bash
npm run verify:env
npm run test:supabase
```

## 2. Vercel (20 min)

1. https://vercel.com → **credex-intern** project → Settings → Environment Variables
2. Add all 6 vars (same as `.env.local`)
3. Terminal:

```bash
npx vercel --prod
```

4. Copy URL → set `NEXT_PUBLIC_APP_URL=https://YOUR-URL` in Vercel → redeploy:

```bash
npx vercel --prod
```

5. Update [`README.md`](../README.md) line 5 with the URL.

## 3. Verify (15 min)

1. Live site → run audit → copy share link → open in incognito
2. Submit email on results page → check inbox
3. Lighthouse mobile on live URL → paste scores into DEVLOG Day 3

## 4. Screenshots (15 min)

See [`screenshots/README.md`](screenshots/README.md).

## 5. Interviews (parallel)

Send DMs from [`USER_INTERVIEWS.md`](../USER_INTERVIEWS.md) appendix. Transcribe at least one call today.
