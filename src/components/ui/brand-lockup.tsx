import Link from "next/link";
import { CredexMark } from "@/components/ui/credex-mark";
import { cn } from "@/lib/utils";

interface BrandLockupProps {
  className?: string;
  markSize?: "sm" | "md";
  href?: string;
  /** Hide SpendSense label on very narrow screens */
  compact?: boolean;
}

export function BrandLockup({
  className,
  markSize = "sm",
  href = "/",
  compact = false,
}: BrandLockupProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-w-0 max-w-full shrink-0 items-center gap-1.5 transition-opacity hover:opacity-90 sm:gap-2",
        className
      )}
    >
      <span
        className={cn(
          "font-display truncate text-base font-bold tracking-tight text-foreground sm:text-lg",
          compact && "max-[380px]:hidden"
        )}
      >
        SpendSense
      </span>
      <span
        className={cn(
          "shrink-0 text-xs text-muted-foreground",
          compact && "max-[380px]:hidden"
        )}
      >
        by
      </span>
      <CredexMark size={markSize} variant="lockup" />
    </Link>
  );
}
