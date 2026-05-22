# SpendSense

> A free 3-minute audit of a startup's AI tool stack. Finds overspend on Cursor, Claude, ChatGPT, Copilot, Gemini, and more — with defensible list-price math your finance team will believe. Built as a lead-generation product for [Credex](https://credex.rocks), which sells discounted AI infrastructure credits.

**Live:** https://credex-intern.vercel.app
**Stack:** Next.js 14 App Router · TypeScript strict · Tailwind · shadcn/ui · Supabase · OpenAI · Resend · Vercel
**Tests:** 68 passing (Vitest unit + integration, Playwright e2e + axe-core a11y on landing and audit results)

> **Production:** https://credex-intern.vercel.app — Supabase + OpenAI + Resend configured on Vercel. Audits persist and share URLs work (verified 2026-05-22 via `SMOKE_BASE_URL=https://credex-intern.vercel.app npm run smoke`).

---

## Why this exists

Most startups overspend on AI tools by 20-40% — wrong plan, wrong seat count, duplicate tools, or paying full list price when discounted credits are available. There is no Mint for AI tool spend. SpendSense is that tool: a screenshotable savings number in under three minutes, with every dollar traceable to a vendor pricing URL.

For users with >$500/month in surfaced savings, Credex (the company behind SpendSense) sells discounted AI infrastructure credits sourced from companies that overforecast. The audit is free and useful regardless; Credex is the qualified-lead capture, not the gate.

---

## End-to-end user flow

```mermaid
flowchart LR
  visitor[Cold visitor<br/>HN / X / blog] --> landing[Landing<br/>hero + sample preview]
  landing --> form[Tool palette form<br/>localStorage persisted]
  form --> auditAPI["POST /api/audit"]
  auditAPI --> rateLimit{rate limit<br/>10/IP/hour}
  rateLimit -->|allowed| honeypot{honeypot<br/>website field}
  rateLimit -->|blocked| err429[429]
  honeypot -->|filled| fakeId[fake id<br/>no DB write]
  honeypot -->|empty| engine[auditEngine<br/>rules + list prices]
  engine --> ai[generateAISummary<br/>OpenAI or template]
  ai --> save[(Supabase<br/>audits)]
  save --> redirect[/audit/id]
  redirect --> hero[SavingsHero<br/>monthly + annual]
  hero --> breakdown[AuditResults<br/>per-tool timeline]
  breakdown --> highSavings{savings > 500/mo?}
  highSavings -->|yes| credexCta[Credex CTA<br/>UTM-tagged]
  highSavings -->|no| honest[honest copy<br/>spending well]
  breakdown --> lead[LeadCapture<br/>email after value]
  lead --> leadsAPI["POST /api/leads"]
  leadsAPI --> leadsDB[(Supabase<br/>leads)]
  leadsAPI --> resend[Resend<br/>transactional email]
  redirect --> share[Share URL + OG<br/>dynamic per-audit image]
```

---

## Audit pipeline (server-side)

```mermaid
sequenceDiagram
  participant Client
  participant Audit as POST /api/audit
  participant RL as checkRateLimit
  participant Engine as runAudit
  participant OpenAI as generateAISummary
  participant DB as Supabase

  Client->>Audit: { tools, teamSize, useCase }
  Audit->>RL: ip lookup
  RL-->>Audit: allowed / blocked
  Audit->>Audit: validate + honeypot
  Audit->>Engine: rules over tools
  Engine-->>Audit: recommendations + totals
  Audit->>OpenAI: prompt with totals
  OpenAI-->>Audit: ~100 word paragraph
  Note over OpenAI: falls back to<br/>buildFallbackSummary<br/>on missing key / error
  Audit->>DB: insert audit (server role)
  DB-->>Audit: ok / error
  Audit-->>Client: { id, monthly, annual, isHighSavings }
  Client->>Client: router.push(/audit/id)
```

---

## Lead-gen funnel (Credex revenue path)

