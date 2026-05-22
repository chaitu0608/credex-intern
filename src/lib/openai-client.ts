export const DEFAULT_OPENAI_MODEL = "gpt-4o-mini";

export type OpenAIChatRole = "system" | "user" | "assistant";

export type OpenAIChatMessage = {
  role: OpenAIChatRole;
  content: string;
};

export type CallOpenAIOptions = {
  maxTokens?: number;
  model?: string;
};

export async function callOpenAI(
  apiKey: string,
  messages: OpenAIChatMessage[],
  options?: CallOpenAIOptions
): Promise<string | null> {
  const model =
    options?.model?.trim() ||
    process.env.OPENAI_MODEL?.trim() ||
    DEFAULT_OPENAI_MODEL;
  const maxTokens = options?.maxTokens ?? 200;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      messages,
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
