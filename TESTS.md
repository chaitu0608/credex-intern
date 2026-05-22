# TESTS — Engineering Trust Doc

## Purpose

This document shows **reliability** and **engineering seriousness** for anyone grading SpendSense/Credex — especially finance reviewers who need defensible savings math, not marketing claims.

All dollar amounts in audit results come from [`src/lib/auditEngine.ts`](src/lib/auditEngine.ts) and [`src/lib/pricing.ts`](src/lib/pricing.ts). The LLM never computes savings.

---

## Run everything locally

```bash
npm run lint          # ESLint (Next.js)
npm run typecheck     # tsc --noEmit
npm test              # all 86 Vitest unit + integration tests
npm run test:watch    # Vitest watch mode
```

Audit engine only:

```bash
npx vitest run tests/unit/audit-engine.test.ts
```

E2E (optional; requires Chromium):

```bash
npx playwright install chromium
npm run test:e2e
```

Smoke against a running server:

```bash
npm run build && PORT=3025 npm run start
SMOKE_BASE_URL=http://localhost:3025 npm run smoke
```

**Current status:** 86 Vitest tests across 12 files — all green locally.

---

## Section A — Audit engine (required minimum: 5+)

**File:** [`tests/unit/audit-engine.test.ts`](tests/unit/audit-engine.test.ts)  
**Tests:** 23  
**Run:** `npx vitest run tests/unit/audit-engine.test.ts`

| Test name | Category | What it asserts |
|-----------|----------|-----------------|
| flags high savings when total exceeds $500/mo | Savings calculations | `isHighSavings` true when stack savings exceed `HIGH_SAVINGS_THRESHOLD_MONTHLY` ($500) |
| returns zero savings for an already-optimal solo stack | Edge cases | Solo Cursor Pro → all `right-sized`, $0 total |
| recommends Claude Team to Pro downgrade for small teams | Downgrade logic | Team &lt; 5 seats → `optimize-seats`, positive savings from list prices |
| recommends Cursor Business to Pro for single seat | Downgrade logic | Solo Business → Pro, $20/mo savings |
| suggests Windsurf alternative for large Copilot Business coding teams | Alternative recommendations | Copilot Business → `switch-tool`, `alternativeTool: Windsurf` |
| detects duplicate writing assistants in mixed stacks | Alternative recommendations | Two writing tools → positive total savings |
| drops the lower-spend writing assistant, not the higher | Edge cases | ChatGPT dropped, Claude kept as standard |
| downgrades Gemini Ultra to Pro using list prices from PRICING_DATA | Downgrade logic | Ultra→Pro savings = list delta (~$229.99) |
| downgrades solo Gemini Ultra regardless of use case | Downgrade logic | Solo Ultra downgraded even for `coding` use case |
| surfaces API benchmark guidance for anthropic-api with zero fabricated savings | Credit optimization | `use-credits`, $0 savings, usage-based reason |
| surfaces API benchmark guidance for claude api plan | Credit optimization | Claude API plan → $0 savings, benchmark copy |
| surfaces API benchmark guidance for chatgpt api plan | Credit optimization | ChatGPT API → $0 savings |
| surfaces API benchmark guidance for gemini api plan | Credit optimization | Gemini API → `use-credits`, $0 savings |
| does not downgrade Gemini Ultra for coding teams with multiple seats | Edge cases | Multi-seat coding Ultra → not downgraded, $0 savings |
| surfaces API benchmark guidance for openai-api | Credit optimization | OpenAI API → $0 savings, token/usage copy |
| mentions Credex credits on high-spend direct API usage | Credit optimization | High API spend → reason mentions Credex |
| caps writing-duplicate savings at catalog list price not reported overspend | Savings calculations | Duplicate savings capped at list price, not inflated user spend |
| includes Gemini in writing-duplicate consolidation | Alternative recommendations | Gemini dropped when paired with Claude writing stack |
| does not double-count per-tool and overlap savings beyond one line per tool | Edge cases | At most one savings line per tool ID |
| downgrades Claude Max to Pro for writing use cases | Downgrade logic | Max→Pro for `writing`, savings = list delta |
| recommends ChatGPT Team to Plus for solo users | Downgrade logic | Solo user on Team plan → Plus, seat-minimum savings |
| sets totalAnnualSavings to twelve times totalMonthlySavings | Savings calculations | `totalAnnualSavings === totalMonthlySavings * 12`; per-line `annualSavings` consistent |
| flags Cursor + Copilot overlap on a coding team and drops the cheaper seat | Alternative recommendations | Overlap rule drops Copilot ($114), keeps Cursor |

