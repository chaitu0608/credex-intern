import type { AuditResult } from "@/types";

const CHAT_GUARDRAILS = `You are SpendSense's audit assistant. Answer only about THIS saved audit report.
Rules:
- Use only dollar amounts, plans, and recommendations listed in the audit context below.
- Never invent new savings figures, list prices, or vendor plans.
- If asked to recalculate or change numbers, say the report above is the source of truth.
- Keep replies under 120 words. Plain sentences, no markdown bullets unless the user asks for a list.
- Be direct and helpful; no sales hype except briefly mentioning Credex when isHighSavings is true and the user asks about it.`;

export function buildAuditChatSystemPrompt(audit: AuditResult): string {
  const { input, recommendations, totalMonthlySavings, totalAnnualSavings } =
    audit;

  const toolLines = input.tools
    .map(
      (t) =>
        `- ${t.tool}: plan=${t.plan}, spend=$${t.monthlySpend}/mo, seats=${t.seats}`
    )
    .join("\n");

  const topRecs = [...recommendations]
    .filter((r) => r.savings > 0)
    .sort((a, b) => b.savings - a.savings)
    .slice(0, 3)
    .map(
      (r) =>
        `- ${r.toolName}: ${r.recommendedAction} — save $${r.savings}/mo. Reason: ${r.reason}`
    )
    .join("\n");

  const allRecs = recommendations
    .map(
      (r) =>
        `- ${r.toolName} (${r.currentPlan}, $${r.currentSpend}/mo): ${r.recommendedAction} [${r.recommendationType}] savings=$${r.savings}/mo — ${r.reason}`
    )
    .join("\n");

  return `${CHAT_GUARDRAILS}

AUDIT CONTEXT (immutable report id: ${audit.id})
Team: ${input.teamSize} people, use case: ${input.useCase}
Total potential savings: $${totalMonthlySavings}/month ($${totalAnnualSavings}/year)
High savings (Credex eligible): ${audit.isHighSavings ? "yes" : "no"}

Tools submitted:
${toolLines}

Top recommendations by savings:
${topRecs || "(none — stack appears optimized)"}

All recommendations:
${allRecs}

Saved personalized summary:
${audit.aiSummary}`;
}
