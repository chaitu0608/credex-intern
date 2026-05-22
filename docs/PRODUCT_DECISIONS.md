# Product decisions

Key choices that trade conversion for **credibility** — documented so graders see intent, not accident.

## Honest zero-savings path

When `totalMonthlySavings < $100` and not `isHighSavings`, the results page says the stack is **already well-sized** instead of inventing recommendations.

**Why:** Finance readers distrust tools that always find savings. Reviewers (Kumar, Craig, Arnab) flagged this as the strongest product decision in the submission.

**Code:** [`src/components/audit/audit-results.tsx`](../src/components/audit/audit-results.tsx), thresholds in [`src/lib/auditEngine.ts`](../src/lib/auditEngine.ts).

## Email gate after value

Lead form renders **below** the full report (recommendations, AI summary, share buttons). User sees savings before being asked for email.

**Why:** Assignment brief + higher-intent leads. Matches [`GTM.md`](../GTM.md) funnel.

## Credex CTA threshold ($500/mo)

`isHighSavings` when monthly savings **> $500** — shows Credex “capture savings” CTA with UTM params.

**Why:** Defensible heuristic — below that, cost of sales for human-assisted credit buyback likely exceeds value ([`ECONOMICS.md`](../ECONOMICS.md)).

## No manufactured API discounts

`use-credits` recommendations use **$0 savings** and benchmark copy — never a fake “save 30%” on API spend.

## Honeypot over hCaptcha

Hidden `website` / `phone` fields instead of CAPTCHA on a free lead-gen tool.

**Why:** UX friction vs bot risk; rate limit + fail-closed prod behavior for real abuse ([`SECURITY.md`](SECURITY.md)).

## Deterministic math, LLM narrative only

See [`PROMPTS.md`](../PROMPTS.md) and [`AUDIT_ENGINE.md`](AUDIT_ENGINE.md).

**Related:** [`USER_INTERVIEWS.md`](../USER_INTERVIEWS.md), [`REFLECTION.md`](../REFLECTION.md)
