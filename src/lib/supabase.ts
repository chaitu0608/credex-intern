import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { AuditResult, LeadCapture } from "@/types";

function getPublicUrl(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
}

function getAnonKey(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
}

function getServiceKey(): string {
  return process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
}

function isConfigured(): boolean {
  return Boolean(getPublicUrl() && getAnonKey());
}

export const supabaseClient: SupabaseClient | null = isConfigured()
  ? createClient(getPublicUrl(), getAnonKey())
  : null;

// Only use in API routes, never in client components
export const supabaseAdmin: SupabaseClient | null =
  isConfigured() && getServiceKey()
    ? createClient(getPublicUrl(), getServiceKey())
    : null;

/** Local fallback when Supabase env vars are not set (dev / first deploy) */
const memoryAudits = new Map<string, AuditResult>();

type AuditRow = {
  id: string;
  input: AuditResult["input"];
  recommendations: AuditResult["recommendations"];
  total_monthly_savings: number;
  total_annual_savings: number;
  ai_summary: string | null;
  is_high_savings: boolean;
  created_at: string;
};

function rowToAudit(row: AuditRow): AuditResult {
  return {
    id: row.id,
    input: row.input,
    recommendations: row.recommendations,
    totalMonthlySavings: Number(row.total_monthly_savings),
    totalAnnualSavings: Number(row.total_annual_savings),
    aiSummary: row.ai_summary ?? "",
    isHighSavings: row.is_high_savings,
    createdAt: row.created_at,
  };
}

export async function saveAudit(audit: AuditResult): Promise<void> {
  memoryAudits.set(audit.id, audit);

  if (!supabaseAdmin) {
    console.warn("Supabase admin not configured — audit kept in memory only");
    return;
  }

  const { error } = await supabaseAdmin.from("audits").insert({
    id: audit.id,
    input: audit.input,
    recommendations: audit.recommendations,
    total_monthly_savings: audit.totalMonthlySavings,
    total_annual_savings: audit.totalAnnualSavings,
    ai_summary: audit.aiSummary,
    is_high_savings: audit.isHighSavings,
  });

  if (error) console.error("saveAudit error:", error.message);
}

export async function getAudit(id: string): Promise<AuditResult | null> {
  const cached = memoryAudits.get(id);
  if (cached) return cached;

  if (!supabaseClient) return null;

  const { data, error } = await supabaseClient
    .from("audits")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return rowToAudit(data as AuditRow);
}

export async function saveLead(lead: LeadCapture): Promise<void> {
  if (!supabaseAdmin) {
    console.warn("Supabase admin not configured — lead not persisted");
    return;
  }

  const { error } = await supabaseAdmin.from("leads").insert({
    email: lead.email,
    company_name: lead.companyName ?? null,
    role: lead.role ?? null,
    team_size: lead.teamSize ?? null,
    audit_id: lead.auditId,
  });

  if (error) console.error("saveLead error:", error.message);
}

/** Max 10 audits per IP per hour. true = allowed. Fail open on errors. */
export async function checkRateLimit(ip: string): Promise<boolean> {
  if (!supabaseAdmin) return true;

  try {
    const now = new Date();
    const { data } = await supabaseAdmin
      .from("rate_limits")
      .select("*")
      .eq("ip", ip)
      .maybeSingle();

    if (!data) {
      await supabaseAdmin.from("rate_limits").insert({ ip, count: 1, window_start: now.toISOString() });
      return true;
    }

    const windowStart = new Date(data.window_start as string);
    const hoursElapsed =
      (now.getTime() - windowStart.getTime()) / (1000 * 60 * 60);

    if (hoursElapsed >= 1) {
      await supabaseAdmin
        .from("rate_limits")
        .update({ count: 1, window_start: now.toISOString() })
        .eq("ip", ip);
      return true;
    }

    if ((data.count as number) >= 10) return false;

    await supabaseAdmin
      .from("rate_limits")
      .update({ count: (data.count as number) + 1 })
      .eq("ip", ip);
    return true;
  } catch (e) {
    console.error("checkRateLimit error:", e);
    return true;
  }
}