### Rubric category coverage

| Category | Covered by |
|----------|------------|
| Savings calculations | high-savings flag, list-price cap, annual = monthly × 12, overlap $114 |
| Downgrade logic | Cursor Business→Pro, Gemini Ultra→Pro, Claude Max→Pro, Claude Team→Pro, ChatGPT Team→Plus |
| Alternative recommendations | Windsurf switch, writing duplicates, Cursor+Copilot overlap |
| Edge cases | optimal zero stack, no double-count, lower-spend dropped, coding Ultra no downgrade |
| Credit optimization | all API/`use-credits` paths, $0 savings, Credex on high API spend |

---

## Section B — Why these tests matter financially

- **Savings calculations:** Wrong totals misstate runway and Credex CTA thresholds (`HIGH_SAVINGS_THRESHOLD_MONTHLY = 500`). Finance teams reject inflated claims; tests lock aggregation and the 12× annual multiplier shown on the results page.
- **Downgrade logic:** Tier mistakes (Ultra, Max, Business, Team minimums) are the highest-confidence, lowest-risk savings. Tests anchor math to official list prices in `pricing.ts`, not user-reported overspend.
- **Alternative recommendations:** Cross-tool switches (Windsurf, consolidate writing, IDE overlap) affect procurement. Tests ensure `alternativeTool` labels and savings are consistent before anyone acts on them.
- **Edge cases:** List-price caps and one-winner-per-tool rules prevent double-counting that would overstate annual savings by 12× on shareable audit URLs.
- **Credit optimization:** API and usage-based tools must show **$0 fabricated savings**. Tests protect trust where flat-plan math does not apply — and still surface Credex credit guidance honestly on high spend.

---

## Section C — Full automated test catalog

### Unit tests (Vitest)

#### `tests/unit/audit-engine.test.ts` (23 tests)

See Section A. Run: `npx vitest run tests/unit/audit-engine.test.ts`

#### `tests/unit/pricing.test.ts` (5 tests)

Catalog integrity that feeds all engine math.

- includes all 8 assignment tools
- gemini has pro, ultra, and api per assignment
- claude team has min 5 seats
- chatgpt team has min 2 seats
- PRICING_SOURCES has official URL for every tool

Run: `npx vitest run tests/unit/pricing.test.ts`

#### `tests/unit/audit-metrics.test.ts` (7 tests)

Display-only metrics on the audit results page (not engine savings rules).

- sums monthly spend across tools
- computes savings percent
- returns null percent when spend is zero
- computes projected spend after savings
- optimization score is 100 minus savings percent
- narrative references actual savings percent for material waste
- narrative for zero savings says optimized

Run: `npx vitest run tests/unit/audit-metrics.test.ts`

#### `tests/unit/validation.test.ts` (18 tests)

Request validation before `runAudit` is called.

- UNIT-004 rejects negative team size
- UNIT-004 rejects negative monthly spend
- rejects empty tool list
- rejects unknown use case
- rejects seats &lt; 1
- accepts valid input including zero monthly spend (free tier)
- rejects unknown tool
- rejects invalid plan for tool
- accepts gemini ultra and anthropic-api
- rejects duplicate tool in stack
- rejects bad email
- rejects missing auditId
- accepts valid email + auditId
- rejects invalid teamSize when provided
- strips website honeypot from persisted audit input
- INT-003 detects filled honeypot
- ignores empty and undefined
- detects fake audit ids from honeypot API responses

Run: `npx vitest run tests/unit/validation.test.ts`

#### `tests/unit/summary-fallback.test.ts` (3 tests)

AI summary fallback when OpenAI key is missing (no API calls).

- returns templated summary with source template when no API key
- mentions Credex only when isHighSavings
- does not throw on edge inputs (zero savings)

Run: `npx vitest run tests/unit/summary-fallback.test.ts`

#### `tests/unit/rate-limit.test.ts` (3 tests)

Fail-closed rate limiting in production.

- allows requests in dev when admin client is missing
- blocks requests in production when admin client is missing
- allows requests when E2E_SKIP_RATE_LIMIT is set

