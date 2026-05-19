"use client";

import { cn } from "@/lib/utils";

export function GridPattern({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 -z-[9] animate-grid",
        "[background-image:linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)]",
        "[background-size:48px_48px]",
        "[mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]",
        className
      )}
      aria-hidden
    />
  );
}