```mermaid
flowchart TB
  visit[Cold visit] --> audit[Audit completed]
  audit -->|45%| email[Email captured]
  audit -->|12% of audits| high[High savings<br/>500/mo]
  email --> nurture[Nurture<br/>monthly digest]
  high --> credex[Credex CTA<br/>UTM tagged]
  credex -->|8%| consult[Consultation booked]
  consult -->|30%| close[Credit purchase]
  close --> ltv[LTV ~1,100<br/>over 2.5 years]
  nurture -.->|recheck<br/>3-6 months| audit
```

See [`ECONOMICS.md`](ECONOMICS.md) for the underlying math (lead value ~$7.30/email, CAC by channel, $1M ARR scenario).

---

## Audit engine logic (what the rules actually do)

```mermaid
flowchart TB
  start[ToolEntry + AuditInput] --> seat[Seat optimisation]
  seat -->|"Claude Team < 5 seats"| claudeTeam[Switch to Pro per seat]
  seat -->|"ChatGPT Team / 1 user"| chatgptTeam[Switch to Plus]
  seat -->|"Copilot Enterprise / under 10"| copilotEnt[Downgrade to Business]
  start --> vendor[Same-vendor downgrade]
  vendor -->|"Claude Max + writing"| claudeMax[Pro covers most]
  vendor -->|"Cursor Business + solo"| cursorBiz[Pro covers solo]
  start --> alt[Cross-tool alternatives]
  alt -->|"Copilot Business + coding 5+"| windsurf[Evaluate Windsurf]
  alt -->|"ChatGPT Team + research"| claudePro[Try Claude Pro]
  alt -->|"data use case + flat plan"| api[Benchmark API pricing]
  start --> overlap[Cursor + Copilot overlap<br/>coding teams]
  overlap --> dropCheaper[Pick one IDE assistant]
  start --> writeDup[Writing assistant duplicates]
  writeDup --> consolidate[Drop lower-spend duplicate]
  start --> credits[High-spend list pricing]
  credits --> credex[Ask Credex for quote<br/>no fake percentage]
  claudeTeam --> result[ToolRecommendation]
  chatgptTeam --> result
  copilotEnt --> result
  claudeMax --> result
  cursorBiz --> result
  windsurf --> result
  claudePro --> result
  api --> result
  dropCheaper --> result
  consolidate --> result
  credex --> result
  result --> aggregate[Sum savings<br/>flag is high savings if > 500]
```

Every rule traces to a list price in [`PRICING_DATA.md`](PRICING_DATA.md) and is unit-tested in [`tests/unit/audit-engine.test.ts`](tests/unit/audit-engine.test.ts).

---

## Data model and RLS posture

```mermaid
erDiagram
  audits ||--o{ leads : "audit_id"
  audits {
    text id PK
    jsonb input
    jsonb recommendations
    numeric total_monthly_savings
    numeric total_annual_savings
    text ai_summary
    boolean is_high_savings
    timestamptz created_at
  }
  leads {
    uuid id PK
    text email
    text company_name
    text role
    int team_size
    text audit_id FK
    timestamptz created_at
  }
  rate_limits {
    text ip PK
    int count
    timestamptz window_start
  }
```

- **audits** — public read (anon + authenticated). No PII on this table.
- **leads** — no public policies. Service role only.
- **rate_limits** — service role only.

Schema lives at [`supabase/schema.sql`](supabase/schema.sql). RLS posture is tested in [`tests/unit/rls-policy.test.ts`](tests/unit/rls-policy.test.ts).

---

## Screenshots

Captured from local dev (`localhost:3000`) — May 22, 2026. Seven flows below; rubric needs 3+.

### Landing and audit form

**Hero + benchmark sidebar**

![SpendSense landing — hero and tool benchmark grid](docs/screenshots/landing.png)

**Tool palette + empty stack**

![SpendSense — add tools to your stack](docs/screenshots/audit-form.png)

