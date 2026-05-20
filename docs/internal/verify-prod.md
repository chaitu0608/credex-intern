# Production verification log (2026-05-20)

**URL:** https://credex-intern.vercel.app

| Check | Result | Notes |
|-------|--------|-------|
| `GET /` | ✅ 200 | Landing loads |
| `POST /api/audit` | ✅ 200 | Returns audit id + savings |
| `GET /audit/{id}` | ⚠️ 200 | Works immediately; may 404 on cold start without Supabase |
| `POST /api/leads` | ❌ 400 | `Audit not found` — **Supabase keys required on Vercel** |

## Fix (required for full submission)

1. Add all keys in Vercel → Settings → Environment Variables (see [`../setup/inputs-needed.md`](../setup/inputs-needed.md))
2. Set `NEXT_PUBLIC_APP_URL=https://credex-intern.vercel.app`
3. Redeploy: `npx vercel --prod`
4. Re-run:

```bash
SMOKE_BASE_URL=https://credex-intern.vercel.app npm run smoke
```
