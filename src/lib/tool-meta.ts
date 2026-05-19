import type { AITool } from "@/types";
import { TOOL_DESCRIPTIONS, TOOL_NAMES } from "@/lib/pricing";

export const ALL_TOOLS = Object.keys(TOOL_NAMES) as AITool[];

export const TOOL_INITIALS: Record<AITool, string> = {
  cursor: "Cu",
  "github-copilot": "GH",
  claude: "Cl",
  chatgpt: "GPT",
  "anthropic-api": "AN",
  "openai-api": "OA",
  gemini: "Ge",
  windsurf: "WS",
};

export function getToolMeta(tool: AITool) {
  return {
    tool,
    name: TOOL_NAMES[tool],
    description: TOOL_DESCRIPTIONS[tool],
    initials: TOOL_INITIALS[tool],
  };
}
