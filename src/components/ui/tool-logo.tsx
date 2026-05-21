"use client";

import type { AITool } from "@/types";
import { cn } from "@/lib/utils";

/**
 * Brand color for each tool's badge background.
 * Sourced from each vendor's published brand pages / press kits.
 * Glyphs are stylized — recognizable, not pixel-perfect replicas.
 */
const BRAND_COLOR: Record<AITool, string> = {
  cursor: "#0F0F12",
  "github-copilot": "#1F2328",
  claude: "#D97757",
  chatgpt: "#10A37F",
  "anthropic-api": "#D97757",
  "openai-api": "#0F0F12",
  gemini: "#1A73E8",
  windsurf: "#06B6D4",
};

interface GlyphProps {
  className?: string;
}

function CursorGlyph({ className }: GlyphProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M5 2.5 L19 12 L13 13 L11 21 Z" />
    </svg>
  );
}

function ClaudeGlyph({ className }: GlyphProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M12 2 L13 9 L19 5 L15 11 L22 12 L15 13 L19 19 L13 15 L12 22 L11 15 L5 19 L9 13 L2 12 L9 11 L5 5 L11 9 Z" />
    </svg>
  );
}

function OpenAIGlyph({ className }: GlyphProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <circle cx="12" cy="4.5" r="2.2" />
      <circle cx="18.5" cy="8.25" r="2.2" />
      <circle cx="18.5" cy="15.75" r="2.2" />
      <circle cx="12" cy="19.5" r="2.2" />
      <circle cx="5.5" cy="15.75" r="2.2" />
      <circle cx="5.5" cy="8.25" r="2.2" />
    </svg>
  );
}

function GeminiGlyph({ className }: GlyphProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M12 1.5 L13.5 10.5 L22.5 12 L13.5 13.5 L12 22.5 L10.5 13.5 L1.5 12 L10.5 10.5 Z" />
    </svg>
  );
}

function CopilotGlyph({ className }: GlyphProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <rect x="2" y="9" width="20" height="6" rx="3" />
      <circle cx="8" cy="12" r="1.5" fill="#1F2328" />
      <circle cx="16" cy="12" r="1.5" fill="#1F2328" />
    </svg>
  );
}

function WindsurfGlyph({ className }: GlyphProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      className={className}
      aria-hidden
    >
      <path d="M3 10 Q 8 4 13 8 T 21 6" />
      <path d="M3 16 Q 8 10 13 14 T 21 12" />
    </svg>
  );
}

const GLYPH: Record<AITool, React.FC<GlyphProps>> = {
  cursor: CursorGlyph,
  "github-copilot": CopilotGlyph,
  claude: ClaudeGlyph,
  chatgpt: OpenAIGlyph,
  "anthropic-api": ClaudeGlyph,
  "openai-api": OpenAIGlyph,
  gemini: GeminiGlyph,
  windsurf: WindsurfGlyph,
};

interface ToolLogoProps {
  tool: AITool;
  className?: string;
  /**
   * `badge` (default): brand-colored rounded square with the glyph in white.
   * `glyph`: just the SVG mark in `currentColor` — for use in muted/themed backgrounds.
   */
  variant?: "badge" | "glyph";
}

export function ToolLogo({
  tool,
  className,
  variant = "badge",
}: ToolLogoProps) {
  const Glyph = GLYPH[tool];

  if (variant === "glyph") {
    return <Glyph className={className} />;
  }

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-md text-white shadow-sm",
        className
      )}
      style={{ backgroundColor: BRAND_COLOR[tool] }}
      aria-hidden
    >
      <Glyph className="h-3/5 w-3/5" />
    </span>
  );
}

export { BRAND_COLOR };
