# AI Summary Prompts (SpendSense)

SpendSense uses **hardcoded rules** for audit math (`src/lib/auditEngine.ts`). The **only** LLM feature is the ~100-word personalized summary on the results page.

Implementation: `src/lib/anthropic.ts`

---

## Model

- **Model:** `claude-sonnet-4-20250514`
- **max_tokens:** 200

---

## System prompt

```
You are a concise financial analyst. Direct, specific. No fluff. No sales pitch. Under 120 words. Plain paragraph, no bullets.
```

---

## User prompt (template)

Built by `generateAuditSummaryPrompt()` in `src/lib/auditEngine.ts`:

```
Write a ~100-word paragraph for a startup {useCase} team of {teamSize}.
Total potential savings: ${totalMonthlySavings}/month (${totalAnnualSavings}/year).
Top recommendations: {top 2 recs with $/mo each, or "stack appears well-optimized"}.
Tone: direct, CFO-style, no bullets, no hype.
[Mention Credex discounted infrastructure credits only if isHighSavings (> $500/mo)]
```

Example filled prompt:

```
Write a ~100-word paragraph for a startup coding team of 5.
Total potential savings: $120/month ($1440/year).
Top recommendations: Cursor: Downgrade to Cursor Pro ($20/mo); Claude: Switch to Claude Pro for 2 seat(s) ($70/mo).
Tone: direct, CFO-style, no bullets, no hype.
```

---

## Failure behavior

| Condition | Behavior |
|-----------|----------|
| `ANTHROPIC_API_KEY` missing | Template fallback (`buildFallbackSummary`) |
| API error / empty response | Same template fallback |
| User never sees an error | Always a readable paragraph |

### Fallback template logic

- **Savings < $100/mo:** Honest “stack looks largely right-sized” + notify-me framing
- **Savings ≥ $100/mo:** Total spend, top recommendation with $, annual savings
- **isHighSavings:** Append Credex consultation sentence

---

## Why not LLM for audit math?

Finance teams need **traceable numbers** tied to list prices. LLMs hallucinate prices and seat minimums. Rules + `PRICING_DATA.md` citations are the correct split for this assignment.
