# Go-to-Market — SpendSense

## Exact target user

Not "startups". The specific user is a **technical founder or first engineering manager at a 5–25 person, post-seed software company**, who:

- Personally approves the AI tool invoices each month
- Pays for Cursor or GitHub Copilot for ≥3 seats
- Has at least one ChatGPT Team or Claude Team subscription on top of an IDE assistant
- Has had at least one finance conversation where someone asked "what is this $X/mo Cursor charge"

The hiring window is the trigger event — every new engineering hire forces a new $20–$40/mo seat decision, which is the moment the spend question becomes visible.

A secondary user is a **fractional / in-house operator at a Series A** whose CFO asked them to "look into our AI spend" — they don't pick the tools but they're the ones who need a defensible answer.

## What they Google or scroll right before they'd want this

- "is Cursor Pro worth it for a team"
- "GitHub Copilot vs Cursor for startup" / "Copilot Business vs Enterprise pricing"
- "Claude Team minimum seats" (the Anthropic FAQ is the second-highest-intent landing point)
- "AI tool spend per developer benchmark"
- "how much should a 10 person startup spend on AI"
- Reddit threads: `r/startups`, `r/devops`, `r/SaaS`, `r/EntrepreneurRideAlong` posts about "monthly tool stack cost"
- HN threads tagged "Ask HN: what's your AI bill"

## Where they hang out online (specific)

| Community | Where the lead is | What we'd post |
|-----------|--------------------|----------------|
| **r/SaaS** (~210k) | weekly "what's in your stack" threads | Reply with our audit link when someone shares a stack |
| **r/EntrepreneurRideAlong** (~580k) | "monthly recap" posts | Same — reply with a free audit, no signup |
| **r/cursor** + **r/GithubCopilot** + **r/ClaudeAI** | seat-cost complaints | Direct reply linking the audit page |
| **Hacker News** | "Ask HN: how much do you spend on AI tools" threads (~1/month) | Show HN: SpendSense launch post |
| **Indie Hackers** | weekly "stack roundup" forum | One thread per launch + comments on existing |
| **Pragmatic Engineer Slack** | #ai-tools channel | Founder voice, share own audit |
| **Latent Space Discord** | AI-tooling channel | Show-and-tell |
| **Lenny's Newsletter Slack** | #ai channel | Operator audience |
| **MFM Discord** | "Show off your tools" channel | Pre-launch waitlist |
| **X / Twitter** | Lists: "AI founders", "Cursor power users", anyone posting Cursor invoice screenshots | Quote-reply with a personal audit link |

The X strategy is the highest-bandwidth: search `"$/month cursor"` daily and quote-reply with a free audit of *their* stack based on the screenshot they posted. Personalised, low-spam, very high CTR because the founder already published the numbers.

## How to get the first 100 users in 30 days with $0 budget

1. **Days 1–3:** Launch on **Hacker News (Show HN)** with the live URL + a 2-paragraph "why I built this" + an honest screenshot of my own audit ($X/mo savings found). HN front-page is realistic with this angle because the topic ("AI spend") is current and the methodology is transparent. **Expected: 30–80 visits if it ranks, 5–15 audits if it doesn't.**
2. **Days 1–7:** Cold DM the **20 founders** I identified posting Cursor / Copilot invoice screenshots on X this month. Personalised, with their own audit pre-run. **Expected: 4–8 audits, 2–4 conversions to email.**
3. **Days 3–10:** Post in the **5 Slacks / Discords** above, one post per community per week. Lead with the audit result of my own stack, not the URL. **Expected: 15–25 visits, 8–15 audits.**
4. **Days 7–21:** Reply to **r/SaaS, r/EntrepreneurRideAlong, r/cursor, r/GithubCopilot** stack-recap threads with a free audit. Rule: only reply when someone has shared at least their tools, never cold-promote. **Expected: 25–50 audits across 4 weeks.**
5. **Days 10–25:** Write **2 blog posts** with concrete benchmark numbers — "What 50 SaaS startups spend on Cursor", "Claude Team vs Pro: the seat math". Cross-post to Hashnode, dev.to, Indie Hackers. Each links the audit. **Expected: 200–500 unsourced visits, 15–30 audits.**
6. **Days 14–30:** First **email re-engagement** to the leads captured in week 1 — "your stack 2 weeks later, here's what changed". Drives shares. **Expected: 5–10 referred audits.**

Bottom-of-funnel target: **100 completed audits in 30 days**. With a 45% post-value email capture rate that's ~45 leads, ~5–10 of them high-savings ($500+/mo), which is the cohort Credex sales actually cares about.

## The unfair distribution channel

**Credex's existing customer list.** Credex sells discounted AI infrastructure credits and already has a list of companies who've signed up for credit programs. Two unfair moves:

1. **Email every existing Credex customer** a free SpendSense audit + their renewal-window credit quote. This turns a transactional pricing question into a recurring annual review, and the audit gives Credex's AM a defensible talking point ("you're paying list on these tools — here's the credit savings").
2. **Embed SpendSense on the Credex.rocks landing page** as the "see if you're overpaying" entry point. Credex already ranks for "AI infrastructure credits" intent traffic — SpendSense converts that traffic into a measured, qualified lead, instead of a generic contact form.

Neither is possible for an outsider building a competing tool. Both are zero-budget.

## What week-1 traction looks like if this works

- **300+ unique visits** (mostly from HN + X)
- **75+ completed audits** (35% completion rate is reasonable for an unauthenticated form)
- **30+ email captures** post-value
- **3–5 high-savings (>$500/mo) audits** — the Credex sales-relevant cohort
- **15+ share-link copies** (signals viral propensity)
- **1+ inbound DM** from someone who saw a friend's audit screenshot (the only true validation)

If week-1 lands under **50 audits**, the GTM is wrong, not the product — pivot toward longer-form content + paid X promotion in week 2. If it lands under **10**, the product framing is wrong — interview week-1 visitors who *didn't* finish the audit and look for the friction.

## Positioning vs Credex

- **SpendSense** = free, public, top-of-funnel diagnostic (Mint-for-AI-spend)
- **Credex** = paid back-end ("we capture the savings you found")

SpendSense is intentionally usable without ever mentioning Credex on the audit results page unless `isHighSavings === true`. That preserves the honest tool feel for the 88% of audits that aren't sales-ready, and concentrates the Credex pitch on the 12% who actually have real money on the table.
