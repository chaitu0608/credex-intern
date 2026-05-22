import { describe, expect, it } from "vitest";
import { PRICING, PLAN_OPTIONS, PRICING_SOURCES } from "@/lib/pricing";
import type { AITool } from "@/types";

const TOOLS: AITool[] = [
  "cursor",
  "github-copilot",
  "claude",
  "chatgpt",
  "anthropic-api",
  "openai-api",
  "gemini",
  "windsurf",
];

describe("pricing", () => {
  it("includes all 8 assignment tools", () => {
    for (const tool of TOOLS) {
      expect(PRICING[tool]).toBeDefined();
      expect(PLAN_OPTIONS[tool].length).toBeGreaterThan(0);
    }
  });

  it("gemini has pro, ultra, and api per assignment", () => {
    expect(PLAN_OPTIONS.gemini).toEqual(
      expect.arrayContaining(["pro", "ultra", "api"])
    );
    expect(PRICING.gemini.pro.price).toBe(20);
    expect(PRICING.gemini.ultra.price).toBe(199.99);
  });

  it("claude team has min 5 seats", () => {
    expect(PRICING.claude.team.minSeats).toBe(5);
  });

  it("chatgpt team has min 2 seats", () => {
    expect(PRICING.chatgpt.team.minSeats).toBe(2);
  });

  it("PRICING_SOURCES has official URL for every tool", () => {
    for (const tool of TOOLS) {
      expect(PRICING_SOURCES[tool].url).toMatch(/^https:\/\//);
      expect(PRICING_SOURCES[tool].label.length).toBeGreaterThan(0);
    }
  });
});
