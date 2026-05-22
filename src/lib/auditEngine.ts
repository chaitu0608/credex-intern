import {
  calculateCurrentCost,
  getMinSeats,
  getPlanPrice,
  PRICING,
  TOOL_NAMES,
} from "@/lib/pricing";
import type {
  AuditInput,
  AuditResult,
  RecommendationType,
  ToolEntry,
  ToolRecommendation,
} from "@/types";

/** Threshold for Credex high-savings CTA — used across engine, UI, and metadata */
export const HIGH_SAVINGS_THRESHOLD_MONTHLY = 500;
export const HONEST_PATH_MAX_MONTHLY = 100;

function buildRecommendation(
  entry: ToolEntry,
  recommendedAction: string,
  recommendationType: RecommendationType,
  savings: number,
  reason: string,
  alternativeTool?: string
): ToolRecommendation {
  const safeSavings = Math.max(0, savings);
  return {
    tool: entry.tool,
    toolName: TOOL_NAMES[entry.tool],
    currentPlan: entry.plan,
    currentSpend: entry.monthlySpend,
    recommendedAction,
    recommendationType,
    savings: safeSavings,
    annualSavings: safeSavings * 12,
    reason,
    alternativeTool,
  };
}

function optimal(entry: ToolEntry, reason: string): ToolRecommendation {
  return buildRecommendation(
    entry,
    "Keep current plan",
    "right-sized",
    0,
    reason
  );
}

/** Cap savings at list/catalog spend so we never exceed defensible pricing. */
function savingsCapFromListPrice(entry: ToolEntry): number {
  const catalog = calculateCurrentCost(entry.tool, entry.plan, entry.seats);
  if (catalog !== null) {
    return Math.min(entry.monthlySpend, catalog);
  }
  const unit = getPlanPrice(entry.tool, entry.plan);
  if (unit === null) return entry.monthlySpend;
  const perSeat = PRICING[entry.tool]?.[entry.plan]?.pricePerSeat;
  const estimated = perSeat ? unit * entry.seats : unit;
  return Math.min(entry.monthlySpend, estimated);
}

function isDirectApiTool(entry: ToolEntry): boolean {
  return (
    entry.tool === "anthropic-api" ||
    entry.tool === "openai-api" ||
    (entry.tool === "gemini" && entry.plan === "api") ||
    (entry.tool === "claude" && entry.plan === "api") ||
    (entry.tool === "chatgpt" && entry.plan === "api")
  );
}

