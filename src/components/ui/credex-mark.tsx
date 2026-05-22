import { CredexIcon } from "@/components/ui/credex-icon";
import { cn } from "@/lib/utils";

/** credex.rocks forest green */
export const CREDEX_BRAND_GREEN = "#1a3d2e";

interface CredexMarkProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  /** lockup: green tile + beam + icon + wordmark; icon: mark on green tile; wordmark: text only */
  variant?: "lockup" | "icon" | "wordmark";
}

const sizeMap = {
  sm: {
    tile: "h-7 gap-1.5 rounded-md px-2",
    icon: "h-3.5 w-3.5",
    word: "text-[13px]",
  },
  md: {
    tile: "h-8 gap-2 rounded-md px-2.5",
    icon: "h-4 w-4",
    word: "text-sm",
  },
  lg: {
    tile: "h-10 gap-2.5 rounded-lg px-3",
    icon: "h-5 w-5",
    word: "text-base",
  },
};

function CredexWordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-sans font-bold lowercase leading-none tracking-tight text-white",
        className
      )}
    >
      credex
    </span>
  );
}

function CredexBeam() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.14] via-white/[0.04] to-transparent"
    />
  );
}

export function CredexMark({
  className,
  size = "sm",
  variant = "lockup",
}: CredexMarkProps) {
  const s = sizeMap[size];

  if (variant === "wordmark") {
    return (
      <span
        className={cn(
          "inline-flex shrink-0 items-center font-sans font-bold lowercase leading-none tracking-tight text-foreground",
          s.word,
          className
        )}
      >
        credex
      </span>
    );
  }

  if (variant === "icon") {
    return (
      <span
        className={cn(
          "relative inline-flex shrink-0 items-center justify-center overflow-hidden bg-[#1a3d2e]",
          s.tile,
          "aspect-square px-0",
          className
        )}
      >
        <CredexBeam />
        <CredexIcon className={cn("relative text-white", s.icon)} />
      </span>
    );
  }

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center overflow-hidden bg-[#1a3d2e] text-white",
        s.tile,
        className
      )}
    >
      <CredexBeam />
      <CredexIcon className={cn("relative text-white", s.icon)} />
      <CredexWordmark className={cn("relative", s.word)} />
    </span>
  );
}
