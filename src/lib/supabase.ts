import "server-only";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { allowsMemoryOnlyPersistence, isProductionRuntime } from "@/lib/runtime";
import type { AuditResult, LeadCapture, SummarySource } from "@/types";

function getPublicUrl(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
}

function getAnonKey(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";
}

function getServiceKey(): string {
  return process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? "";
}

export function isSupabaseConfigured(): boolean {
  return Boolean(getPublicUrl() && getAnonKey());
}

export function isSupabaseAdminConfigured(): boolean {
  return Boolean(getPublicUrl() && getServiceKey());
}

let supabaseClientMemo: SupabaseClient | null | undefined;
let supabaseAdminMemo: SupabaseClient | null | undefined;

/** Lazy-init public client (anon key). */
export function getSupabaseClient(): SupabaseClient | null {
  if (supabaseClientMemo === undefined) {
    supabaseClientMemo = isSupabaseConfigured()
      ? createClient(getPublicUrl(), getAnonKey())
      : null;
  }
  return supabaseClientMemo;
}

/** Lazy-init admin client (service role). Only use in API routes. */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (supabaseAdminMemo === undefined) {
    supabaseAdminMemo = isSupabaseAdminConfigured()
      ? createClient(getPublicUrl(), getServiceKey())
      : null;
  }
  return supabaseAdminMemo;
}

/** Dev fallback when Supabase is not configured */
const memoryAudits = new Map<string, AuditResult>();

type AuditRow = {
  id: string;
  input: AuditResult["input"];
  recommendations: AuditResult["recommendations"];
  total_monthly_savings: number;
  total_annual_savings: number;
  ai_summary: string | null;
  summary_source: string | null;
  is_high_savings: boolean;
  created_at: string;
};

function parseSummarySource(value: string | null | undefined): SummarySource {
  return value === "ai" ? "ai" : "template";
}

function rowToAudit(row: AuditRow): AuditResult {
  return {
    id: row.id,
    input: row.input,
    recommendations: row.recommendations,
    totalMonthlySavings: Number(row.total_monthly_savings),
    totalAnnualSavings: Number(row.total_annual_savings),
    aiSummary: row.ai_summary ?? "",
    summarySource: parseSummarySource(row.summary_source),
    isHighSavings: row.is_high_savings,
    createdAt: row.created_at,
  };
}

/**
 * Persist audit. When Supabase admin is configured, DB is source of truth.
 * Returns false if configured but insert failed.
 */
export async function saveAudit(audit: AuditResult): Promise<boolean> {
  memoryAudits.set(audit.id, audit);

  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) {
    if (isSupabaseConfigured() && !getServiceKey()) {
      console.warn(
        "Supabase URL/anon key set but SUPABASE_SERVICE_ROLE_KEY missing — audits will not persist across instances. Add service role key from Supabase → Settings → API."
      );
    } else {
      console.warn("Supabase not configured — audit kept in memory only");
    }
    return allowsMemoryOnlyPersistence();
  }

  const { error } = await supabaseAdmin.from("audits").insert({
    id: audit.id,
    input: audit.input,
    recommendations: audit.recommendations,
    total_monthly_savings: audit.totalMonthlySavings,
    total_annual_savings: audit.totalAnnualSavings,
    ai_summary: audit.aiSummary,
    summary_source: audit.summarySource,
    is_high_savings: audit.isHighSavings,
  });

  if (error) {
    console.error("saveAudit error:", error.message, error.details);
    return false;
  }

  return true;
}

export async function getAudit(id: string): Promise<AuditResult | null> {
  const supabaseClient = getSupabaseClient();
  if (supabaseClient) {
    const { data, error } = await supabaseClient
      .from("audits")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (!error && data) {
      const audit = rowToAudit(data as AuditRow);
      memoryAudits.set(id, audit);
      return audit;
    }

    if (error) {
      console.error("getAudit error:", error.message);
    }
  }

  return memoryAudits.get(id) ?? null;
}

export async function saveLead(lead: LeadCapture): Promise<boolean> {
  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) {
    if (isSupabaseConfigured()) {
      console.warn(
        "Supabase URL/anon set but SUPABASE_SERVICE_ROLE_KEY missing — leads will not persist."
      );
      return false;
    }
    console.warn("Supabase not configured — lead accepted but not persisted");
    return allowsMemoryOnlyPersistence();
  }

  const { error } = await supabaseAdmin.from("leads").insert({
    email: lead.email,
    company_name: lead.companyName ?? null,
    role: lead.role ?? null,
    team_size: lead.teamSize ?? null,
    audit_id: lead.auditId,
  });

  if (error) {
    console.error("saveLead error:", error.message);
    return false;
  }

  return true;
}

/** Max 10 audits per IP per hour. true = allowed. Fail-closed in production. */
type RateLimitRow = {
  count: number;
  window_start: string;
};

async function applyRateLimitForRow(
  supabaseAdmin: NonNullable<ReturnType<typeof getSupabaseAdmin>>,
  ip: string,
  data: RateLimitRow,
  now: Date,
  failClosed: boolean
): Promise<boolean> {
  const windowStart = new Date(data.window_start);
  const hoursElapsed =
    (now.getTime() - windowStart.getTime()) / (1000 * 60 * 60);

  if (hoursElapsed >= 1) {
    const { error } = await supabaseAdmin
      .from("rate_limits")
      .update({ count: 1, window_start: now.toISOString() })
      .eq("ip", ip);
    if (error) {
      console.error("checkRateLimit reset:", error.message);
      return !failClosed;
    }
    return true;
  }

  if (data.count >= 10) return false;

  const { error: updateError } = await supabaseAdmin
    .from("rate_limits")
    .update({ count: data.count + 1 })
    .eq("ip", ip);
  if (updateError) {
    console.error("checkRateLimit update:", updateError.message);
    return !failClosed;
  }
  return true;
}

export async function checkRateLimit(ip: string): Promise<boolean> {
  const supabaseAdmin = getSupabaseAdmin();
  const failClosed = isProductionRuntime();

  if (!supabaseAdmin) {
    return !failClosed;
  }

  try {
    const now = new Date();
    const { data, error: selectError } = await supabaseAdmin
      .from("rate_limits")
      .select("*")
      .eq("ip", ip)
      .maybeSingle();

    if (selectError) {
      console.error("checkRateLimit select:", selectError.message);
      return !failClosed;
    }

    if (!data) {
      const { error } = await supabaseAdmin.from("rate_limits").insert({
        ip,
        count: 1,
        window_start: now.toISOString(),
      });
      if (!error) return true;

      // Concurrent first request for this IP — retry read instead of failing closed.
      if (error.code === "23505") {
        const { data: raced, error: retrySelectError } = await supabaseAdmin
          .from("rate_limits")
          .select("*")
          .eq("ip", ip)
          .maybeSingle();
        if (retrySelectError || !raced) {
          console.error("checkRateLimit race retry:", retrySelectError?.message);
          return !failClosed;
        }
        return applyRateLimitForRow(
          supabaseAdmin,
          ip,
          raced as RateLimitRow,
          now,
          failClosed
        );
      }

      console.error("checkRateLimit insert:", error.message);
      return !failClosed;
    }

    return applyRateLimitForRow(
      supabaseAdmin,
      ip,
      data as RateLimitRow,
      now,
      failClosed
    );
  } catch (e) {
    console.error("checkRateLimit error:", e);
    return !failClosed;
  }
}
