# Production verification log

**URL:** https://credex-intern.vercel.app  
**Last verified:** 2026-05-21 (P4 + P5)

| Check | Result | Notes |
|-------|--------|-------|
| `GET /` | ✅ 200 | Landing loads |
| `POST /api/audit` | ✅ 200 | Returns audit id + savings |
| `GET /audit/{id}` | ✅ 200 | Persists with Supabase on Vercel |
| `POST /api/leads` | ✅ 200 | Lead capture; `emailSent` honest |
| `POST /api/audit` unknown tool | ✅ 400 | Validation live |
| P2 Gemini Ultra → Pro | ✅ | `totalMonthlySavings` = 229.99 |
| P2 anthropic-api | ✅ | `totalMonthlySavings` = 0 |
| P3 honeypot not in DB | ✅ | `audits.input` has no `website` |
| P4 mobile coverage panel | ✅ | Visible on mobile viewport |
| P4 a11y e2e | ✅ | Landing + audit results (local Playwright) |
| Smoke script (9 checks) | ✅ | `SMOKE_BASE_URL=https://credex-intern.vercel.app npm run smoke` |

## Redeploy after code changes

```bash
npx vercel --prod --yes
SMOKE_BASE_URL=https://credex-intern.vercel.app npm run smoke
```

If smoke hits **429**, clear `rate_limits` in Supabase or wait 1 hour (10 POSTs/IP/hour).
