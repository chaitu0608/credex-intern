# Audit engine

**Canonical implementation:** [`src/lib/auditEngine.ts`](../src/lib/auditEngine.ts)  
**List prices:** [`src/lib/pricing.ts`](../src/lib/pricing.ts) + [`PRICING_DATA.md`](../PRICING_DATA.md)

The engine **never** calls OpenAI. All dollar amounts are deterministic.

## Pipeline

```text
AuditInput (tools, teamSize, useCase)
    → per tool: analyzeToolEntry
    → stack: Cursor + Copilot overlap (coding/mixed)
    → stack: writing duplicate consolidation
    → merge recommendations (stack rule wins if higher savings)
    → sum → totalMonthlySavings, totalAnnualSavings, isHighSavings
```

## Per-tool rule order

First matching rule with positive economics wins:

1. **`optimize-seats`** — Claude Team &lt; 5 seats; ChatGPT Team solo; Copilot Enterprise &lt; 10 seats
2. **`downgrade`** — Claude Max→Pro; Cursor Business→Pro solo; Gemini Ultra→Pro
3. **`switch-tool`** — e.g. Copilot Business vs Windsurf; ChatGPT Team vs Claude Pro
4. **`use-credits`** — API tools; $0 fabricated %; may mention Credex for high API spend
5. **`right-sized`** — No change; $0 savings

## Stack rules

| Rule | Trigger | Effect |
|------|---------|--------|
| Cursor + Copilot overlap | `coding` or `mixed`, both present | Drop lower-spend IDE |
| Writing duplicates | `writing` or `mixed`, 2+ writing tools | Keep highest spend; cap savings at list price |

## Thresholds

| Constant | Value | UI effect |
|----------|-------|-----------|
| `HIGH_SAVINGS_THRESHOLD_MONTHLY` | $500/mo | Credex CTA + high-savings hero |
| `HONEST_PATH_MAX_MONTHLY` | $100/mo | “Spending well” copy when not high-savings |

## Savings math

- `savings = max(0, currentListScenario - recommendedListScenario)`
- `totalAnnualSavings = totalMonthlySavings × 12`
- User `monthlySpend` is display-only; caps use catalog prices

## Tests

23 engine tests in [`tests/unit/audit-engine.test.ts`](../tests/unit/audit-engine.test.ts) — see [`TESTS.md`](../TESTS.md).

**Related:** [`PRODUCT_DECISIONS.md`](PRODUCT_DECISIONS.md), [`PROMPTS.md`](../PROMPTS.md) (AI boundaries)
