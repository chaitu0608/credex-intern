import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "strong" | "glow";
  children: React.ReactNode;
}

export function GlassCard({
  className,
  variant = "default",
  children,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl",
        variant === "strong" && "glass-strong",
        variant === "default" && "glass",
        variant === "glow" && "glass glow-ring",
        className
      )}
      {...props}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent"
        aria-hidden
      />
      <div className="relative">{children}</div>
    </div>
  );
}
