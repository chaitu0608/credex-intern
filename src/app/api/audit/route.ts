import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";
import { generateAISummary } from "@/lib/anthropic";
import { runAudit } from "@/lib/auditEngine";
import { checkRateLimit, saveAudit } from "@/lib/supabase";
import type { AuditInput, AuditResult, UseCase } from "@/types";

const USE_CASES: UseCase[] = ["coding", "writing", "data", "research", "mixed"];

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

    if (body.website && body.website.trim() !== "") {
      return NextResponse.json({
        success: true,
        id: `fake-${nanoid(6)}`,
        totalMonthlySavings: 0,
        totalAnnualSavings: 0,
        isHighSavings: false,
      });
    }

    if (!body.tools?.length || body.teamSize < 1 || !USE_CASES.includes(body.useCase)) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    for (const tool of body.tools) {
      if (!tool.tool || !tool.plan || tool.monthlySpend < 0 || tool.seats < 1) {
        return NextResponse.json({ error: "Invalid tool entry" }, { status: 400 });
      }
    }

    const auditData = runAudit(body);
    const aiSummary = await generateAISummary(auditData, body);

    const audit: AuditResult = {
      ...auditData,
      id: nanoid(10),
      aiSummary,
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
