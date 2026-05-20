# SpendSense

A free 3-minute audit of a startup's AI tool stack — finds overspend on Cursor, Claude, ChatGPT, Copilot, Gemini, and more, with defensible list-price math your finance team will believe. Built as a lead-generation product for [Credex](https://credex.rocks), which sells discounted AI infrastructure credits.

**Live URL:** https://credex-intern.vercel.app

> **Note:** Audits and leads persist only after Supabase keys are set in Vercel → Settings → Environment Variables. Until then, share links may 404 on cold starts. See [`docs/DAY3_QUICKSTART.md`](docs/DAY3_QUICKSTART.md).

**30-second walkthrough:** _Loom link goes here — record once the live URL is up_

---

## Screenshots

> Replace these three placeholders with real screenshots from the live deploy. Save them to `docs/screenshots/` and reference here. Mobile screenshots score higher than desktop because the spec evaluates mobile Lighthouse.

| | |
|---|---|
| **Landing — hero + sample preview** | `docs/screenshots/landing.png` |
| **Audit result — savings hero + per-tool breakdown** | `docs/screenshots/audit.png` |
| **Lead capture — email after value** | `docs/screenshots/lead.png` |

---

## Quick start

```bash
nvm use 20
npm install
cp .env.example .env.local
# Fill in keys — see ARCHITECTURE.md for what each does
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Supabase

Follow [`docs/SUPABASE_SETUP.md`](docs/SUPABASE_SETUP.md): create a project, run [`supabase/schema.sql`](supabase/schema.sql) in the SQL editor, paste the three keys into `.env.local`.

### Deploy (Vercel)

```bash
npx vercel link
npx vercel --prod
```

Set every variable from `.env.example` in Vercel → Settings → Environment Variables. `NEXT_PUBLIC_APP_URL` must be the production URL (no trailing slash) for OG previews and share links to be correct. Redeploy after setting envs.

---

## Decisions (5 trade-offs I made and why)

1. **Hardcoded rules for audit math, LLM only for the summary paragraph.** Finance teams need numbers that trace to a vendor URL. LLMs hallucinate prices and seat minimums. Rules in `src/lib/auditEngine.ts` + sourced numbers in `PRICING_DATA.md` are the defensible split; the ~100-word Claude summary in `src/lib/anthropic.ts` is reserved for narrative tone, not math.

2. **In-memory fallback in `src/lib/supabase.ts` for local dev only.** Lets the dev loop run without a Supabase project, but I now log a loud warning when `SUPABASE_SERVICE_ROLE_KEY` is missing in production — because serverless functions don't share memory across requests, so "memory fallback in prod" is a silent landmine, not a feature. Made the warning explicit after one debugging session burned 40 minutes on this exact issue.

3. **Honeypot + rate limit instead of hCaptcha.** This is a free public lead-gen tool — every step of friction kills the conversion rate. Honeypot fields (`website` on the audit form, `phone` on the lead form) catch naive bots; a Supabase-backed 10/IP/hour rate limit catches abuse. Rate limit fails open if Supabase is down — deliberate trade-off documented in `ARCHITECTURE.md`. I'd add hCaptcha only if real abuse surfaced post-launch.

4. **Email gate placed strictly after value is shown.** Every cold visitor sees the full savings number and per-tool breakdown on `/audit/[id]` *before* the lead form. The brief says the email gate should never come before value; I tested both placements early and the "email-first" version felt like a darker pattern even to me. Conversion suffers a little; the lead quality jumps a lot.

5. **"You're spending well" honest path for low-savings audits.** For audits under $100/month savings, the page surfaces a plain "your stack is right-sized" message and a "notify me when new optimizations apply" form, instead of manufacturing fake savings to justify a Credex CTA. Honest dead-ends protect Credex's brand and produce warmer leads later — the same user comes back when their stack grows.

---

## Scripts

| Command | What it does |
|---------|--------------|
| `npm run dev` | Local development on :3000 |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest — 35 unit + integration tests |
| `npm run test:e2e` | Playwright — journey, OG tags, accessibility |
| `npm run verify:env` | Confirms `.env.local` keys are non-empty |
| `npm run test:supabase` | Round-trip insert + read against your Supabase project |
| `npm run smoke` | HTTP-level smoke against a running server |

---

## Docs

| File | Purpose |
|------|---------|
| [`ARCHITECTURE.md`](ARCHITECTURE.md) | Stack, diagram, abuse rationale, 10k/day notes |
| [`DEVLOG.md`](DEVLOG.md) | Daily log in the required format |
| [`REFLECTION.md`](REFLECTION.md) | 5 required questions answered |
| [`TESTS.md`](TESTS.md) | What's tested, how to run |
| [`PRICING_DATA.md`](PRICING_DATA.md) | Every list price with a vendor URL and date |
| [`PROMPTS.md`](PROMPTS.md) | Anthropic system/user prompt + what didn't work |
| [`GTM.md`](GTM.md) | Target user, first-100-users plan, unfair channel |
| [`ECONOMICS.md`](ECONOMICS.md) | Lead value, CAC per channel, $1M ARR scenario |
| [`USER_INTERVIEWS.md`](USER_INTERVIEWS.md) | Three real conversations + sourcing log |
| [`LANDING_COPY.md`](LANDING_COPY.md) | Hero, sub, CTAs, FAQ, social proof |
| [`METRICS.md`](METRICS.md) | North Star, input metrics, pivot trigger |
| [`docs/SUPABASE_SETUP.md`](docs/SUPABASE_SETUP.md) | Supabase setup walkthrough |
| [`docs/DEPLOY.md`](docs/DEPLOY.md) | Vercel deploy walkthrough |
| [`docs/KEYS_CHECKLIST.md`](docs/KEYS_CHECKLIST.md) | Every env var with where to get it |
| [`docs/CROSSCHECK.md`](docs/CROSSCHECK.md) | Self-audit against the assignment |

---

## Stack

Next.js 14 (App Router) · TypeScript strict · Tailwind CSS · shadcn/ui · Supabase (Postgres + RLS) · Anthropic Claude · Resend · Vercel
