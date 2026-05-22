# AI Summary Prompts (SpendSense)

SpendSense uses **hardcoded rules** for audit math (`src/lib/auditEngine.ts`). LLM features are limited to **copy only** — never audit math.

| Feature | Implementation |
|---------|----------------|
| One-shot personalized summary | `src/lib/ai-summary.ts` |
| Audit results chat widget | `src/app/api/audit/[id]/chat/route.ts` + `src/lib/audit-chat-context.ts` |
| Shared OpenAI client | `src/lib/openai-client.ts` |

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

## Audit chat widget (results page only)

Floating assistant on `/audit/[id]`. Answers follow-up questions about **the saved audit** loaded from Supabase — does not re-run `runAudit()` or invent new dollar amounts.

### Model

- Same provider/model as summary: OpenAI `gpt-4o-mini` (`OPENAI_MODEL` optional)
- **max_tokens:** 300 per reply
- **Rate limit:** `checkRateLimit(ip)` — same 10 requests/hour/IP as `POST /api/audit`
- **Session cap:** 6 user messages per page visit (client-side in `audit-chat-widget.tsx`)

### System prompt (built by `buildAuditChatSystemPrompt()`)

Guardrails prepended to serialized audit context:

```
You are SpendSense's audit assistant. Answer only about THIS saved audit report.
Rules:
- Use only dollar amounts, plans, and recommendations listed in the audit context below.
- Never invent new savings figures, list prices, or vendor plans.
- If asked to recalculate or change numbers, say the report above is the source of truth.
- Keep replies under 120 words. Plain sentences, no markdown bullets unless the user asks for a list.
- Be direct and helpful; no sales hype except briefly mentioning Credex when isHighSavings is true and the user asks about it.
```

Context block includes: team size, use case, tools submitted, top 3 recommendations, all recommendations with reasons, totals, `isHighSavings`, and the stored `aiSummary`.

### API

- `POST /api/audit/[id]/chat` body: `{ messages: { role: "user" | "assistant", content: string }[] }`
- Returns `{ reply: string }`
- Missing key or API failure: `"I can't reach the assistant right now. Your audit numbers above are still valid."`

### Why not LLM for chat math

Same principle as the summary: the widget **explains** precomputed `reason` strings and totals. Users asking “change my savings to $X” get redirected to the report as source of truth.

---

## Why not LLM for audit math?

Finance teams need **traceable numbers** tied to list prices. LLMs hallucinate prices and seat minimums. Rules + `PRICING_DATA.md` citations are the correct split for this assignment.

A reviewer with the Cursor / Anthropic / OpenAI / GitHub pricing pages open in tabs can spot-check every dollar in our audit against a vendor URL. With an LLM in that path, they couldn't — and the audit's credibility (and Credex's pitch) would evaporate.
