# Security

SpendSense is a public, no-login lead-gen tool. Security focuses on **abuse resistance** and **data exposure minimization**, not multi-tenant auth.

## Secrets

| Variable | Exposure |
|----------|----------|
| `SUPABASE_SERVICE_ROLE_KEY` | Server only — never `NEXT_PUBLIC_*` |
| `OPENAI_API_KEY`, `RESEND_API_KEY` | Server only |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client — read-only via RLS |

## Row Level Security

- **`audits`:** public read for share URLs; no public insert/update/delete
- **`leads`:** no anon policies — API writes via service role
- **`rate_limits`:** service role only

Validated in [`tests/unit/rls-policy.test.ts`](../tests/unit/rls-policy.test.ts) against `schema.sql`.

## Abuse controls

| Control | Behavior |
|---------|----------|
| Honeypot `website` | Fake audit id, no DB |
| Honeypot `phone` on leads | Fake success, no DB |
| Rate limit | 10 POSTs / IP / hour (audits + leads share bucket) |
| Rate limit DB down in **prod** | **Fail closed** → 429 |
| Rate limit DB down in **dev** | Fail open |
| No hCaptcha | Intentional UX trade-off; add if bots spike |

## What is not stored on `audits`

No email, company name, or PII on audit rows — only on `leads` after explicit capture.

## Chat guardrails

Audit chat system prompt forbids inventing dollar amounts or plans not in saved recommendations ([`src/lib/audit-chat-context.ts`](../src/lib/audit-chat-context.ts)).

**Related:** [`API.md`](API.md), [`FAILURE_CASES.md`](FAILURE_CASES.md), [`ARCHITECTURE.md`](../ARCHITECTURE.md) appendix
