import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getAudit, saveLead } from "@/lib/supabase";
import { isHoneypotTriggered, validateLeadInput } from "@/lib/validation";
import type { LeadCapture } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as LeadCapture & {
      companyName?: string;
    };

    if (isHoneypotTriggered(body.phone)) {
      return NextResponse.json({ success: true });
    }

    const validation = validateLeadInput(body);
    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const audit = await getAudit(body.auditId);
    if (!audit) {
      return NextResponse.json({ error: "Audit not found" }, { status: 400 });
    }

    await saveLead({
      email: body.email,
      companyName: body.companyName,
      role: body.role,
      teamSize: body.teamSize,
      auditId: body.auditId,
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const shareUrl = `${appUrl}/audit/${audit.id}`;
    const savings = audit.totalMonthlySavings;

    const subject =
      savings > 0
        ? `Your AI Spend Audit — $${savings}/mo savings found`
        : "Your AI Spend Audit — Stack optimized";

    let text = `Thanks for saving your audit.\n\nView your report: ${shareUrl}\n\n`;
    if (savings > 0) {
      text += `Potential savings: $${savings}/month ($${audit.totalAnnualSavings}/year).\n`;
    } else {
      text += "Your stack looks well-optimized based on current inputs.\n";
    }
    if (audit.isHighSavings) {
      text +=
        "\nCredex may reach out to help you capture additional savings through discounted AI infrastructure credits.\n";
    }

    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      try {
        const resend = new Resend(resendKey);
        await resend.emails.send({
          from: "onboarding@resend.dev",
          to: body.email,
          subject,
          text,
        });
      } catch (emailError) {
        console.error("Resend error:", emailError);
      }
    }

    return NextResponse.json({ success: true, emailSent: Boolean(resendKey) });
  } catch (error) {
    console.error("POST /api/leads error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