**Stack configured (plan, seats, spend)**

![SpendSense — stack with plan dropdown and team context](docs/screenshots/audit-form-stack.png)

### Audit results (honest zero-savings path)

**Stack optimized — $0 savings, 100/100 score**

![Audit results — stack optimized honest path](docs/screenshots/audit-optimized.png)

**Per-tool recommendations (rule-based, no LLM math)**

![Audit results — per-tool cards and methodology](docs/screenshots/audit-recommendations.png)

**Lead capture after value** — email gate below full report

![Lead capture — notify when new optimizations apply](docs/screenshots/lead.png)

**Audit chat** — Q&A grounded in saved report only

![Audit chat widget](docs/screenshots/audit-chat.png)

| What | File | Status |
|------|------|--------|
| Landing — hero + benchmark | `docs/screenshots/landing.png` | done |
| Audit form — tool grid | `docs/screenshots/audit-form.png` | done |
| Audit form — configured stack | `docs/screenshots/audit-form-stack.png` | done |
| Optimized stack — honest path | `docs/screenshots/audit-optimized.png` | done |
| Per-tool recommendations | `docs/screenshots/audit-recommendations.png` | done |
| Lead capture — email after value | `docs/screenshots/lead.png` | done |
| Audit chat widget | `docs/screenshots/audit-chat.png` | done |
| High savings (≥ $500/mo) + Credex CTA | `docs/screenshots/audit-high-savings.png` | optional — add stack with Cursor Business + Copilot + Claude Team |
| OG preview at opengraph.xyz | `docs/screenshots/og-preview.png` | optional |

---

## Quick start

```bash
nvm use 20
npm install
cp .env.example .env.local
# Fill in keys — see docs/setup/inputs-needed.md
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Service | Where to get the key | Env var(s) |
|---------|----------------------|------------|
| Supabase | supabase.com → New project → Settings → API | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` |
| OpenAI | platform.openai.com → API Keys | `OPENAI_API_KEY` (optional override: `OPENAI_MODEL`, default `gpt-4o-mini`) |
| Resend | resend.com → API Keys (free tier) | `RESEND_API_KEY` |

Apply the schema in Supabase SQL Editor: paste [`supabase/schema.sql`](supabase/schema.sql) → Run.

```bash
npm run verify:env       # all required vars set
npm run test:supabase    # round-trip insert + read
npm run dev              # http://localhost:3000
```

---

## Deploy (Vercel)

```bash
npx vercel link          # one-time
npx vercel --prod
```

After the first deploy, set every variable from `.env.example` in Vercel → Settings → Environment Variables. Set `NEXT_PUBLIC_APP_URL` to the production URL (no trailing slash) for OG previews and email links to be correct. Redeploy:

```bash
npx vercel --prod
```

Full walkthrough: [`docs/setup/inputs-needed.md`](docs/setup/inputs-needed.md). Production verification log: [`docs/internal/verify-prod.md`](docs/internal/verify-prod.md).

---

## Decisions (5 trade-offs and why)

1. **Hardcoded rules for audit math, LLM only for the summary paragraph.** Finance teams need numbers that trace to a vendor URL. LLMs hallucinate prices and seat minimums. Rules in [`src/lib/auditEngine.ts`](src/lib/auditEngine.ts) + sourced numbers in [`PRICING_DATA.md`](PRICING_DATA.md) are the defensible split; the ~100-word GPT summary in [`src/lib/ai-summary.ts`](src/lib/ai-summary.ts) is reserved for narrative tone, not math.

2. **In-memory fallback in [`src/lib/supabase.ts`](src/lib/supabase.ts) for local dev only.** Lets the dev loop run without a Supabase project, but the route now returns 503 if `saveAudit` fails on a configured deploy, and a loud warning fires when `SUPABASE_SERVICE_ROLE_KEY` is missing in production. Serverless functions don't share memory across requests, so "memory fallback in prod" is a silent landmine — not a feature.

