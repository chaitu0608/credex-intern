import type { AITool } from "@/types";

// Source: verified May 2026 — see PRICING_DATA.md

export type PricingEntry = {
  price: number | null;
  pricePerSeat: boolean;
  minSeats?: number;
};

export const PRICING: Record<AITool, Record<string, PricingEntry>> = {
  cursor: {
    hobby: { price: 0, pricePerSeat: false },
    pro: { price: 20, pricePerSeat: true },
    business: { price: 40, pricePerSeat: true },
    enterprise: { price: null, pricePerSeat: true },
  },
  "github-copilot": {
    individual: { price: 10, pricePerSeat: true },
    business: { price: 19, pricePerSeat: true },
    enterprise: { price: 39, pricePerSeat: true },
  },
  claude: {
    free: { price: 0, pricePerSeat: false },
    pro: { price: 20, pricePerSeat: true },
    max: { price: 100, pricePerSeat: true },
    team: { price: 30, pricePerSeat: true, minSeats: 5 },
    enterprise: { price: null, pricePerSeat: true },
    api: { price: null, pricePerSeat: false },
  },
  chatgpt: {
    free: { price: 0, pricePerSeat: false },
    plus: { price: 20, pricePerSeat: true },
    team: { price: 30, pricePerSeat: true, minSeats: 2 },
    enterprise: { price: null, pricePerSeat: true },
    api: { price: null, pricePerSeat: false },
  },
  "anthropic-api": {
    api: { price: null, pricePerSeat: false },
  },
  "openai-api": {
    api: { price: null, pricePerSeat: false },
  },
  gemini: {
    free: { price: 0, pricePerSeat: false },
    advanced: { price: 20, pricePerSeat: true },
    api: { price: null, pricePerSeat: false },
  },
  windsurf: {
    free: { price: 0, pricePerSeat: false },
    pro: { price: 15, pricePerSeat: true },
    team: { price: 35, pricePerSeat: true },
    enterprise: { price: null, pricePerSeat: true },
  },
};

export const TOOL_NAMES: Record<AITool, string> = {
  cursor: "Cursor",
  "github-copilot": "GitHub Copilot",
  claude: "Claude",
  chatgpt: "ChatGPT",
  "anthropic-api": "Anthropic API",
  "openai-api": "OpenAI API",
  gemini: "Google Gemini",
  windsurf: "Windsurf",
};

export const TOOL_DESCRIPTIONS: Record<AITool, string> = {
  cursor: "AI-native code editor",
  "github-copilot": "AI pair programmer in your IDE",
  claude: "Anthropic assistant for writing and analysis",
  chatgpt: "OpenAI assistant for general work",
  "anthropic-api": "Direct API access to Claude models",
  "openai-api": "Direct API access to GPT models",
  gemini: "Google AI assistant and API",
  windsurf: "AI IDE with Cascade agent",
};

export const PLAN_OPTIONS: Record<AITool, string[]> = {
  cursor: ["hobby", "pro", "business", "enterprise"],
  "github-copilot": ["individual", "business", "enterprise"],
  claude: ["free", "pro", "max", "team", "enterprise", "api"],
  chatgpt: ["free", "plus", "team", "enterprise", "api"],
  "anthropic-api": ["api"],
  "openai-api": ["api"],
  gemini: ["free", "advanced", "api"],
  windsurf: ["free", "pro", "team", "enterprise"],
};

export function getPlanPrice(tool: AITool, plan: string): number | null {
  return PRICING[tool]?.[plan]?.price ?? null;
}

export function getMinSeats(tool: AITool, plan: string): number {
  return PRICING[tool]?.[plan]?.minSeats ?? 1;
}

export function calculateCurrentCost(
  tool: AITool,
  plan: string,
  seats: number
): number | null {
  const entry = PRICING[tool]?.[plan];
  if (!entry || entry.price === null) return null;
  if (!entry.pricePerSeat) return entry.price;
  const minSeats = entry.minSeats ?? 1;
  const effectiveSeats = Math.max(seats, minSeats);
  return entry.price * effectiveSeats;
}

export function formatPlanLabel(tool: AITool, plan: string): string {
  const price = getPlanPrice(tool, plan);
  const label = plan.charAt(0).toUpperCase() + plan.slice(1);
  if (price === null) return `${label} (custom/usage)`;
  if (price === 0) return `${label} (free)`;
  const perSeat = PRICING[tool][plan]?.pricePerSeat;
  return perSeat ? `${label} ($${price}/seat/mo)` : `${label} ($${price}/mo)`;
}
