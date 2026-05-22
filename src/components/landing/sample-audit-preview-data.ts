import type { AITool, RecommendationType } from "@/types";

export type SampleRecommendation = {
  tool: AITool;
  toolName: string;
  recommendationType: RecommendationType;
  currentPlan: string;
  currentSpend: number;
  seats: number;
  recommendedAction: string;
  savings: number;
  annualSavings: number;
  reasoning: string;
};

export const SAMPLE_AUDIT_PREVIEW = {
  monthlySpend: 580,
  monthlySavings: 120,
  annualSavings: 1440,
  savingsPercent: 21,
  optimizationScore: 79,
  teamContext: "2-person engineering team",
  recommendations: [
    {
      tool: "cursor",
      toolName: "Cursor",
      recommendationType: "downgrade",
      currentPlan: "business",
      currentSpend: 80,
      seats: 2,
      recommendedAction: "Downgrade to Pro ($20/user)",
      savings: 20,
      annualSavings: 240,
      reasoning:
        "Business collaboration features may be unnecessary for a 2-person engineering team.",
    },
    {
      tool: "claude",
      toolName: "Claude",
      recommendationType: "downgrade",
      currentPlan: "team",
      currentSpend: 150,
      seats: 5,
      recommendedAction: "Downgrade to Pro ($20/user)",
      savings: 70,
      annualSavings: 840,
      reasoning:
        "Team minimum seats exceed your headcount — Pro covers both users without unused seat cost.",
    },
    {
      tool: "chatgpt",
      toolName: "ChatGPT",
      recommendationType: "optimize-seats",
      currentPlan: "team",
      currentSpend: 90,
      seats: 3,
      recommendedAction: "Remove 1 duplicate seat",
      savings: 30,
      annualSavings: 360,
      reasoning:
        "One paid seat appears unused based on team size — consolidate to two active licenses.",
    },
  ] satisfies SampleRecommendation[],
} as const;

export const WHAT_SPENDSENSE_DOES =
  "SpendSense reviews your AI subscriptions—tools, plans, seats, and monthly spend—and compares them to public vendor pricing for your team size. You get an instant, shareable report with specific downgrades, seat fixes, and savings math finance can trust.";

export const SAMPLE_PREVIEW_SECTION = {
  dialogTitle: "Example AI spend audit",
  eyebrow: "Example report",
  title: "See what your audit could uncover",
  description:
    "Rule-based recommendations with vendor pricing sources — each line item shows current spend, a defensible change, and monthly savings you can explain to finance.",
  disclaimer:
    "Illustrative example only — recommendations depend on your actual usage and team structure.",
  ctaLabel: "Run Your Free Audit →",
  ctaHref: "/#audit-form",
  viewExampleLabel: "View example report",
  trustPoints: [
    "Vendor pricing verified",
    "Per-seat math shown",
    "No login required",
  ],
} as const;
