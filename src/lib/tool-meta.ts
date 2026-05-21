import type { AITool } from "@/types";
import { TOOL_DESCRIPTIONS, TOOL_NAMES } from "@/lib/pricing";

export const ALL_TOOLS = Object.keys(TOOL_NAMES) as AITool[];

export function getToolMeta(tool: AITool) {
  return {
    tool,
    name: TOOL_NAMES[tool],
    description: TOOL_DESCRIPTIONS[tool],
  };
}
