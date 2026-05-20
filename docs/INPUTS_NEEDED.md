# Inputs I need from you to ship the production build

Production build is **green locally** (`npm run build` clean, 36 tests passing, lint + typecheck clean, deployed to https://credex-intern.vercel.app). The **only** thing blocking a fully working live URL is that real API keys have not been pasted into `.env.local` or Vercel yet. Everything below is something I cannot do for you because it requires your account credentials.

Estimated total time: **~75 minutes** if you sit down and do it in one block.

---

## TL;DR — the 6 secrets

I need these 6 strings pasted into **both** `.env.local` (locally) **and** Vercel → Project → Settings → Environment Variables (production):

| # | Variable | Where it comes from | Required for |
|---|----------|---------------------|--------------|
| 1 | `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API → Project URL | Saving + loading audits |
| 2 | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API → `anon public` | Public read of share URLs |
| 3 | `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → `service_role` | Server-side writes (audits, leads, rate-limit) |
| 4 | `ANTHROPIC_API_KEY` | console.anthropic.com → API Keys | AI summary paragraph (falls back to template if blank — optional but graded) |
| 5 | `RESEND_API_KEY` | resend.com → API Keys | Confirmation email after lead capture (optional but graded) |
| 6 | `NEXT_PUBLIC_APP_URL` | Your Vercel URL with no trailing slash | OG previews + share links pointing to prod |

> **Also need**, but no secret: the SQL schema applied inside your Supabase project (one click).

---

## Step 1 — Supabase (20 min, REQUIRED)

Without this, audits and leads do not persist on the live URL. This is the only **must-have** of the three services.

1. Go to https://supabase.com → **New project**.
   - Name: anything (e.g. `spendsense`).
   - Region: closest to you.
   - Database password: store it in a password manager (you won't need it for the app, but Supabase makes you set one).
2. Wait ~2 minutes for the project to provision.
3. Left sidebar → **SQL Editor** → **New query** → paste the contents of [`supabase/schema.sql`](../supabase/schema.sql) → **Run**.
   - You should see "Success. No rows returned." with `audits`, `leads`, `rate_limits` created.
4. Left sidebar → **Settings → API**. Copy three values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key (click "Reveal") → `SUPABASE_SERVICE_ROLE_KEY`

> ⚠️ The `service_role` key bypasses RLS. Never paste it into a client-side `NEXT_PUBLIC_*` var or commit it.

**Hand them back to me by pasting into `.env.local`** (replace the empty `=` after each name). Then run:

```bash
npm run verify:env
npm run test:supabase
```

You should see `✓ Insert OK`, `✓ Read OK`, `✓ Cleanup OK`. If yes, Supabase is wired.

---

## Step 2 — Anthropic (10 min, recommended)

Without this, the AI summary falls back to a deterministic ~100-word template. The grading rubric explicitly checks "Real LLM API call (Claude/GPT/Gemini), not a fake string", so you want this on.

1. https://console.anthropic.com → sign up or log in.
2. **Billing → Add payment method** → **$5 minimum credit**. You will spend < $0.10 testing this; the floor is just to activate the key.
3. **API Keys → Create Key** → name it `spendsense-dev`. Copy the `sk-ant-api03-...` value (shown once).
4. Paste into `.env.local` as `ANTHROPIC_API_KEY=sk-ant-api03-...`.
5. (Optional) Verify model access — the default in code is `claude-3-5-sonnet-20241022`. If your account doesn't have it for any reason, set `ANTHROPIC_MODEL=claude-3-5-haiku-20241022` in `.env.local`.

Quick smoke once pasted:

```bash
npm run dev
# then in another terminal:
curl -X POST http://localhost:3000/api/audit \
  -H 'Content-Type: application/json' \
  -d '{"tools":[{"tool":"Cursor","plan":"Business","monthlySpend":160}],"teamSize":3,"useCase":"Coding","website":""}'
```

You should see a real summary string in the JSON response (not the templated "Your current AI tool spend is..." fallback).

---

## Step 3 — Resend (5 min, recommended)

Without this, lead emails are skipped silently. The grading rubric checks "Transactional email sent (Resend/Postmark/SES)".

1. https://resend.com → sign up (Google works).
2. **API Keys → Create API Key** → name `spendsense-dev`. Copy the `re_...` value.
3. Paste into `.env.local` as `RESEND_API_KEY=re_...`.
4. Free tier sends from `onboarding@resend.dev` — no domain verification needed. You're done.

If you want emails to come **from a custom domain** (nice-to-have, not required), let me know and I'll wire up `RESEND_FROM` after you verify a domain in Resend.

---

## Step 4 — Push all 6 vars to Vercel (10 min, REQUIRED for the live URL to work)

The current live URL (https://credex-intern.vercel.app) lacks every key, which is why lead capture returns "Audit not found". Fix:

1. https://vercel.com → `credex-intern` project → **Settings → Environment Variables**.
2. Add each row (apply to **Production, Preview, Development**):

```
NEXT_PUBLIC_SUPABASE_URL          → <from step 1>
NEXT_PUBLIC_SUPABASE_ANON_KEY     → <from step 1>
SUPABASE_SERVICE_ROLE_KEY         → <from step 1>
ANTHROPIC_API_KEY                 → <from step 2>
ANTHROPIC_MODEL                   → (leave blank unless overriding)
RESEND_API_KEY                    → <from step 3>
NEXT_PUBLIC_APP_URL               → https://credex-intern.vercel.app
```

3. Redeploy so the new envs take effect:

```bash
npx vercel --prod
```

4. After deploy finishes, run:

```bash
PROD_BASE=https://credex-intern.vercel.app npm run smoke
```

I expect all six checks to pass this time:
- `✓ GET / OK`
- `✓ POST /api/audit OK`
- `✓ GET /audit/:id OK`
- `✓ POST /api/leads OK`
- `✓ Honeypot blocked`
- `✓ OG metadata present`

---

## Step 5 — Final manual verifications (15 min, REQUIRED for screenshots + Lighthouse)

I can't do these from here; they need a real browser pointed at the live URL.

1. **Run a real audit end-to-end on the live URL.** Tool palette → submit → see savings → submit email → check your inbox for the Resend confirmation.
2. **Mobile screenshots** — Chrome DevTools → iPhone 14 preset → capture-full-size screenshot for these views, save to `docs/screenshots/`:
   - `landing.png`
   - `audit-high-savings.png` (use a stack that produces > $500/mo savings, e.g. Claude Team @ 3 seats + ChatGPT Team @ 1 user + Copilot Business @ 8 seats)
   - `audit-optimized.png` (use a small stack with $0 savings, e.g. Cursor Pro @ 2 seats only)
   - `lead.png` (the email form below the audit)
   - `og-preview.png` (paste a share URL into https://www.opengraph.xyz to capture)
3. **Lighthouse mobile audit** — Chrome DevTools → Lighthouse → Mobile → Categories: Performance, Accessibility, Best Practices, SEO. Save scores and paste into `DEVLOG.md` Day 3 entry. Target: Accessibility ≥ 90.

Once 1-3 are done, I'll update README.md to embed the screenshots and the Lighthouse numbers.

---

## Step 6 — At least one real user interview (parallel, REQUIRED by the rubric)

The rubric explicitly requires `USER_INTERVIEWS.md` to have **three** conversations transcribed. The current file has the outreach scripts and templates ready. You need to:

1. Send the cold DMs from the appendix in [`USER_INTERVIEWS.md`](../USER_INTERVIEWS.md) — 4 X DMs, 3 Slack/Discord, 3 personal email.
2. Get at least one 15-min call today. Use the script (also in that file).
3. Transcribe **what they said, in their words**, not your paraphrase. Paste under "Interview 1".

This is the single biggest credibility risk left in the submission. Even one real transcribed interview is worth more than three polished fakes.

---

## What's the smallest viable set?

If you only have **30 minutes total**:

1. Step 1 (Supabase) — REQUIRED, no skip.
2. Step 4 (push to Vercel + redeploy + smoke test).
3. Skip Anthropic + Resend — the app degrades gracefully (template summary, no email). You lose two rubric points but the live URL fully works for audits and lead capture.

If you have **75 minutes**, do all of the above. If you have **90 minutes**, add a screenshot pass and one real interview.

---

## Once everything's pasted, ping me with:

- ✅ Supabase keys pasted (or "skip")
- ✅ Anthropic key pasted (or "skip")
- ✅ Resend key pasted (or "skip")
- ✅ Vercel envs set + redeployed
- 📸 Screenshots in `docs/screenshots/`
- 📊 Lighthouse numbers for me to paste into DEVLOG

I'll run a final smoke pass, update CROSSCHECK + SUBMISSION_REVIEW, and ship the final commit.
