import { cn } from "@/lib/utils";

interface CredexMarkProps {
  className?: string;
  size?: "sm" | "md";
}

/** Placeholder Credex logo — swap inner SVG when brand asset is available */
export function CredexMark({ className, size = "sm" }: CredexMarkProps) {
  const dim = size === "md" ? "h-6 w-6 text-xs" : "h-5 w-5 text-[10px]";

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-md border border-border bg-muted font-bold text-foreground",
        dim,
        className
      )}
      aria-label="Credex"
      role="img"
    >
      C
    </span>
  );
}
