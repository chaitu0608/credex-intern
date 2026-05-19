/** Supported AI tool identifiers */
export type AITool =
  | "cursor"
  | "github-copilot"
  | "claude"
  | "chatgpt"
  | "anthropic-api"
  | "openai-api"
  | "gemini"
  | "windsurf";

/** Primary team use case for audit recommendations */
export type UseCase = "coding" | "writing" | "data" | "research" | "mixed";

/** One tool row from the spend form */
export interface ToolEntry {
  tool: AITool;
  plan: string;
  /** What the user is currently paying per month */
  monthlySpend: number;
  seats: number;
}

/** Full audit form submission */
export interface AuditInput {
  tools: ToolEntry[];
  teamSize: number;
  useCase: UseCase;
  /** Honeypot — should always be empty */
  website?: string;
}

export type RecommendationType =
  | "downgrade"
  | "switch-tool"
  | "right-sized"
  | "optimize-seats"
  | "use-credits";

/** Per-tool audit recommendation */
export interface ToolRecommendation {
  tool: AITool;
  toolName: string;
  currentPlan: string;
  currentSpend: number;
  recommendedAction: string;
  recommendationType: RecommendationType;
  savings: number;
  annualSavings: number;
  reason: string;
  alternativeTool?: string;
}

/** Complete audit result stored and displayed */
export interface AuditResult {
  id: string;
  input: AuditInput;
  recommendations: ToolRecommendation[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  aiSummary: string;
  createdAt: string;
  /** true when totalMonthlySavings > 500 */
  isHighSavings: boolean;
}

/** Lead capture after audit */
export interface LeadCapture {
  email: string;
  companyName?: string;
  role?: string;
  teamSize?: number;
  auditId: string;
  /** Honeypot — should always be empty */
  phone?: string;
}

/** Pricing plan metadata */
export interface PricingPlan {
  price: number | null;
  name: string;
  pricePerSeat: boolean;
  minSeats?: number;
}
