# AI Summary Prompts (SpendSense)

SpendSense uses **hardcoded rules** for audit math (`src/lib/auditEngine.ts`). The **only** LLM feature is the ~100-word personalized summary on the results page.

Implementation: `src/lib/ai-summary.ts` (OpenAI Chat Completions API)

---

## Model

- **Provider:** OpenAI
- **Model:** `gpt-4o-mini` (overridable via `OPENAI_MODEL` env var)
- **max_tokens:** 200
- **temperature:** default (API default; we don't override)

---

## System prompt

```
You are a concise financial analyst. Direct, specific. No fluff. No sales pitch. Under 120 words. Plain paragraph, no bullets.
```

## User prompt template

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
| `OPENAI_API_KEY` missing | Template fallback (`buildFallbackSummary`) |
| API error / non-200 / rate-limited | Same template fallback |
| Response is empty / non-text | Same template fallback |
| User-facing error | None — the page always renders a readable paragraph |

### Fallback template logic

- **Savings < $100/mo:** Honest "stack looks largely right-sized" + notify-me framing.
- **Savings ≥ $100/mo:** Total spend, top recommendation with $, annual savings.
- **isHighSavings:** Append a single Credex consultation sentence.

The fallback is good enough that the LLM is really only adding tone polish, not new information — which is the right architecture for a feature where reliability matters more than novelty.

---

## What I tried that didn't work

**Letting the LLM do the audit math itself.**
First draft fed the raw stack (tools / plans / seats / spend / use case) to the model and asked it to *both* identify overspend *and* write the summary. It hallucinated:
- ChatGPT Team's seat minimum (said "3 seats" when it's actually 2)
- A non-existent Cursor "Startup" plan
- Specific dollar savings for Anthropic API "by switching to OpenAI"

Killed it. The math is now pure TypeScript with sourced list prices; the LLM only writes the human paragraph.

**Asking for bullets / structured output.**
Tried `respond as JSON with {headline, body, cta}`. The JSON came back valid but the body sounded mechanical and lost the CFO voice that made the result page screenshot-worthy. Reverted to "plain paragraph, no bullets" — the prose is the asset.

**Few-shot examples in the system prompt.**
Tried adding 2 example input/output pairs for "high savings" and "already optimal". Cost went up ~40% per call (longer system prompt) and outputs got stilted — the model started copying the example sentences too literally. Removed; the single-line system prompt + structured user prompt produces better variety.

**Higher `max_tokens`.**
Tried 400. The summary started padding with restatements ("In summary, ...") instead of new content. Capped at 200; outputs are tight ~100-word paragraphs reliably.

**Streaming the response.**
Tried streaming so the summary would appear word-by-word on the results page. It worked but the visual effect made the report feel slower, not faster (users waited for the *whole* paragraph before sharing). Reverted to single-shot — the page renders the static summary on the server side and the audit is screenshot-ready immediately.

---

## Why not LLM for audit math?

Finance teams need **traceable numbers** tied to list prices. LLMs hallucinate prices and seat minimums. Rules + `PRICING_DATA.md` citations are the correct split for this assignment.

A reviewer with the Cursor / Anthropic / OpenAI / GitHub pricing pages open in tabs can spot-check every dollar in our audit against a vendor URL. With an LLM in that path, they couldn't — and the audit's credibility (and Credex's pitch) would evaporate.
