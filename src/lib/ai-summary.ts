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

const SYSTEM_PROMPT =
  "You are a concise financial analyst. Direct, specific. No fluff. No sales pitch. Under 120 words. Plain paragraph, no bullets.";

const DEFAULT_MODEL = "gpt-4o-mini";

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

async function callOpenAI(
  apiKey: string,
  userPrompt: string
): Promise<string | null> {
  const model = process.env.OPENAI_MODEL?.trim() || DEFAULT_MODEL;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      max_tokens: 200,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    console.error(
      "OpenAI chat/completions error:",
      response.status,
      errText.slice(0, 500)
    );
    return null;
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const text = data.choices?.[0]?.message?.content?.trim();
  return text || null;
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
    const text = await callOpenAI(apiKey, prompt);

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
