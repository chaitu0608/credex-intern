import Anthropic from "@anthropic-ai/sdk";
import { generateAuditSummaryPrompt } from "@/lib/auditEngine";
import type { AuditInput, AuditResult, SummarySource } from "@/types";

type AuditWithoutSummary = Omit<
  AuditResult,
  "id" | "aiSummary" | "summarySource" | "createdAt"
>;

export type GeneratedSummary = {
  summary: string;
  source: SummarySource;
};

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
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      summary: buildFallbackSummary(result, input),
      source: "template",
    };
  }

  try {
    const client = new Anthropic({ apiKey });
    const prompt = generateAuditSummaryPrompt(result, input);

    const message = await client.messages.create({
      model: process.env.ANTHROPIC_MODEL ?? "claude-3-5-sonnet-20241022",
      max_tokens: 200,
      system:
        "You are a concise financial analyst. Direct, specific. No fluff. No sales pitch. Under 120 words. Plain paragraph, no bullets.",
      messages: [{ role: "user", content: prompt }],
    });

    const block = message.content[0];
    if (block.type === "text" && block.text.trim()) {
      return { summary: block.text.trim(), source: "ai" };
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
