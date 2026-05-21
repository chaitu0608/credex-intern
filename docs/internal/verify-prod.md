# Production verification log

**URL:** https://credex-intern.vercel.app  
**Last verified:** 2026-05-22 (P0 + P1 complete in repo; redeploy after each P1 push)

| Check | Result | Notes |
|-------|--------|-------|
| `GET /` | ✅ 200 | Landing loads |
| `POST /api/audit` | ✅ 200 | Returns audit id + savings |
| `GET /audit/{id}` | ✅ 200 | Persists with Supabase on Vercel |
| `POST /api/leads` | ✅ 200 | Lead + optional Resend email |
| `POST /api/audit` unknown tool | ✅ 400 | After P1-3 deploy |
| Smoke script | ✅ | `SMOKE_BASE_URL=https://credex-intern.vercel.app npm run smoke` |

## Redeploy after code changes

```bash
npx vercel --prod
SMOKE_BASE_URL=https://credex-intern.vercel.app npm run smoke
```
