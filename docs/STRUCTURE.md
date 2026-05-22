# Repository structure

```
credex-intern/
├── README.md
├── ARCHITECTURE.md
├── DEVLOG.md
├── REFLECTION.md
├── TESTS.md
├── PRICING_DATA.md
├── PROMPTS.md
├── GTM.md
├── ECONOMICS.md
├── USER_INTERVIEWS.md
├── LANDING_COPY.md
├── METRICS.md
│
├── docs/
│   ├── README.md              # this index
│   ├── STRUCTURE.md           # this file
│   ├── API.md
│   ├── AUDIT_ENGINE.md
│   ├── DATABASE_SCHEMA.md
│   ├── SECURITY.md
│   ├── DEPLOYMENT.md
│   ├── PERFORMANCE.md
│   ├── ACCESSIBILITY.md
│   ├── SEO.md
│   ├── PRODUCT_DECISIONS.md
│   ├── FAILURE_CASES.md
│   ├── ROADMAP.md
│   ├── COMPETITOR_ANALYSIS.md
│   ├── DESIGN_SYSTEM.md
│   ├── BENCHMARKING.md
│   ├── setup/                 # env + supabase quickstart
│   ├── internal/              # dev-loop tracking
│   └── screenshots/
│
├── src/
│   ├── app/                   # Next.js App Router
│   ├── components/
│   └── lib/                   # engine, pricing, supabase, AI
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── scripts/
├── supabase/schema.sql
└── public/
```

## Where to find things

| Looking for | Path |
|-------------|------|
| Landing page | `src/app/page.tsx` |
| Audit results | `src/app/audit/[id]/page.tsx` |
| Rule engine | `src/lib/auditEngine.ts` |
| List prices | `src/lib/pricing.ts` + `PRICING_DATA.md` |
| Supabase helpers | `src/lib/supabase.ts` |
| Spend form | `src/components/spend-form/spend-form.tsx` |
