import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";
import { generateAISummary } from "@/lib/ai-summary";
import { runAudit } from "@/lib/auditEngine";
import { checkRateLimit, saveAudit } from "@/lib/supabase";
import {
  isHoneypotTriggered,
  toPersistedAuditInput,
  validateAuditInput,
} from "@/lib/validation";
import type { AuditInput, AuditResult } from "@/types";

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const allowed = await checkRateLimit(ip);
    if (!allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = (await request.json()) as AuditInput;

    if (isHoneypotTriggered(body.website)) {
      return NextResponse.json({
        success: true,
        id: `fake-${nanoid(6)}`,
        totalMonthlySavings: 0,
        totalAnnualSavings: 0,
        isHighSavings: false,
      });
    }

    const validation = validateAuditInput(body);
    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const persisted = toPersistedAuditInput(body);
    const auditData = runAudit(persisted);
    const { summary, source } = await generateAISummary(auditData, persisted);

    const audit: AuditResult = {
      ...auditData,
      input: persisted,
      id: nanoid(10),
      aiSummary: summary,
      summarySource: source,
      createdAt: new Date().toISOString(),
    };

    const saved = await saveAudit(audit);
    if (!saved) {
      return NextResponse.json(
        {
          error:
            "Could not save audit. Check Supabase env vars and that schema.sql was applied.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      id: audit.id,
      totalMonthlySavings: audit.totalMonthlySavings,
      totalAnnualSavings: audit.totalAnnualSavings,
      isHighSavings: audit.isHighSavings,
    });
  } catch (error) {
    console.error("POST /api/audit error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
