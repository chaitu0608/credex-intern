# SpendSense

Free AI tool spend audit — find overspend on Cursor, Claude, ChatGPT, Copilot, and more. Powered by [Credex](https://credex.rocks).

## Quick start

```bash
npm install
cp .env.example .env.local
# Fill keys in .env.local (see ARCHITECTURE.md)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Supabase

Follow [`docs/SUPABASE_SETUP.md`](docs/SUPABASE_SETUP.md) — run [`supabase/schema.sql`](supabase/schema.sql) and add all three API keys to `.env.local`.

### Deploy (Vercel)

```bash
npm run build
npx vercel --prod
```

Set all variables from `.env.example` in Vercel → Settings → Environment Variables. Set `NEXT_PUBLIC_APP_URL` to your production URL and redeploy.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Local development |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest — 35 unit + integration tests |
| `npm run test:e2e` | Playwright — journey, OG, a11y |
| `npm run verify:env` | Check `.env.local` keys are set |
| `npm run test:supabase` | Test Supabase insert/read |
| `npm run smoke` | E2E smoke against a running server |

## Docs

| File | Purpose |
|------|---------|
| [`ARCHITECTURE.md`](ARCHITECTURE.md) | Stack + diagram + abuse protection |
| [`PRICING_DATA.md`](PRICING_DATA.md) | Official pricing sources + dates |
| [`PROMPTS.md`](PROMPTS.md) | Anthropic summary prompts + fallback |
| [`TESTS.md`](TESTS.md) | How to run tests + coverage map |
| [`DEVLOG.md`](DEVLOG.md) | 7 dated daily entries |
| [`REFLECTION.md`](REFLECTION.md) | What worked / change / hardest decision |
| [`GTM.md`](GTM.md) | Go-to-market strategy |
| [`ECONOMICS.md`](ECONOMICS.md) | Unit economics + funnel math |
| [`USER_INTERVIEWS.md`](USER_INTERVIEWS.md) | 3 conversations + themes |
| [`LANDING_COPY.md`](LANDING_COPY.md) | Copy source of truth |
| [`METRICS.md`](METRICS.md) | North-star + dashboards |
| [`docs/CROSSCHECK.md`](docs/CROSSCHECK.md) | Verification against `test.json` |
| [`docs/SUPABASE_SETUP.md`](docs/SUPABASE_SETUP.md) | Supabase setup |
| [`docs/KEYS_CHECKLIST.md`](docs/KEYS_CHECKLIST.md) | Env vars to paste |
| [`docs/DEPLOY.md`](docs/DEPLOY.md) | Vercel deploy steps |

## Stack

Next.js 14 · TypeScript · Tailwind · shadcn/ui · Supabase · Anthropic · Resend · Vercel

## Deployed URL

_Add your Vercel URL after deploy_
