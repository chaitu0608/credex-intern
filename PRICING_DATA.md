# Pricing Data Sources

**Purpose:** Proves every dollar in the audit engine traces to a vendor’s official list price. Each number in [`src/lib/pricing.ts`](../src/lib/pricing.ts) has a matching bullet below with URL and verification date. Audit math is rules-only; see [`PROMPTS.md`](PROMPTS.md) for LLM boundaries.

**Last verified:** 2026-05-22 (submission week — re-verify before each major release)

Format: `- Plan: $X/unit — URL — verified YYYY-MM-DD`

---

## Cursor

- Hobby: $0 — https://cursor.com/pricing — verified 2026-05-22
- Pro: $20/user/month — https://cursor.com/pricing — verified 2026-05-22
- Business: $40/user/month — https://cursor.com/pricing — verified 2026-05-22
- Enterprise: custom — https://cursor.com/pricing — verified 2026-05-22

## GitHub Copilot

- Individual: $10/user/month — https://github.com/features/copilot/plans — verified 2026-05-22
- Business: $19/user/month — https://github.com/features/copilot/plans — verified 2026-05-22
- Enterprise: $39/user/month — https://github.com/features/copilot/plans — verified 2026-05-22

## Claude (Anthropic)

- Free: $0 — https://www.anthropic.com/pricing — verified 2026-05-22
- Pro: $20/user/month — https://www.anthropic.com/pricing — verified 2026-05-22
- Max: $100/user/month — https://www.anthropic.com/pricing — verified 2026-05-22
- Team: $25/user/month (min 5 seats; standard seat, monthly billing) — https://www.anthropic.com/pricing — verified 2026-05-22
- Enterprise: custom — https://www.anthropic.com/pricing — verified 2026-05-22
- API: usage-based — https://www.anthropic.com/pricing — verified 2026-05-22

## ChatGPT (OpenAI)

- Free: $0 — https://openai.com/chatgpt/pricing — verified 2026-05-22
- Plus: $20/user/month — https://openai.com/chatgpt/pricing — verified 2026-05-22
- Team: $25/user/month (min 2 seats; monthly billing; vendor label “Business”) — https://openai.com/chatgpt/pricing — verified 2026-05-22
- Enterprise: custom — https://openai.com/chatgpt/pricing — verified 2026-05-22
- API: usage-based — https://openai.com/api/pricing — verified 2026-05-22

## Anthropic API (direct)

- API: usage-based — https://www.anthropic.com/pricing — verified 2026-05-22

## OpenAI API (direct)

- API: usage-based — https://openai.com/api/pricing — verified 2026-05-22

## Google Gemini

- Free: $0 — https://one.google.com/about/plans — verified 2026-05-22
- Pro (Google AI Pro): $20/month — https://one.google.com/about/plans — verified 2026-05-22
- Ultra (Google AI Ultra, 20× usage tier): $199.99/month — https://gemini.google/subscriptions — verified 2026-05-22
- API: usage-based — https://ai.google.dev/pricing — verified 2026-05-22

## Windsurf

- Free: $0 — https://windsurf.com/pricing — verified 2026-05-22
- Pro: $20/user/month — https://windsurf.com/pricing — verified 2026-05-22
- Max: $200/month — https://windsurf.com/pricing — verified 2026-05-22
- Team: $40/user/month — https://windsurf.com/pricing — verified 2026-05-22
- Enterprise: custom — https://windsurf.com/pricing — verified 2026-05-22

---

## Enterprise & custom-tier assumptions

How [`src/lib/auditEngine.ts`](../src/lib/auditEngine.ts) treats prices that are not simple list seats:

| Plan type | `pricing.ts` | Engine behavior |
|-----------|--------------|-----------------|
| **`price: null`** (enterprise on Cursor, Claude, ChatGPT, Windsurf; all `api` tiers) | No catalog $/mo | No flat-dollar savings from list price. API/direct-API tools get usage-benchmarking copy only (`isDirectApiTool`). |
| **GitHub Copilot Enterprise** | `$39/seat` (exception) | Published per-seat price — engine compares vs Business when `teamSize < 10`. |
| **User-reported `monthlySpend`** | N/A | Savings capped via `savingsCapFromListPrice()` — never exceeds reported spend or catalog estimate. |
| **Credex credits** | Not a vendor list price | `use-credits` recommendation is qualitative when `currentSpend >= $200` and spend is near catalog; no fabricated % discount. |

Enterprise and API tiers assume sales-negotiated or metered billing; we do not invent contract discounts.

---

## Known pricing inconsistencies & mapping choices

