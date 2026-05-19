import { cn } from "@/lib/utils";

/** Token-aware grid — works in light and dark */
export function GridBackground({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 -z-10 h-full w-full bg-background",
        "[background-image:linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)]",
        "[background-size:4rem_4rem]",
        "[mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]",
        className
      )}
      aria-hidden
    />
  );
}
