import Link from "next/link";
import { CredexMark } from "@/components/ui/credex-mark";
import { cn } from "@/lib/utils";

interface BrandLockupProps {
  className?: string;
  markSize?: "sm" | "md";
  href?: string;
}

export function BrandLockup({
  className,
  markSize = "sm",
  href = "/",
}: BrandLockupProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex shrink-0 items-center gap-2 transition-opacity hover:opacity-90",
        className
      )}
    >
      <span className="font-display text-lg font-bold tracking-tight text-foreground">
        SpendSense
      </span>
      <span className="text-xs text-muted-foreground">by</span>
      <CredexMark size={markSize} />
    </Link>
  );
}