| Issue | How SpendSense handles it |
|-------|---------------------------|
| **Gemini split across 3 URLs** | Consumer free/pro on `one.google.com`; Ultra on `gemini.google/subscriptions`; API on `ai.google.dev`. `PRICING_SOURCES.gemini` points at the API page for the audit UI; this doc lists all three. |
| **Gemini Ultra tiers reshuffled (May 2026)** | Google now lists Ultra from **$99.99/mo** (5×) and **$199.99/mo** (20×). We map internal plan `ultra` to the **$199.99** top consumer tier (formerly ~$249.99). Mid-tier $99.99 is not in the spend form yet. |
| **Gemini Pro vs Google One** | Listed as **$19.99/mo** on Google One; we round to **$20** in `pricing.ts` for simpler seat math. |
| **ChatGPT “Team” vs “Business”** | OpenAI renamed Team → Business (Aug 2025). Form plan id stays `team`; list price **$25/seat/mo** monthly ($20 annual). |
| **Claude Team seat types** | Anthropic offers standard ($25/mo monthly) and premium ($100–$125/mo) seats. We model **standard** only. |
| **Duplicate API vendors** | `claude`/`chatgpt` include an `api` plan plus standalone `anthropic-api` / `openai-api` — same vendor pages, separate stack rows. |
| **Colliding ~$20/mo tiers** | Cursor Pro, Claude Pro, ChatGPT Plus, Gemini Pro — cross-tool switches are use-case heuristics, not “pick cheapest $20.” |
| **Annual vs monthly** | Engine uses **monthly list** prices only; annual prepay (e.g. Claude Pro $17/mo annual) is ignored. |
| **GitHub Copilot usage transition** | From June 2026, Business/Enterprise move to pooled usage-based credits; **seat prices ($19/$39) unchanged** per [GitHub blog](https://github.blog/news-insights/company-news/github-copilot-is-moving-to-usage-based-billing/). |
| **Windsurf plan names** | Vendor UI says “Teams” ($40/user); internal plan id remains `team`. |

---

## Confidence by price point

| Tool | Plan | Price in engine | Confidence | Engine rule using this price |
|------|------|---------------|------------|------------------------------|
| Cursor | hobby | $0 | High | Baseline / right-sized |
| Cursor | pro | $20/seat | High | Solo downgrade from Business |
| Cursor | business | $40/seat | High | Overlap vs Copilot / seat rules |
| Cursor | enterprise | custom | N/A | No catalog savings |
| GitHub Copilot | individual | $10/seat | High | Baseline |
| GitHub Copilot | business | $19/seat | High | vs Enterprise, vs Windsurf (coding) |
| GitHub Copilot | enterprise | $39/seat | High | Downgrade to Business if `teamSize < 10` |
| Claude | free | $0 | High | Baseline |
| Claude | pro | $20/seat | High | Team seat opt, Max downgrade target |
| Claude | max | $100/seat | High | Downgrade to Pro (writing/research) |
| Claude | team | $25/seat, min 5 | High | Seat optimization vs Pro |
| Claude | enterprise | custom | N/A | No catalog savings |
| Claude | api | usage | N/A | Benchmarking only |
| ChatGPT | free | $0 | High | Baseline |
| ChatGPT | plus | $20/seat | High | Team → Plus for 1 user |
| ChatGPT | team | $25/seat, min 2 | High | Seat opt; vs Claude Pro (research) |
| ChatGPT | enterprise | custom | N/A | No catalog savings |
| ChatGPT | api | usage | N/A | Benchmarking only |
| Anthropic API | api | usage | N/A | Benchmarking only |
| OpenAI API | api | usage | N/A | Benchmarking only |
| Gemini | free | $0 | High | Baseline |
| Gemini | pro | $20/mo | Medium | Rounded from $19.99 Google One bundle |
| Gemini | ultra | $199.99/mo | Medium | Vendor has multi-tier Ultra; we use 20× tier |
| Gemini | api | usage | N/A | Benchmarking only |
| Windsurf | free | $0 | High | Baseline |
| Windsurf | pro | $20/seat | High | Copilot Business switch target |
| Windsurf | max | $200/mo | High | Listed; no dedicated downgrade rule yet |
| Windsurf | team | $40/seat | High | Catalog cost for team stacks |
| Windsurf | enterprise | custom | N/A | No catalog savings |

**Confidence key:** **High** = exact published monthly list used in `calculateCurrentCost()`. **Medium** = correct order of magnitude but mapping or rounding is ambiguous. **N/A** = custom/usage — no fabricated $ savings.

---

## Traceability matrix (`pricing.ts` ↔ this doc)

| Tool | Plans tracked | Per-seat? | Notable constraints |
|------|---------------|-----------|----------------------|
| Cursor | hobby, pro, business, enterprise | yes (pro+) | enterprise = custom |
| GitHub Copilot | individual, business, enterprise | yes | Business $19, Enterprise $39 |
| Claude | free, pro, max, team, enterprise, api | yes (pro/max/team) | **team min 5 seats**, $25/seat |
| ChatGPT | free, plus, team, enterprise, api | yes (plus/team) | **team min 2 seats**, $25/seat |
| Gemini | free, pro, ultra, api | no (consumer flat) | ultra = $199.99 top tier |
| Windsurf | free, pro, max, team, enterprise | yes (pro/team); max flat | team = $40/seat |
| Anthropic API | api | no | usage-based |
| OpenAI API | api | no | usage-based |

---

## Notes for reviewer

- **Source of truth for code:** `src/lib/pricing.ts`. This file is the human-readable mirror. `tests/unit/pricing.test.ts` guards schema and URLs, not dollar drift — manual cross-check against vendor pages is required before submission.
- **Re-verification cadence:** weekly during active iteration; monthly at steady-state. Automation noted in `REFLECTION.md` as a follow-up.
- **API plans:** `price: null` — engine recommends benchmarking last-30-day token use, not flat-plan switches.
