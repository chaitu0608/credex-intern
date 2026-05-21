# P2 engine cross-check (2026-05-21)

Rule: every dollar in `savings` must trace to `calculateCurrentCost()` / `PRICING_DATA.md`, never hardcoded guesses.

## P2.1 — Gemini Ultra → Pro (writing / research / mixed)

| Input | List ultra | List pro | Expected savings | Test |
|-------|------------|----------|------------------|------|
| team 3, writing, ultra | $249.99 | $20 | **$229.99** | `downgrades Gemini Ultra to Pro using list prices` |
| team 1, coding, ultra | $249.99 | $20 | **$229.99** (solo rule) | `downgrades solo Gemini Ultra` |
| team 5, coding, ultra | — | — | **$0** (no downgrade) | `does not downgrade Gemini Ultra for coding teams` |

Source: `PRICING_DATA.md` Gemini Ultra $249.99, Pro $20.

## P2.2 — Solo Gemini Ultra

Handled by `teamSize === 1` block before use-case gate — same $229.99 math.

## P2.3 — Writing duplicate cap

`savingsCapFromListPrice()` uses `calculateCurrentCost()` then `min(reported, catalog)`.

| Scenario | Reported | Catalog | Capped savings | Test |
|----------|----------|---------|----------------|------|
| gemini pro overspend $50 | $50 | $20 | **$20** | `caps writing-duplicate savings` |
| gemini + claude writing | drop gemini $20 | $20 | **$20** | `includes Gemini in writing-duplicate` |

## P2.4 — Direct API tools ($0 savings)

`isDirectApiTool()` covers: `anthropic-api`, `openai-api`, `gemini/api`, `claude/api`, `chatgpt/api`.

| Tool | Savings | Credex hint ≥ $500 | Test |
|------|---------|-------------------|------|
| anthropic-api | 0 | no at $1200? actually 1200 >= 500 | `anthropic-api` |
| openai-api | 0 | yes at $600 | `mentions Credex credits` |
| gemini api | 0 | — | `gemini api plan` |

API plans have `price: null` — old `useCase === "data"` flat-plan block skipped; direct API block runs first.

## P2.5 — Regression suite

```bash
npm test          # 60 tests (was 50 pre-P2)
npm run lint
npm run typecheck
npm run build
```

All green on 2026-05-21.

## Intentional non-goals (P2)

- No fabricated % off API spend
- Gemini Ultra on multi-seat **coding** teams: no downgrade (only solo + writing/research/mixed)
- Double-count guard: one recommendation row per `tool` id (upsert replaces only if higher savings)