function analyzeToolEntry(
  entry: ToolEntry,
  input: AuditInput
): ToolRecommendation {
  const { teamSize, useCase } = input;
  const currentSpend = entry.monthlySpend;
  const seats = entry.seats;
  const catalogCost = calculateCurrentCost(entry.tool, entry.plan, seats);

  // STEP 1 — Seat optimization
  if (entry.tool === "claude" && entry.plan === "team") {
    const teamCost = calculateCurrentCost("claude", "team", seats) ?? 0;
    const proCost = calculateCurrentCost("claude", "pro", teamSize) ?? 0;
    if (teamSize < getMinSeats("claude", "team") && teamCost > proCost) {
      return buildRecommendation(
        entry,
        `Switch to Claude Pro for ${teamSize} seat(s)`,
        "optimize-seats",
        teamCost - proCost,
        `Claude Team requires 5 seats ($${teamCost}/mo at list). Your team of ${teamSize} fits Pro at $20/seat ($${proCost}/mo) — save $${teamCost - proCost}/mo.`
      );
    }
  }

  if (entry.tool === "chatgpt" && entry.plan === "team" && teamSize === 1) {
    const teamCost = calculateCurrentCost("chatgpt", "team", seats) ?? 50;
    const plusCost = calculateCurrentCost("chatgpt", "plus", 1) ?? 20;
    if (teamCost > plusCost) {
      return buildRecommendation(
        entry,
        "Switch to ChatGPT Plus",
        "optimize-seats",
        teamCost - plusCost,
        `ChatGPT Team ($${teamCost}/mo, 2-seat minimum) is overkill for 1 user. Plus is $${plusCost}/mo — save $${teamCost - plusCost}/mo.`
      );
    }
  }

  if (
    entry.tool === "github-copilot" &&
    entry.plan === "enterprise" &&
    teamSize < 10
  ) {
    const entCost = calculateCurrentCost("github-copilot", "enterprise", seats) ?? 0;
    const bizCost = calculateCurrentCost("github-copilot", "business", seats) ?? 0;
    if (entCost > bizCost) {
      return buildRecommendation(
        entry,
        "Downgrade to GitHub Copilot Business",
        "optimize-seats",
        entCost - bizCost,
        `Enterprise ($39/seat) vs Business ($19/seat) for a ${teamSize}-person team — save $${entCost - bizCost}/mo ($${(entCost - bizCost) * 12}/yr).`
      );
    }
  }

  // STEP 2 — Same-vendor downgrade
  if (
    entry.tool === "claude" &&
    entry.plan === "max" &&
    ["writing", "research", "mixed"].includes(useCase)
  ) {
    const maxCost = calculateCurrentCost("claude", "max", seats) ?? 100;
    const proCost = calculateCurrentCost("claude", "pro", seats) ?? 20;
    if (maxCost > proCost) {
      return buildRecommendation(
        entry,
        "Downgrade to Claude Pro",
        "downgrade",
        maxCost - proCost,
        `Claude Max ($${maxCost}/mo) is built for power users. For ${useCase} work, Pro ($${proCost}/mo) covers most teams — save $${maxCost - proCost}/mo.`
      );
    }
  }

  if (entry.tool === "cursor" && entry.plan === "business" && seats <= 1) {
    const bizCost = calculateCurrentCost("cursor", "business", seats) ?? 40;
    const proCost = calculateCurrentCost("cursor", "pro", 1) ?? 20;
    if (bizCost > proCost) {
      return buildRecommendation(
        entry,
        "Downgrade to Cursor Pro",
        "downgrade",
        bizCost - proCost,
        `Cursor Business ($40/seat) adds org controls you may not need solo. Pro is $20/mo — save $${bizCost - proCost}/mo.`
      );
    }
  }

  if (entry.tool === "gemini" && entry.plan === "ultra" && teamSize === 1) {
    const ultraCost = calculateCurrentCost("gemini", "ultra", 1) ?? 199.99;
    const proCost = calculateCurrentCost("gemini", "pro", 1) ?? 20;
    if (ultraCost > proCost) {
      return buildRecommendation(
        entry,
        "Downgrade to Gemini Pro",
        "downgrade",
        ultraCost - proCost,
        `Gemini Ultra ($${ultraCost}/mo) is for heavy single-user workflows. Pro ($${proCost}/mo) fits a solo ${useCase} setup — save $${ultraCost - proCost}/mo.`
      );
    }
  }

  if (
    entry.tool === "gemini" &&
    entry.plan === "ultra" &&
    ["writing", "research", "mixed"].includes(useCase)
  ) {
    const ultraCost = calculateCurrentCost("gemini", "ultra", seats) ?? 199.99;
    const proCost = calculateCurrentCost("gemini", "pro", seats) ?? 20;
    if (ultraCost > proCost) {
      return buildRecommendation(
        entry,
        "Downgrade to Gemini Pro",
        "downgrade",
        ultraCost - proCost,
        `Gemini Ultra ($${ultraCost}/mo) targets power users. For ${useCase} work, Pro ($${proCost}/mo) covers most teams — save $${ultraCost - proCost}/mo.`
      );
    }
  }

  // STEP 3 — Cross-tool alternatives (use-case based)
  if (useCase === "coding") {
    if (
      entry.tool === "github-copilot" &&
      entry.plan === "business" &&
      seats >= 5
    ) {
      const current = currentSpend;
      const windsurfCost =
        calculateCurrentCost("windsurf", "pro", seats) ?? 20 * seats;
      if (current > windsurfCost) {
        return buildRecommendation(
          entry,
          "Evaluate Windsurf Pro for coding",
          "switch-tool",
          current - windsurfCost,
          `Copilot Business ($${current}/mo) vs Windsurf Pro ($20/seat = $${windsurfCost}/mo) for pure coding — potential $${current - windsurfCost}/mo savings.`,
          "Windsurf"
        );
      }
    }
  }

  if (useCase === "research" && entry.tool === "chatgpt" && entry.plan === "team") {
    const teamCost = calculateCurrentCost("chatgpt", "team", seats) ?? 50;
    const claudePro = calculateCurrentCost("claude", "pro", seats) ?? 20;
    if (teamCost > claudePro) {
      return buildRecommendation(
        entry,
        "Consider Claude Pro for research",
        "switch-tool",
        teamCost - claudePro,
        `ChatGPT Team ($${teamCost}/mo) vs Claude Pro ($${claudePro}/mo) for research workflows — save $${teamCost - claudePro}/mo per seat tier.`,
        "Claude"
      );
    }
  }

  if (isDirectApiTool(entry)) {
    const credexHint =
      currentSpend >= 500
        ? " At this spend level, Credex discounted infrastructure credits may beat retail API rates — request a quote."
        : "";
    return buildRecommendation(
      entry,
      "Benchmark API usage vs flat plans",
      "use-credits",
      0,
      `Direct ${TOOL_NAMES[entry.tool]} billing ($${currentSpend}/mo reported) is usage-based — export the last 30 days of token usage and compare to any flat ${useCase} subscriptions before switching vendors.${credexHint}`
    );
  }

  if (useCase === "data" && getPlanPrice(entry.tool, entry.plan) !== null) {
    const flat = catalogCost ?? currentSpend;
    if (flat > 0 && entry.plan !== "api") {
      return buildRecommendation(
        entry,
        "Evaluate API-direct pricing",
        "use-credits",
        0,
        `For intermittent ${useCase} work, flat ${TOOL_NAMES[entry.tool]} ${entry.plan} ($${flat}/mo list) may exceed pay-as-you-go API spend — benchmark last 30 days of token usage.`
      );
    }
  }

  // High spend — Credex credits path.
  // We do NOT claim a fixed %. Credex quotes per stack; we surface this only
  // when the user is paying close to list and the spend is large enough to
  // justify a conversation.
  if (currentSpend >= 200 && getPlanPrice(entry.tool, entry.plan) !== null) {
    const estRetail = catalogCost ?? currentSpend;
    if (currentSpend > estRetail * 0.9) {
      return buildRecommendation(
        entry,
        "Ask Credex for a discounted credit quote",
        "use-credits",
        0,
        `At ~$${currentSpend}/mo on list pricing (catalog ≈ $${estRetail}/mo), you are likely paying full retail. Credex sources discounted credits from companies that overforecast — savings vary by stack; book a quote to see the exact number.`
      );
    }
  }

  const catalogNote =
    catalogCost !== null && currentSpend > catalogCost * 1.1
      ? ` You report $${currentSpend}/mo vs ~$${catalogCost}/mo list — verify billing.`
      : "";

  return optimal(
    entry,
    `No stronger same-vendor or alternative move for ${useCase} at this spend.${catalogNote}`
  );
}