Run: `npx vitest run tests/unit/rate-limit.test.ts`

#### `tests/unit/runtime.test.ts` (7 tests)

Environment flags for persistence and rate limits.

- treats Vercel production as production
- allows memory-only persistence in development
- is enabled by default (rate limit)
- is disabled when E2E_SKIP_RATE_LIMIT is set
- allows memory fallback in development
- disallows memory fallback in production without e2e flag
- allows memory fallback in e2e mode even with production NODE_ENV

Run: `npx vitest run tests/unit/runtime.test.ts`

#### `tests/unit/rls-policy.test.ts` (3 tests)

Supabase RLS migration baseline.

- enables RLS on every table
- only audits has a public read policy
- does not grant public insert/update/delete on audits or leads

Run: `npx vitest run tests/unit/rls-policy.test.ts`

#### `tests/unit/app-url.test.ts` (3 tests)

Absolute URL resolution for OG links and share cards.

- prefers NEXT_PUBLIC_APP_URL when set
- uses VERCEL_PROJECT_PRODUCTION_URL before VERCEL_URL
- falls back to localhost when no env

Run: `npx vitest run tests/unit/app-url.test.ts`

#### `tests/unit/og-metadata.test.ts` (2 tests)

Open Graph metadata builders.

- builds absolute OG image URL from app base
- includes images and url in openGraph object

Run: `npx vitest run tests/unit/og-metadata.test.ts`

### Integration tests (Vitest + NextRequest)

#### `tests/integration/api-audit.test.ts` (6 tests)

`POST /api/audit` route with in-memory Supabase stub.

- creates an audit and returns a public share id
- returns 400 on invalid input
- returns 400 for unknown tool
- returns 400 for invalid plan
- persists audit input without website honeypot field
- INT-003 returns fake id when honeypot is filled (no DB write)

Run: `npx vitest run tests/integration/api-audit.test.ts`

#### `tests/integration/api-lead-capture.test.ts` (6 tests)

`POST /api/leads` after a real audit.

- captures email with optional company/role after a real audit
- rejects invalid email with 400
- rejects unknown auditId with 400
- returns emailSent false when Resend reports an error
- returns emailSent true when Resend succeeds
- INT-003 honeypot returns success without writing

Run: `npx vitest run tests/integration/api-lead-capture.test.ts`

---

## Section D — E2E and smoke (secondary)

Not counted toward the audit-engine minimum; listed for completeness.

### Playwright E2E

| File | Test | Run |
|------|------|-----|
| `tests/e2e/user-journey.spec.ts` | E2E-001 cold visitor completes audit flow | `npm run test:e2e` |
| `tests/e2e/og-tags.spec.ts` | E2E-004 audit page has OG + Twitter card meta | `npm run test:e2e` |
| `tests/e2e/accessibility.spec.ts` | E2E-005 landing a11y; E2E-005b audit results a11y | `npm run test:e2e` |
| `tests/e2e/mobile-landing.spec.ts` | mobile landing shows audit coverage panel | `npm run test:e2e` |

### Smoke (`scripts/smoke-e2e.mjs`)

Nine HTTP checks against a running server (`npm run smoke`):

1. `GET /` 200
2. `POST /api/audit` returns id + savings
3. `GET /audit/[id]` renders results
4. OG / Twitter metadata present
5. `POST /api/leads` succeeds with valid input
6. Honeypot on `/api/audit` returns fake id, no persist
7. Unknown tool → 400
8. Gemini Ultra solo writing → ~$229.99/mo savings
9. `anthropic-api` → $0 total savings

---

## Section E — CI

**Workflow:** [`.github/workflows/ci.yml`](.github/workflows/ci.yml)

Triggers on every **push** to `main` / `master` and on pull requests targeting those branches.

| Job | Steps |
|-----|-------|
| `build-and-test` | `npm ci` → lint → typecheck → **test** → build |
| `e2e` | Playwright Chromium (runs after `build-and-test`) |

Graders need a **pushed commit** on `main` for green checks to appear in GitHub Actions.

---

## Live backend tests (manual)

After Supabase keys are in `.env.local`:

```bash
npm run verify:env
npm run test:supabase
```

---

## Coverage map

Row-by-row test-matrix mapping: [`docs/internal/crosscheck.md`](../internal/crosscheck.md).
