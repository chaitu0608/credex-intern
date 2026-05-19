# Pricing Data Sources

All prices in `src/lib/pricing.ts` were verified against official vendor pricing pages.

**Last verified:** 2026-05-20 (submission week — re-verify before each major release)

Format follows the assignment spec: `- Plan: $X/unit — URL — verified YYYY-MM-DD`.

---

## Cursor

- Hobby: $0 — https://cursor.com/pricing — verified 2026-05-20
- Pro: $20/user/month — https://cursor.com/pricing — verified 2026-05-20
- Business: $40/user/month — https://cursor.com/pricing — verified 2026-05-20
- Enterprise: custom — https://cursor.com/pricing — verified 2026-05-20

## GitHub Copilot

- Individual: $10/user/month — https://github.com/features/copilot/plans — verified 2026-05-20
- Business: $19/user/month — https://github.com/features/copilot/plans — verified 2026-05-20
- Enterprise: $39/user/month — https://github.com/features/copilot/plans — verified 2026-05-20

## Claude (Anthropic)

- Free: $0 — https://www.anthropic.com/pricing — verified 2026-05-20
- Pro: $20/user/month — https://www.anthropic.com/pricing — verified 2026-05-20
- Max: $100/user/month — https://www.anthropic.com/pricing — verified 2026-05-20
- Team: $30/user/month (min 5 seats) — https://www.anthropic.com/pricing — verified 2026-05-20
- Enterprise: custom — https://www.anthropic.com/pricing — verified 2026-05-20
- API: usage-based — https://www.anthropic.com/pricing — verified 2026-05-20

## ChatGPT (OpenAI)

- Free: $0 — https://openai.com/chatgpt/pricing — verified 2026-05-20
- Plus: $20/user/month — https://openai.com/chatgpt/pricing — verified 2026-05-20
- Team: $30/user/month (min 2 seats) — https://openai.com/chatgpt/pricing — verified 2026-05-20
- Enterprise: custom — https://openai.com/chatgpt/pricing — verified 2026-05-20
- API: usage-based — https://openai.com/api/pricing — verified 2026-05-20

## Anthropic API (direct)

- API: usage-based — https://www.anthropic.com/pricing — verified 2026-05-20

## OpenAI API (direct)

- API: usage-based — https://openai.com/api/pricing — verified 2026-05-20

## Google Gemini

- Free: $0 — https://one.google.com/about/plans — verified 2026-05-20
- Pro (Google AI Pro): $20/month — https://one.google.com/about/plans — verified 2026-05-20
- Ultra (Gemini Advanced / Ultra tier): $249.99/month — https://gemini.google/subscriptions — verified 2026-05-20
- API: usage-based — https://ai.google.dev/pricing — verified 2026-05-20

## Windsurf

- Free: $0 — https://windsurf.com/pricing — verified 2026-05-20
- Pro: $15/user/month — https://windsurf.com/pricing — verified 2026-05-20
- Team: $35/user/month — https://windsurf.com/pricing — verified 2026-05-20
- Enterprise: custom — https://windsurf.com/pricing — verified 2026-05-20

---

## Notes for reviewer

- **Gemini Pro** maps to Google AI Pro (~$20/mo). The **Ultra** tier price ($249.99) is the consumer-facing Gemini Advanced / Ultra subscription as listed on `gemini.google/subscriptions` — Google occasionally re-prices these so re-verify before re-releasing.
- **API plans** carry `price: null` in `src/lib/pricing.ts` — the audit engine never asserts a flat $/month savings for usage-based pricing; instead it recommends benchmarking the last 30 days of token use against the flat plan.
- **Re-verification cadence:** weekly during active iteration, monthly at steady-state. A planned GitHub Action will scrape these pages and open a PR on diff — noted in `REFLECTION.md` as a week-2 item.
- **Source of truth for the code:** `src/lib/pricing.ts`. This file is the human-readable mirror; if the two ever drift, the test suite (`src/lib/pricing.test.ts`) catches the schema-level mismatch but not the dollar values, so manual cross-check is mandatory before submission.

## Equivalent at-a-glance table

| Tool | Plans tracked | Per-seat? | Notable constraints |
|------|---------------|-----------|----------------------|
| Cursor | hobby, pro, business, enterprise | yes (pro+) | enterprise = custom |
| GitHub Copilot | individual, business, enterprise | yes | none |
| Claude | free, pro, max, team, enterprise, api | yes (pro/max/team) | **team min 5 seats** |
| ChatGPT | free, plus, team, enterprise, api | yes (plus/team) | **team min 2 seats** |
| Gemini | free, pro, ultra, api | no (consumer flat) | ultra is consumer-facing |
| Windsurf | free, pro, team, enterprise | yes (pro/team) | none |
| Anthropic API | api | no | usage-based |
| OpenAI API | api | no | usage-based |