/**
 * Detect Cursor + GitHub Copilot overlap for coding teams.
 * Both tools cover IDE assistance; very few teams genuinely need both seats.
 * Drop the lower-spend one as the recommendation target.
 */
function analyzeCursorCopilotOverlap(
  input: AuditInput
): ToolRecommendation | null {
  if (input.useCase !== "coding" && input.useCase !== "mixed") return null;

  const cursor = input.tools.find((t) => t.tool === "cursor");
  const copilot = input.tools.find((t) => t.tool === "github-copilot");
  if (!cursor || !copilot) return null;

  const cheaper =
    cursor.monthlySpend <= copilot.monthlySpend ? cursor : copilot;
  const keeper =
    cursor.monthlySpend <= copilot.monthlySpend ? copilot : cursor;

  if (cheaper.monthlySpend <= 0) return null;

  return buildRecommendation(
    cheaper,
    `Pick one IDE assistant — drop ${TOOL_NAMES[cheaper.tool]}, keep ${TOOL_NAMES[keeper.tool]}`,
    "switch-tool",
    cheaper.monthlySpend,
    `${TOOL_NAMES[cursor.tool]} ($${cursor.monthlySpend}/mo) and ${TOOL_NAMES[copilot.tool]} ($${copilot.monthlySpend}/mo) both cover in-editor AI assist. Most coding teams standardise on one — save $${cheaper.monthlySpend}/mo by dropping the lower-usage seat.`,
    TOOL_NAMES[keeper.tool]
  );
}

