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
| `npm test` | Vitest (audit engine + pricing) |
| `npm run lint` | ESLint |
| `npm run verify:env` | Check `.env.local` keys are set |
| `npm run test:supabase` | Test DB insert/read |
| `npm run smoke` | E2E smoke test (server must be running) |

## Docs

| File | Purpose |
|------|---------|
| [`docs/task2.json`](docs/task2.json) | Day 1 checklist + MVP cross-check |
| [`docs/task3.json`](docs/task3.json) | Day 2 checklist + cross-check |
| [`PRICING_DATA.md`](PRICING_DATA.md) | Official pricing sources |
| [`PROMPTS.md`](PROMPTS.md) | Anthropic summary prompts |
| [`ARCHITECTURE.md`](ARCHITECTURE.md) | System design |
| [`TESTS.md`](TESTS.md) | How to run tests |
| [`DEVLOG.md`](DEVLOG.md) | Daily log |

## Stack

Next.js 14 · TypeScript · Tailwind · shadcn/ui · Supabase · Anthropic · Resend · Vercel

## Deployed URL

_Add your Vercel URL after deploy_
