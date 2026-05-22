# Benchmarking and test matrix

How we prove the build works — for graders and finance reviewers.

## Vitest (unit + integration)

```bash
npm test              # full suite
npm run test:watch
npx vitest run tests/unit/audit-engine.test.ts
```

**Current:** 86 tests across 12 files (see [`TESTS.md`](../TESTS.md) for per-test map).

| Area | File(s) |
|------|---------|
| Audit engine | `tests/unit/audit-engine.test.ts` (23) |
| Pricing | `tests/unit/pricing.test.ts` |
| Validation | `tests/unit/validation.test.ts` |
| RLS schema | `tests/unit/rls-policy.test.ts` |
| API routes | `tests/integration/` |

## Playwright (E2E)

```bash
npx playwright install chromium
npm run test:e2e
```

Covers: landing → audit → results, OG metadata, accessibility scans.

## Smoke (HTTP)

```bash
npm run build && PORT=3025 npm run start
SMOKE_BASE_URL=http://localhost:3025 npm run smoke
```

Script: [`scripts/smoke-e2e.mjs`](../scripts/smoke-e2e.mjs) — health, audit POST, share page.

Production:

```bash
SMOKE_BASE_URL=https://credex-intern.vercel.app npm run smoke
```

## Env / DB verification

```bash
npm run verify:env
npm run test:supabase
```

## CI

[`.github/workflows/ci.yml`](../.github/workflows/ci.yml) — lint, typecheck, unit tests on push.

## What benchmarks do not cover

- Real OpenAI latency under load
- Production Supabase persistence until keys are set ([`DEPLOYMENT.md`](DEPLOYMENT.md))
- Lighthouse scores — run manually, paste into [`DEVLOG.md`](../DEVLOG.md)

**Related:** [`TESTS.md`](../TESTS.md), [`PERFORMANCE.md`](PERFORMANCE.md)
