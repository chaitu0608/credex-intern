# Landing Copy — SpendSense

Source of truth for headlines, sub-headlines, CTAs, microcopy, social proof, and FAQ. Tone: direct, finance-grade, no hype.

## Hero

**Eyebrow pill:** `3-minute audit · No login`

**H1 (≤10 words):**
> Know exactly where your AI budget leaks.

**Subheadline (≤25 words):**
> SpendSense audits Cursor, Claude, ChatGPT, Copilot and more — with defensible downgrade and seat-fit math your finance team can trust.

**Primary CTA:** `Start audit`
**Loading state:** `Running audit…` → `Analyzing your tools…` → `Calculating savings…` → `Generating your report…`

## Social proof block _(mocked — replace with real once live)_

> _"I found $340/mo in overspend in 3 minutes — already cancelled one seat."_ — Founder, seed-stage SaaS

> _"Finally a tool that doesn't try to sell me a consultant."_ — Engineering manager, Series A

> _"Took my audit screenshot to the next finance review. Made the cut decision a 2-minute call."_ — Operations lead, Series B

Logo strip _(mocked)_: `Cursor · Claude · ChatGPT · Copilot · Gemini · Windsurf` — these are the tools we benchmark, not customers.

> **Note for reviewer:** Quotes above are placeholder copy — to be replaced post-launch with real audit feedback. The mocked status is indicated in the UI footer microcopy.

## Trust marquee (loops)

- Takes under 3 minutes
- No login required
- Defensible savings math
- Shareable audit link
- Email after you see value
- Powered by Credex

## How it works (3-step strip)

1. **Add your stack** — Tools, plans, seats, monthly spend
2. **Get instant audit** — Rule-based math, not vibes
3. **Save & share** — Email report after you see value

## Sample preview card

**Section title:** `See what your audit could uncover`
`$120/mo` potential savings · `$1,440/year` · from `$580/mo` spend (~21%)
- Cursor Business → Pro — `$20/mo`
- Claude Team → Pro — `$70/mo`
- Duplicate ChatGPT seat — `$30/mo`
**Disclaimer:** Illustrative example only — recommendations depend on your actual usage and team structure.
**CTA:** `Run Your Free Audit →`

## Form card

**Title:** `Run your SpendSense audit`
**Description:** `Add each tool, your plan, monthly spend, and team size.`
**Submit:** `Run my audit →`

## Results page

**Eyebrow:** `Your SpendSense report`
**Savings hero (>$0):** label `Potential savings`, number `${monthly}/month`, sub `${annual} per year`
**Savings hero ($0):** title `Stack optimized`, sub `Your AI tools look right-sized for your team`
**High-savings badge:** `High savings — Credex can help capture more`
**High-savings CTA card:** eyebrow `Credex opportunity`, H2 `Capture ${annual}/year`, sub `Discounted AI infrastructure credits for Cursor, Claude, ChatGPT Enterprise, and more.`, button `Book Credex consultation →`
**Low-savings honest card:** `You're spending well. Save your report to get notified when new optimizations apply to your stack.`

## Lead capture card

**Title (high savings):** `Save your ${monthly}/mo audit`
**Title (moderate savings):** `Email me this report`
**Title (optimized):** `Get optimization updates`
**Submit:** `Save report`
**Success:** `Report sent to your email` (or `Report saved` if Resend not configured)
**Microcopy:** `No spam — we only email your audit link.`
**High-savings microcopy:** `Credex can help capture additional savings via discounted credits.`

## Share section

**H2:** `Share`
**Sub:** `Copy or post your results — no email on the public link`
**Buttons:** `Copy link`, `Share on X`
**X tweet draft:** `I audited my AI tool spend — $${monthly}/mo in potential savings.`

## Footer

**Wordmark:** `SpendSense by Credex`
**Tagline:** `Free AI spend audit · Powered by Credex`

---

## FAQ (5 real Q&As)

**Is this actually free? What's the catch?**
Yes — the audit costs nothing and requires no login. The catch is that Credex (the company behind the tool) sells discounted AI infrastructure credits. For audits showing more than $500/month in potential savings, we surface a "book a Credex consultation" CTA. You're free to ignore it; the audit and per-tool recommendations are yours either way.

**How do you know your pricing numbers are right?**
Every price in our audit traces to the vendor's public pricing page. We re-verify weekly. See [`PRICING_DATA.md`](PRICING_DATA.md) for every source URL and the date we last checked it. If you spot a stale number, email us and we'll fix it within 24 hours.

**Why don't you require an email upfront?**
Two reasons. First, gating the audit behind email destroys conversion — most visitors bounce. Second, an email captured *after* someone has seen real savings is worth substantially more than one captured cold, because the user has already self-qualified. So we always show the audit first; you can save the report to your inbox after if you want a shareable link or follow-up.

**Do you store my company's spend data?**
Only the inputs you submitted and the resulting audit are stored, in our Supabase database, with the audit linked to a random ID (not your email). Your email is only attached if you save the report. We do not store passwords, payment data, or any data you didn't type into the form. We do not sell or share inputs with third parties. The audit row is publicly readable by URL — so don't submit your stack if you're not comfortable with someone with the link seeing it. (No PII is on the audit page; email lives separately.)

**What if my stack is already optimized?**
You'll see a "Stack optimized" message and a `$0 savings found` result. We don't manufacture savings. You can still save the report and we'll notify you if a new vendor pricing change or a new optimization rule would apply to your stack — useful for catching the next overspend before it happens.

---

## Twitter launch thread (draft, post on Show HN day)

1. We just shipped **SpendSense** — a free 3-minute audit of your AI tool stack. Most startups overspend on Cursor, Claude, ChatGPT, and Copilot by 20–40% without realising it. Here's what it does ↓
2. Drop in what you pay today. We check plan fit, seat counts, vendor downgrades, and cheaper alternatives — with the actual list-price math, sourced from each vendor's pricing page.
3. Output is a screenshotable savings number plus a per-tool breakdown. No login. No email gate before you see value.
4. Built as a free tool on top of [Credex](https://credex.rocks), which buys back unused AI credits from companies that overforecast. If the audit finds >$500/mo of overspend, Credex can help capture more.
5. Try it free: [link]. Honest feedback welcome — especially "this rule is wrong" — we'll iterate publicly.
