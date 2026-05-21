"use client";

import { useId } from "react";
import type { AITool } from "@/types";
import {
  BRAND_COLOR,
  TOOL_BADGE,
  TOOL_BRAND,
} from "@/lib/tool-brand-icons";
import { cn } from "@/lib/utils";

interface ToolLogoProps {
  tool: AITool;
  className?: string;
  /**
   * `badge` (default): brand-colored tile with high-contrast official mark.
   * `glyph`: inline mark in primary brand color.
   */
  variant?: "badge" | "glyph";
}

function BrandSvg({
  tool,
  className,
  fill,
  gradientId,
}: {
  tool: AITool;
  className?: string;
  fill: string;
  gradientId?: string;
}) {
  const brand = TOOL_BRAND[tool];
  const useGradient = gradientId && TOOL_BADGE[tool].gradient;

  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
      role="img"
    >
      <title>{brand.title}</title>
      {useGradient && (
        <defs>
          <linearGradient
            id={gradientId}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#4285F4" />
            <stop offset="35%" stopColor="#9B72CB" />
            <stop offset="65%" stopColor="#D96570" />
            <stop offset="100%" stopColor="#F4B400" />
          </linearGradient>
        </defs>
      )}
      <path
        d={brand.path}
        fill={useGradient ? `url(#${gradientId})` : fill}
      />
    </svg>
  );
}

export function ToolLogo({
  tool,
  className,
  variant = "badge",
}: ToolLogoProps) {
  const brand = TOOL_BRAND[tool];
  const badge = TOOL_BADGE[tool];
  const gradientId = useId();

  if (variant === "glyph") {
    return (
      <BrandSvg
        tool={tool}
        className={className}
        fill={`#${brand.hex}`}
      />
    );
  }

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-md shadow-sm ring-1 ring-black/5",
        className
      )}
      style={{
        backgroundColor: badge.background,
        borderColor: badge.border,
        borderWidth: badge.border ? 1 : undefined,
        borderStyle: badge.border ? "solid" : undefined,
      }}
      title={brand.title}
    >
      <BrandSvg
        tool={tool}
        className="h-[62%] w-[62%]"
        fill={badge.logoFill}
        gradientId={gradientId}
      />
    </span>
  );
}

export { BRAND_COLOR };