/** Detect duplicate flat plans for writing use case across stack */
function analyzeWritingDuplicates(input: AuditInput): ToolRecommendation[] {
  if (input.useCase !== "writing" && input.useCase !== "mixed") return [];

  const flatAssistants = input.tools.filter(
    (t) =>
      (t.tool === "claude" && ["pro", "max"].includes(t.plan)) ||
      (t.tool === "chatgpt" && ["plus", "team"].includes(t.plan)) ||
      (t.tool === "gemini" && ["pro", "ultra"].includes(t.plan))
  );

  if (flatAssistants.length < 2) return [];

  const sorted = [...flatAssistants].sort((a, b) => a.monthlySpend - b.monthlySpend);
  const toDrop = sorted[0];
  const keeper = sorted[sorted.length - 1];
  const savings = savingsCapFromListPrice(toDrop);

  return [
    buildRecommendation(
      toDrop,
      `Consolidate writing tools — drop duplicate ${TOOL_NAMES[toDrop.tool]}`,
      "switch-tool",
      savings,
      `You pay for ${flatAssistants.length} writing assistants. Most teams standardize on one — save ~$${savings}/mo by dropping ${TOOL_NAMES[toDrop.tool]} and keeping ${TOOL_NAMES[keeper.tool]}.`,
      TOOL_NAMES[keeper.tool]
    ),
  ];
}

export function runAudit(
  input: AuditInput
): Omit<AuditResult, "id" | "aiSummary" | "summarySource" | "createdAt"> {
  const perTool = input.tools.map((entry) => analyzeToolEntry(entry, input));
  const duplicateRecs = analyzeWritingDuplicates(input);
  const overlapRec = analyzeCursorCopilotOverlap(input);

  const recommendations = [...perTool];

  const upserts: ToolRecommendation[] = [...duplicateRecs];
  if (overlapRec) upserts.push(overlapRec);

  for (const rec of upserts) {
    const idx = recommendations.findIndex((r) => r.tool === rec.tool);
    if (idx >= 0 && recommendations[idx].savings < rec.savings) {
      recommendations[idx] = rec;
    }
  }

  const totalMonthlySavings = recommendations.reduce(
    (sum, r) => sum + r.savings,
    0
  );

  return {
    input,
    recommendations,
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
    isHighSavings: totalMonthlySavings > HIGH_SAVINGS_THRESHOLD_MONTHLY,
  };
}

export function generateAuditSummaryPrompt(
  result: Omit<AuditResult, "aiSummary" | "summarySource" | "id" | "createdAt">,
  input: AuditInput
): string {
  const top = [...result.recommendations]
    .filter((r) => r.savings > 0)
    .sort((a, b) => b.savings - a.savings)
    .slice(0, 2);

  const topText =
    top.length > 0
      ? top.map((r) => `${r.toolName}: ${r.recommendedAction} ($${r.savings}/mo)`).join("; ")
      : "stack appears well-optimized";

  const credexNote = result.isHighSavings
    ? " Mention Credex discounted infrastructure credits as an option to capture additional savings."
    : "";

  return `Write a ~100-word paragraph for a startup ${input.useCase} team of ${input.teamSize}.
Total potential savings: $${result.totalMonthlySavings}/month ($${result.totalAnnualSavings}/year).
Top recommendations: ${topText}.
Tone: direct, CFO-style, no bullets, no hype.${credexNote}`;
}
