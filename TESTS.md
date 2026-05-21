# Tests

## Run locally

```bash
npm run lint
npm run typecheck
npm test                              # all 68 unit + integration tests (Vitest)
npm run test:e2e                      # Playwright (requires browsers)
npm run smoke                         # full HTTP smoke against running server
```

To start the server for smoke or Playwright manually:

```bash
npm run build && PORT=3025 npm run start
SMOKE_BASE_URL=http://localhost:3025 npm run smoke
```

## What's covered

### Unit (Vitest)

| File | Tests | Test-matrix IDs |
|------|-------|-----------------|
| `src/lib/auditEngine.test.ts` | 20 | UNIT-001, UNIT-002, UNIT-003, P2 engine rules |
| `src/lib/pricing.test.ts` | 4 | pricing freshness |
| `tests/unit/validation.test.ts` | 12 | UNIT-004, INT-003 (honeypot), P3 sanitize |
| `tests/unit/rate-limit.test.ts` | 2 | P3 fail-closed rate limit |
| `tests/unit/summary-fallback.test.ts` | 3 | UNIT-006 |
| `tests/unit/rls-policy.test.ts` | 3 | security baseline |

### Integration (Vitest + NextRequest)

| File | Tests | Test-matrix IDs |
|------|-------|-----------------|
| `tests/integration/api-audit.test.ts` | 6 | INT-001, INT-003, P3 persisted input |
| `tests/integration/api-lead-capture.test.ts` | 6 | INT-002, INT-003, P3 emailSent |

**Total: 68 tests across 11 files — all green.**

### E2E (Playwright)

| File | Test-matrix IDs |
|------|-----------------|
| `tests/e2e/user-journey.spec.ts` | E2E-001 |
| `tests/e2e/og-tags.spec.ts` | E2E-004 |
| `tests/e2e/accessibility.spec.ts` | E2E-005, E2E-005b (landing + audit a11y) |
| `tests/e2e/mobile-landing.spec.ts` | P4 mobile sample preview |

Run via `npm run test:e2e` after `npx playwright install chromium`.

### Smoke (`scripts/smoke-e2e.mjs`)

Nine HTTP-level checks against a running server:

1. `GET /` 200
2. `POST /api/audit` returns id + savings
3. `GET /audit/[id]` renders results
4. OG / Twitter metadata present
5. `POST /api/leads` succeeds with valid input
6. Honeypot on `/api/audit` returns a fake id and does not persist
7. Unknown tool → 400
8. P2: Gemini Ultra solo writing → ~$229.99/mo total savings
9. P2: `anthropic-api` → $0 total savings

## CI

`.github/workflows/ci.yml`:

- **build-and-test job:** lint → typecheck → test → build
- **e2e job:** Playwright with Chromium

## Live backend tests

After Supabase keys are pasted into `.env.local`:

```bash
npm run verify:env       # all 6 env vars set
npm run test:supabase    # insert + read round-trip
```

## Coverage map vs `test.json`

See [`docs/internal/crosscheck.md`](docs/internal/crosscheck.md) for a row-by-row map of every test-matrix item to the file that covers it.
