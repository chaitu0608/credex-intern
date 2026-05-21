"use client";

import { ToolLogo } from "@/components/ui/tool-logo";
import type { AITool } from "@/types";

const ICONS: { tool: AITool; style: string }[] = [
  { tool: "openai-api", style: "top-[18%] left-[8%] -rotate-12" },
  { tool: "claude", style: "top-[22%] right-[10%] rotate-6" },
  { tool: "cursor", style: "top-[42%] left-[5%] rotate-3" },
  { tool: "github-copilot", style: "top-[38%] right-[6%] -rotate-6" },
  { tool: "gemini", style: "bottom-[32%] left-[12%] -rotate-3" },
  { tool: "windsurf", style: "bottom-[28%] right-[14%] rotate-12" },
];

export function FloatingIcons() {
  return (
    <div
      className="pointer-events-none absolute inset-0 hidden overflow-hidden md:block"
      aria-hidden
    >
      {ICONS.map((icon) => (
        <div
          key={icon.tool}
          className={`absolute rounded-xl border border-stone-200/80 bg-white/70 p-1.5 shadow-sm backdrop-blur-sm ${icon.style}`}
        >
          <ToolLogo tool={icon.tool} className="h-9 w-9" />
        </div>
      ))}
    </div>
  );
}