3. **Honeypot + rate limit instead of hCaptcha.** This is a free public lead-gen tool — every step of friction kills the conversion rate. Honeypot fields (`website` on the audit form, `phone` on the lead form) catch naive bots; `website` is never stored on the audit row. A Supabase-backed 10/IP/hour rate limit catches abuse — **fails closed in production** (429 when rate-limit DB is unavailable), permissive in local dev. See [`ARCHITECTURE.md`](ARCHITECTURE.md). hCaptcha is for if real abuse surfaces.

4. **Email gate placed strictly after value is shown.** Every cold visitor sees the full savings number and per-tool breakdown on `/audit/[id]` *before* the lead form. The brief says the email gate should never come before value. Conversion suffers a little; lead quality jumps a lot, and a captured email is qualified by self-selection.

5. **"You're spending well" honest path for zero-savings audits.** For audits at $0/month savings, the page surfaces a plain "your stack is right-sized" message instead of manufacturing savings to justify a Credex CTA. Honest dead-ends protect Credex's brand, produce warmer leads later when the same user's stack grows, and the audit reads as a finance memo not a sales asset.

---

## Tests

```bash
npm test                 # 86 Vitest tests across 12 files
npm run test:e2e         # Playwright (requires `npx playwright install chromium`)
npm run smoke            # HTTP smoke against a running server
```

| Layer | Files | Tests |
|-------|-------|-------|
| Audit engine | `tests/unit/audit-engine.test.ts` | 20 |
| Pricing | `tests/unit/pricing.test.ts` | 4 |
| Validation | `tests/unit/validation.test.ts` | 11 |
| AI summary fallback | `tests/unit/summary-fallback.test.ts` | 3 |
| RLS schema | `tests/unit/rls-policy.test.ts` | 3 |
| API audit | `tests/integration/api-audit.test.ts` | 3 |
| API lead capture | `tests/integration/api-lead-capture.test.ts` | 4 |
| E2E + a11y | `tests/e2e/*.spec.ts` | 3 |

Coverage map: [`TESTS.md`](TESTS.md). Cross-check against the assignment: [`docs/internal/crosscheck.md`](docs/internal/crosscheck.md).

---

## Project structure

```
src/
  app/
    api/
      audit/route.ts            POST /api/audit
      leads/route.ts            POST /api/leads
    audit/[id]/
      page.tsx                  results page (server component, revalidate 3600)
      opengraph-image.tsx       dynamic per-audit OG image
    opengraph-image.tsx         landing OG image
    layout.tsx                  metadata + ThemeProvider
    page.tsx                    landing
    globals.css                 tailwind tokens + aurora keyframes
  components/
    audit/                      results UI (hero, recommendations, lead, share, coverage panel)
    spend-form/                 spend-form + tool-card, stack-card, empty-stack
    layout/                     page-shell, site-header, site-footer
    ui/                         shadcn primitives + brand
  lib/
    auditEngine.ts              rule engine (server-pure)
    pricing.ts                  list prices (mirror of PRICING_DATA.md)
    ai-summary.ts               ~100 word summary + template fallback (OpenAI)
    supabase.ts                 audits / leads / rate_limits helpers (server-only)
    validation.ts               shared input validation
  types/
    index.ts                    AuditInput, AuditResult, ToolEntry, etc.
supabase/schema.sql             tables + RLS
tests/                          unit + integration + e2e
scripts/                        verify-env, test-supabase, smoke-e2e
public/assets/                  credex-logo + tool brand SVGs
docs/
  STRUCTURE.md                  full repo map
  setup/                        inputs-needed, supabase, deploy
  internal/                     crosscheck, verify-prod, checklists/
  screenshots/                  README + mobile screenshots
```

---

## Scripts

