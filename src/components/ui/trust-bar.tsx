import { Check } from "lucide-react";

const ITEMS = [
  "Takes under 2 minutes",
  "No login required",
  "Defensible savings math",
  "Shareable audit link",
  "Email report optional",
  "Built by Credex",
];

export function TrustBar() {
  return (
    <div className="mt-10 overflow-hidden border-y border-stone-200/80 bg-white/50 py-3">
      <div className="flex animate-[marquee_30s_linear_infinite] gap-8 whitespace-nowrap">
        {[...ITEMS, ...ITEMS].map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Check className="h-3 w-3" strokeWidth={3} />
            </span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
