# Pricing Data Sources

All prices in `src/lib/pricing.ts` were verified against official vendor pages.

**Last checked:** 2026-05-19 (submission week)

---

## Cursor

| Plan | Price | Source |
|------|-------|--------|
| Hobby | $0 | https://cursor.com/pricing |
| Pro | $20/seat/mo | https://cursor.com/pricing |
| Business | $40/seat/mo | https://cursor.com/pricing |
| Enterprise | Custom | https://cursor.com/pricing |

---

## GitHub Copilot

| Plan | Price | Source |
|------|-------|--------|
| Individual | $10/seat/mo | https://github.com/features/copilot/plans |
| Business | $19/seat/mo | https://github.com/features/copilot/plans |
| Enterprise | $39/seat/mo | https://github.com/features/copilot/plans |

---

## Claude (Anthropic)

| Plan | Price | Source |
|------|-------|--------|
| Free | $0 | https://www.anthropic.com/pricing |
| Pro | $20/seat/mo | https://www.anthropic.com/pricing |
| Max | $100/seat/mo | https://www.anthropic.com/pricing |
| Team | $30/seat/mo (min 5 seats) | https://www.anthropic.com/pricing |
| Enterprise | Custom | https://www.anthropic.com/pricing |
| API | Usage-based | https://www.anthropic.com/pricing |

---

## ChatGPT (OpenAI)

| Plan | Price | Source |
|------|-------|--------|
| Free | $0 | https://openai.com/chatgpt/pricing |
| Plus | $20/seat/mo | https://openai.com/chatgpt/pricing |
| Team | $30/seat/mo (min 2 seats) | https://openai.com/chatgpt/pricing |
| Enterprise | Custom | https://openai.com/chatgpt/pricing |
| API | Usage-based | https://openai.com/api/pricing |

---

## Anthropic API (direct)

| Plan | Price | Source |
|------|-------|--------|
| API | Usage-based | https://www.anthropic.com/pricing |

---

## OpenAI API (direct)

| Plan | Price | Source |
|------|-------|--------|
| API | Usage-based | https://openai.com/api/pricing |

---

## Google Gemini

| Plan | Price | Source |
|------|-------|--------|
| Free | $0 | https://one.google.com/about/plans |
| Pro (Google AI Pro) | $20/mo | https://one.google.com/about/plans |
| Ultra | $249.99/mo | https://gemini.google/subscriptions |
| API | Usage-based | https://ai.google.dev/pricing |

---

## Windsurf

| Plan | Price | Source |
|------|-------|--------|
| Free | $0 | https://windsurf.com/pricing |
| Pro | $15/seat/mo | https://windsurf.com/pricing |
| Team | $35/seat/mo | https://windsurf.com/pricing |
| Enterprise | Custom | https://windsurf.com/pricing |

---

## Notes

- **Gemini Pro** maps to Google AI Pro (~$20/mo). **Ultra** is the top consumer tier — verify list price before submission.
- **API plans** have `price: null` in code — audit recommends usage benchmarking, not flat monthly replacement.
- Re-verify prices before final submission if vendors change rates.
