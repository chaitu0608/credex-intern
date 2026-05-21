# P3 API & storage cross-check (2026-05-21)

## P3.1 — Honeypot not in persisted audits

- `toPersistedAuditInput()` in `validation.ts` omits `website`
- Audit route uses `persisted` for `runAudit`, `generateAISummary`, and `AuditResult.input`
- Test: `toPersistedAuditInput` unit + `api-audit` integration via `getAudit`

## P3.2 — Honest `emailSent`

- `leads/route.ts`: `emailSent = !resendResult.error` only after successful send
- Lead still saved when email fails (`success: true`, `emailSent: false`)
- Tests: Resend mock error vs success in `api-lead-capture.test.ts`

## P3.3 — Rate limit fail-closed in production

| Condition | Dev | Prod |
|-----------|-----|------|
| No admin client | allow | **block (429)** |
| DB select/insert/update error | allow | **block** |
| catch | allow | **block** |

## P3.4 — Lazy Supabase clients

- `getSupabaseClient()` / `getSupabaseAdmin()` memoize on first use
- No eager `createClient` at module import

## Verification

```bash
npm test   # 68 passed
npx vercel --prod --yes
SMOKE_BASE_URL=https://credex-intern.vercel.app npm run smoke
```
