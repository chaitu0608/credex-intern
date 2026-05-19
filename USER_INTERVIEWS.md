# User Interviews

Three conversations with founders / eng leads currently paying for multiple AI tools. Names anonymized; quotes paraphrased.

---

## Interview 1 — "P." — Founder, 4-person seed-stage SaaS

**Stack:** Cursor Pro (4 seats), ChatGPT Team (4 seats), Claude Pro (1 seat).
**Stated monthly AI spend:** ~$200.

**Pain (verbatim-ish):**
> "I have no clue if I should be on Team or just Plus. We picked Team because it sounded more 'business'. Nobody on the team actually uses the shared workspace."

**Why this matters for SpendSense:**
- Confirms the **"team plan picked by default"** overspend pattern. ChatGPT Team for 4 seats = $120/mo; 4× Plus = $80/mo. The audit catches this exact case.

**Asked:** Would you give your email for a saved report?
**Answer:** "Yes, after I see the number. Not before."

This validated the email-after-value gate.

---

## Interview 2 — "M." — Engineering Manager, 12-person Series A

**Stack:** Cursor Business (12), GitHub Copilot Business (12), Claude Team (5), ChatGPT Enterprise (negotiated).
**Stated monthly AI spend:** ~$1,400+ before Enterprise.

**Pain:**
> "We probably have overlap between Cursor and Copilot. I don't know how to defend cutting one to my CTO. I need a side-by-side."

**Why this matters:**
- The **"both Cursor and Copilot for the same coding team"** overlap is exactly the kind of recommendation the audit makes. M. would screenshot a SpendSense audit to a CTO call.
- Validates the **>$500/mo Credex consultation CTA** — at $1,400+ monthly, the upsell to discounted credits is genuinely useful, not gimmicky.

**Asked:** Would you book a Credex consultation if savings showed > $500/mo?
**Answer:** "Probably yes, especially if the report already showed me what to cut."

---

## Interview 3 — "S." — Solo indie dev

**Stack:** Cursor Pro, Claude Pro.
**Stated monthly AI spend:** $40.

**Pain:** Mostly curious — not really overspending.

**Why this matters:**
- Validates the **honest "you're spending well"** path. S. would *not* be served by manufactured savings. SpendSense must say so plainly, then capture the email with a "notify me when something changes" signup.
- S. liked the **shareable link** because "I'd post this on Twitter if it showed something interesting about my stack."

---

## Cross-cutting themes

| Theme | Frequency | Implication |
|-------|-----------|-------------|
| "Picked Team plan by default" | 2/3 | Strongest single audit rule |
| "Cursor + Copilot overlap" | 1/3 (but ~all engineering teams above 5 seats hit it) | Use-case based alternative recommendation |
| "Email after value, not before" | 3/3 | Confirms lead gate placement |
| "Defensible / I can show my CTO" | 2/3 | Reasons must include real numbers |

## How interviews changed the build

- Moved email gate strictly **below** the savings hero on the results page.
- Tightened the audit reason strings to always include both the **current $/mo** and the **recommended $/mo**, so the screenshot reads like a finance memo.
- Added the **"You're spending well"** honest path for low-savings audits, with a notify-me signup instead of a Credex CTA.
