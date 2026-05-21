"use client";

import { Check } from "lucide-react";
import { getToolMeta } from "@/lib/tool-meta";
import { ToolLogo } from "@/components/ui/tool-logo";
import type { AITool } from "@/types";
import { cn } from "@/lib/utils";

interface ToolCardProps {
  tool: AITool;
  selected: boolean;
  onToggle: (tool: AITool) => void;
  onDragStart: (e: React.DragEvent, tool: AITool) => void;
}

export function ToolCard({
  tool,
  selected,
  onToggle,
  onDragStart,
}: ToolCardProps) {
  const meta = getToolMeta(tool);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onToggle(tool);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      draggable
      onDragStart={(e) => onDragStart(e, tool)}
      onClick={() => onToggle(tool)}
      onKeyDown={handleKeyDown}
      aria-pressed={selected}
      aria-label={`${meta.name}. ${selected ? "Selected" : "Not selected"}. Click or drag to add to your stack.`}
      className={cn(
        "group relative flex cursor-pointer flex-col gap-2 rounded-lg border border-border bg-card p-3 text-left transition-all",
        "hover:border-foreground/30 hover:bg-muted/40",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        selected && "border-foreground/40 bg-muted/50 opacity-80"
      )}
    >
      {selected && (
        <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
        </span>
      )}
      <ToolLogo tool={tool} className="h-9 w-9" />
      <div>
        <p className="text-sm font-semibold text-foreground">{meta.name}</p>
        <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
          {meta.description}
        </p>
      </div>
    </div>
  );
}
