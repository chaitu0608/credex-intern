# Day 3 — Task Tracker (2026-05-21)

End-to-end checklist for submission readiness. Check items as you complete them.

**Verify git days:** `git log --pretty=format:"%ad" --date=short | sort -u | wc -l` → must be **≥ 5** by submission.

---

## Phase 0 — Pre-flight

- [x] `npm run lint` — 0 warnings
- [x] `npm run typecheck` — 0 errors
- [x] `npm test` — 36/36 passing
- [x] `npm run build` — passes

---

## Phase 1 — Live deployment (BLOCKING)

### 1.1 Supabase (you)

- [ ] Create project at supabase.com
- [ ] Run [`supabase/schema.sql`](../../supabase/schema.sql) in SQL Editor
- [ ] Copy URL, anon key, service role key

### 1.2 OpenAI (you)

- [ ] Create API key at platform.openai.com
- [ ] Paste `OPENAI_API_KEY` (optional: `OPENAI_MODEL`, default `gpt-4o-mini`)

### 1.3 Resend (you)

- [ ] Create API key at resend.com (free tier OK; uses `onboarding@resend.dev` sender)

### 1.4 Environment variables (you)

- [ ] Paste all keys into `.env.local`
- [ ] `npm run verify:env` — all required vars green
- [ ] `npm run test:supabase` — insert + read round-trip
- [ ] Add same 6 vars in Vercel → Settings → Environment Variables (Production)

### 1.5 Deploy (you)

```bash
npx vercel --prod
```

- [x] Deployed — https://credex-intern.vercel.app
- [ ] Capture production URL
- [ ] Set `NEXT_PUBLIC_APP_URL=https://<your-url>` in Vercel
- [ ] Redeploy: `npx vercel --prod`

### 1.6 End-to-end verification (you)

- [ ] Run audit on live URL (mobile)
- [ ] Open share URL in incognito — audit loads
- [ ] Submit lead form — email arrives
- [ ] Check OG preview at opengraph.xyz
- [ ] Honeypot returns `fake-*` id (optional)

### 1.7 README live URL (you)

- [x] Live URL in [`README.md`](../../README.md) — https://credex-intern.vercel.app

---

## Phase 2 — Code & spec gaps

- [x] **2.1** `ARCHITECTURE.md` — 10k audits/day scale-out section
- [x] **2.2** Credex mark — `public/credex-mark.svg` + `CredexMark` component
- [x] **2.3** A11y prep — darker muted-foreground in dark mode; badge uses foreground text
- [x] **2.4** Honest card only when savings === $0
- [x] **2.5** Loading state minimum 600ms dwell
- [x] **2.6** Mobile: hide drag hint on touch-only viewports
- [ ] **2.3b** Lighthouse mobile on **prod** — A11y ≥ 90 (you run after deploy)

---

## Phase 3 — User interviews (you)

- [ ] Send 10 cold DMs (templates in [`USER_INTERVIEWS.md`](../../USER_INTERVIEWS.md))
- [ ] Complete ≥ 1 interview today; transcribe quotes into `USER_INTERVIEWS.md`
- [ ] Commit interview update same day as the call

---

## Phase 4 — Screenshots & Lighthouse (you, after deploy)

- [ ] `mkdir -p docs/screenshots`
- [ ] Capture: `landing.png`, `audit-high-savings.png`, `audit-optimized.png`
- [ ] Update README screenshot section with real images
- [ ] Lighthouse mobile on live URL — paste scores into DEVLOG Day 3

---

## Phase 5 — Git & CI

- [ ] Conventional commits today (see suggested messages below)
- [ ] `git push origin main`
- [ ] GitHub Actions CI green

Suggested commits:

```text
docs(architecture): scale-out plan for 10k audits/day
feat(brand): Credex gradient mark SVG
fix(a11y): improve dark-mode contrast on muted text
fix(results): honest card only at zero savings; modest savings copy
fix(ui): min loader dwell + touch-only palette hint
docs(task3): day 3 tracker and deploy checklist
```

---

## Phase 6 — DEVLOG & final review

- [ ] Fill DEVLOG Day 3 with real hours, learnings, blockers, plan for 5/22
- [ ] Walk [`crosscheck.md`](crosscheck.md) — all boxes checked

---

## Phase 7 — Optional bonus

- [ ] Publish Twitter thread from [`LANDING_COPY.md`](../../LANDING_COPY.md) with live URL

---

## Definition of done (Day 3)

Submission moves from **borderline** → **ready** when ALL are true:

1. Live URL in README
2. E2E flow works on prod (audit → share → email)
3. Lighthouse prod: Perf ≥ 85, A11y ≥ 90, BP ≥ 90
4. ≥ 1 real interview transcribed
5. 3+ screenshots in README
6. ARCHITECTURE has 10k/day section
7. CI green
8. 3 distinct git commit days (5/19, 5/20, **5/21**)
9. DEVLOG Day 3 filled
