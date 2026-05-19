import { cn } from "@/lib/utils";

/** Light grid background — Credex.rocks style */
export function GridBackground({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 -z-10 h-full w-full bg-[#FAFAF9]",
        "[background-image:linear-gradient(to_right,#e7e5e4_1px,transparent_1px),linear-gradient(to_bottom,#e7e5e4_1px,transparent_1px)]",
        "[background-size:4rem_4rem]",
        "[mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_85%)]",
        className
      )}
      aria-hidden
    />
  );
}
