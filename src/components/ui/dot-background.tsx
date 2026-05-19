import { cn } from "@/lib/utils";

/** Subtle Aceternity-style dot grid */
export function DotBackground({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 -z-10 h-full w-full",
        "[background-image:radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)]",
        "[background-size:24px_24px]",
        "[mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]",
        className
      )}
      aria-hidden
    />
  );
}
