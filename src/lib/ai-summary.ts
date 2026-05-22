import { generateAuditSummaryPrompt } from "@/lib/auditEngine";
import { callOpenAI } from "@/lib/openai-client";
import type { AuditInput, AuditResult, SummarySource } from "@/types";

type AuditWithoutSummary = Omit<
  AuditResult,
  "id" | "aiSummary" | "summarySource" | "createdAt"
>;

export type GeneratedSummary = {
  summary: string;
  source: SummarySource;
};

const SYSTEM_PROMPT =
  "You are a concise financial analyst. Direct, specific. No fluff. No sales pitch. Under 120 words. Plain paragraph, no bullets.";

function buildFallbackSummary(
  result: AuditWithoutSummary,
  input: AuditInput
): string {
  const totalSpend = input.tools.reduce((s, t) => s + t.monthlySpend, 0);
  const top = [...result.recommendations]
    .filter((r) => r.savings > 0)
    .sort((a, b) => b.savings - a.savings)[0];

  if (result.totalMonthlySavings < 100) {
    return `Your team spends roughly $${totalSpend}/month across ${input.tools.length} AI tools for ${input.useCase} work. Our audit found about $${result.totalMonthlySavings}/month in clear savings — your stack looks largely right-sized. We'll notify you when new optimizations apply to your stack.`;
  }

  const topLine = top
    ? `The largest opportunity is ${top.toolName}: ${top.recommendedAction.toLowerCase()}, saving about $${top.savings}/month.`
    : "Several line items are worth revisiting.";

  const credex = result.isHighSavings
    ? " Credex can help capture additional savings through discounted infrastructure credits — worth a short consultation."
    : "";

  return `Across ${input.tools.length} tools (~$${totalSpend}/month), we identified $${result.totalMonthlySavings}/month ($${result.totalAnnualSavings}/year) in potential savings for your ${input.teamSize}-person ${input.useCase} team. ${topLine}${credex}`;
}

export async function generateAISummary(
  result: AuditWithoutSummary,
  input: AuditInput
): Promise<GeneratedSummary> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return {
      summary: buildFallbackSummary(result, input),
      source: "template",
    };
  }

  try {
    const prompt = generateAuditSummaryPrompt(result, input);
    const text = await callOpenAI(
      apiKey,
      [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      { maxTokens: 200 }
    );

    if (text) {
      return { summary: text, source: "ai" };
    }

    return {
      summary: buildFallbackSummary(result, input),
      source: "template",
    };
  } catch (error) {
    console.error("generateAISummary error:", error);
    return {
      summary: buildFallbackSummary(result, input),
      source: "template",
    };
  }
}
