import type { AITool } from "@/types";
import { PRICING, TOOL_DESCRIPTIONS, TOOL_NAMES } from "@/lib/pricing";

/** Single source of truth — every tool in PRICING appears in the form palette */
export const ALL_TOOLS = Object.keys(PRICING) as AITool[];

export function getToolMeta(tool: AITool) {
  return {
    tool,
    name: TOOL_NAMES[tool],
    description: TOOL_DESCRIPTIONS[tool],
  };
}
