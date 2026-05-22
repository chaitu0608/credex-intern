import { NextRequest, NextResponse } from "next/server";
import { buildAuditChatSystemPrompt } from "@/lib/audit-chat-context";
import { callOpenAI, type OpenAIChatMessage } from "@/lib/openai-client";
import { checkRateLimit, getAudit } from "@/lib/supabase";

const UNAVAILABLE_REPLY =
  "I can't reach the assistant right now. Your audit numbers above are still valid.";

const MAX_HISTORY = 12;
const MAX_CONTENT_LENGTH = 2000;

type ClientMessage = { role: "user" | "assistant"; content: string };

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

function isValidMessages(body: unknown): body is { messages: ClientMessage[] } {
  if (!body || typeof body !== "object") return false;
  const messages = (body as { messages?: unknown }).messages;
  if (!Array.isArray(messages) || messages.length === 0) return false;
  if (messages.length > MAX_HISTORY) return false;
  return messages.every(
    (m) =>
      m &&
      typeof m === "object" &&
      (m.role === "user" || m.role === "assistant") &&
      typeof m.content === "string" &&
      m.content.trim().length > 0 &&
      m.content.length <= MAX_CONTENT_LENGTH
  );
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ip = getClientIp(request);
    const allowed = await checkRateLimit(ip);
    if (!allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const auditId = params.id?.trim();
    if (!auditId) {
      return NextResponse.json({ error: "Invalid audit id" }, { status: 400 });
    }

    const audit = await getAudit(auditId);
    if (!audit) {
      return NextResponse.json({ error: "Audit not found" }, { status: 404 });
    }

    const body = await request.json();
    if (!isValidMessages(body)) {
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json({ reply: UNAVAILABLE_REPLY });
    }

    const systemPrompt = buildAuditChatSystemPrompt(audit);
    const openaiMessages: OpenAIChatMessage[] = [
      { role: "system", content: systemPrompt },
      ...body.messages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content.trim(),
      })),
    ];

    const reply = await callOpenAI(apiKey, openaiMessages, { maxTokens: 300 });

    return NextResponse.json({
      reply: reply ?? UNAVAILABLE_REPLY,
    });
  } catch (error) {
    console.error("POST /api/audit/[id]/chat error:", error);
    return NextResponse.json({ reply: UNAVAILABLE_REPLY });
  }
}
