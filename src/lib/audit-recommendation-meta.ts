import type { RecommendationType } from "@/types";

export const TYPE_DISPLAY: Record<
  RecommendationType,
  { label: string; description: string }
> = {
  downgrade: {
    label: "Same tool · Downgrade",
    description: "Move to a lower tier on the same vendor",
  },
  "switch-tool": {
    label: "Tool switch",
    description: "Consider an alternative product",
  },
  "optimize-seats": {
    label: "Seat optimization",
    description: "Adjust seats or plan minimums",
  },
  "right-sized": {
    label: "Already optimal",
    description: "No material change recommended",
  },
  "use-credits": {
    label: "Credit optimization",
    description: "Discounted infrastructure credits via Credex",
  },
};

export function getConfidenceLabel(type: RecommendationType): string {
  if (type === "right-sized") return "Verified";
  if (type === "use-credits") return "High confidence";
  if (type === "downgrade" || type === "optimize-seats") return "High confidence";
  return "Review plan fit";
}

export function getMigrationRiskLabel(type: RecommendationType): string {
  if (type === "right-sized") return "No change needed";
  if (type === "switch-tool") return "Moderate switch risk";
  if (type === "use-credits") return "Low migration friction";
  return "Low migration friction";
}
