# Repository structure

Assignment deliverables live in [`deliverables/`](deliverables/) with **symlinks at the repo root** for grading (e.g. `ARCHITECTURE.md` → `docs/deliverables/ARCHITECTURE.md`). [`README.md`](../README.md) is the only full narrative doc kept as a real file at root.

```
credex-intern/
├── README.md                  # main entry (real file)
├── ARCHITECTURE.md, …         # symlinks → docs/deliverables/
├── package.json, tsconfig.json, vitest.config.ts, playwright.config.ts
├── .github/workflows/ci.yml
│
├── docs/
│   ├── README.md              # docs index
│   ├── STRUCTURE.md           # this file
│   ├── deliverables/          # rubric .md files (canonical)
│   ├── setup/                 # deploy + env checklists
│   ├── screenshots/           # README capture assets
│   └── internal/              # dev tracking
│       ├── crosscheck.md
│       ├── submission-review.md
│       ├── verify-prod.md
│       ├── task3.md
│       └── checklists/        # P2–P4 phase cross-checks
│
├── public/
│   └── assets/
│       ├── credex-logo.png
│       └── logos/             # tool brand SVGs
│
├── scripts/                   # verify-env, smoke, sync-tool-logos, test-supabase
├── supabase/schema.sql
│
├── src/
│   ├── app/                   # Next.js App Router (routes, API, OG images)
│   ├── components/
│   │   ├── audit/             # results UI (hero, recommendations, lead, share)
│   │   ├── spend-form/        # landing audit form + stack cards
│   │   ├── layout/            # header, footer, page shell
│   │   ├── providers/
│   │   └── ui/                # shadcn primitives + brand
│   ├── lib/                   # engine, pricing, API helpers, AI summary
│   └── types/
│
└── tests/
    ├── unit/                  # engine, pricing, validation, …
    ├── integration/           # API route handlers
    └── e2e/                   # Playwright
```

## Where to find things

| Looking for | Path |
|-------------|------|
| Landing page | `src/app/page.tsx` |
| Audit results | `src/app/audit/[id]/page.tsx` |
| Rule engine | `src/lib/auditEngine.ts` |
| List prices | `src/lib/pricing.ts` + `docs/deliverables/PRICING_DATA.md` |
| Supabase helpers | `src/lib/supabase.ts` |
| Spend form | `src/components/spend-form/spend-form.tsx` |
| Coverage panel (hero aside) | `src/components/audit/audit-coverage-panel.tsx` |