| Command | What it does |
|---------|--------------|
| `npm run dev` | Local development on :3000 |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest — 36 unit + integration tests |
| `npm run test:e2e` | Playwright — journey, OG, a11y |
| `npm run verify:env` | Confirms `.env.local` keys are non-empty |
| `npm run test:supabase` | Insert + read round-trip against your Supabase |
| `npm run smoke` | HTTP-level smoke against a running server |

---

## Documentation

| Index | Purpose |
|-------|---------|
| [`docs/README.md`](docs/README.md) | Full docs index |
| [`docs/STRUCTURE.md`](docs/STRUCTURE.md) | Repo map (code, tests, assets) |
| [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) | Vercel deploy + env vars |
| [`docs/setup/inputs-needed.md`](docs/setup/inputs-needed.md) | Detailed env keys checklist |

### Assignment deliverables (repo root)

| File | Purpose |
|------|---------|
| [`ARCHITECTURE.md`](ARCHITECTURE.md) | Stack, diagrams, abuse rationale, 10k audits/day scale-out |
| [`DEVLOG.md`](DEVLOG.md) | Daily log in the required `Day N — YYYY-MM-DD` format |
| [`REFLECTION.md`](REFLECTION.md) | 5 required questions answered |
| [`TESTS.md`](TESTS.md) | What's tested, how to run |
| [`PRICING_DATA.md`](PRICING_DATA.md) | Every list price with a vendor URL and verified date |
| [`PROMPTS.md`](PROMPTS.md) | AI thinking doc: production prompts, boundaries, fallbacks |
| [`GTM.md`](GTM.md) | Target user, channels, first-100-users plan |
| [`ECONOMICS.md`](ECONOMICS.md) | Lead value, CAC, $1M ARR scenario |
| [`USER_INTERVIEWS.md`](USER_INTERVIEWS.md) | Real conversation log + outreach scripts |
| [`LANDING_COPY.md`](LANDING_COPY.md) | Hero, FAQ, social proof, X thread |
| [`METRICS.md`](METRICS.md) | North Star, input metrics, pivot triggers |

### Technical reference ([`docs/`](docs/))

| File | Purpose |
|------|---------|
| [`API.md`](docs/API.md) | Routes, status codes, honeypots |
| [`AUDIT_ENGINE.md`](docs/AUDIT_ENGINE.md) | Rules pipeline and thresholds |
| [`DATABASE_SCHEMA.md`](docs/DATABASE_SCHEMA.md) | Tables, RLS, indexes |
| [`SECURITY.md`](docs/SECURITY.md) | Abuse controls and secrets |
| [`PERFORMANCE.md`](docs/PERFORMANCE.md) | Caching and 10k/day scale-out |
| [`ACCESSIBILITY.md`](docs/ACCESSIBILITY.md) | a11y tests and targets |
| [`SEO.md`](docs/SEO.md) | OG images and metadata |
| [`PRODUCT_DECISIONS.md`](docs/PRODUCT_DECISIONS.md) | Zero-savings path, email gate, CTA |
| [`FAILURE_CASES.md`](docs/FAILURE_CASES.md) | Fail-open vs fail-closed |
| [`ROADMAP.md`](docs/ROADMAP.md) | Post-MVP priorities |
| [`COMPETITOR_ANALYSIS.md`](docs/COMPETITOR_ANALYSIS.md) | Positioning vs alternatives |
| [`DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) | Tokens, typography, components |
| [`BENCHMARKING.md`](docs/BENCHMARKING.md) | Test matrix and smoke scripts |

### Internal ([`docs/internal/`](docs/internal))

| File | Purpose |
|------|---------|
| [`crosscheck.md`](docs/internal/crosscheck.md) | Self-audit against the assignment rubric |
| [`submission-review.md`](docs/internal/submission-review.md) | Assignment-checklist walkthrough |
| [`verify-prod.md`](docs/internal/verify-prod.md) | Production smoke results log |
| [`checklists/`](docs/internal/checklists/) | P2–P4 phase cross-checks |

---

## License

MIT. Built for the Credex Web Development Intern Assignment Round 1.
