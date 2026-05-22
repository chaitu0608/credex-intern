import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  "Takes under 3 minutes",
  "No login required",
  "Defensible savings math",
  "Shareable audit link",
  "Email after you see value",
  "Powered by Credex",
];

interface TrustBarProps {
  className?: string;
}

export function TrustBar({ className }: TrustBarProps) {
  return (
    <div
      className={cn(
        "max-w-full overflow-hidden border-y border-border bg-card/40 py-3",
        className
      )}
    >
      <div className="flex animate-[marquee_30s_linear_infinite] gap-8 whitespace-nowrap">
        {[...ITEMS, ...ITEMS].map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground"
          >
            <span className="flex h-4 w-4 items-center justify-center rounded-sm border border-border bg-muted">
              <Check className="h-2.5 w-2.5" strokeWidth={3} />
            </span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
