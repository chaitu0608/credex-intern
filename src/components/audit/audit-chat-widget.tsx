"use client";

import { useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const MAX_USER_TURNS = 6;

const STARTER_PROMPTS = [
  "What should I do first?",
  "Why is Credex mentioned?",
  "Is my stack already optimal?",
] as const;

type ChatRole = "user" | "assistant";

type ChatMessage = {
  role: ChatRole;
  content: string;
};

interface AuditChatWidgetProps {
  auditId: string;
}

export default function AuditChatWidget({ auditId }: AuditChatWidgetProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Ask me about this audit — I'll explain the recommendations and savings using only what's in your report.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [userTurns, setUserTurns] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const atLimit = userTurns >= MAX_USER_TURNS;

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
  };

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading || atLimit) return;

    const userMsg: ChatMessage = { role: "user", content: trimmed };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setUserTurns((n) => n + 1);
    setLoading(true);
    scrollToBottom();

    try {
      const payload = nextMessages.slice(1).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch(`/api/audit/${auditId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payload }),
      });

      const data = (await res.json()) as { reply?: string; error?: string };
      const reply =
        data.reply ??
        (res.status === 429
          ? "Too many requests — try again in a bit."
          : "I can't reach the assistant right now. Your audit numbers above are still valid.");

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I can't reach the assistant right now. Your audit numbers above are still valid.",
        },
      ]);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void sendMessage(input);
  };

  return (
    <>
      {open && (
        <div
          data-audit-chat
          className={cn(
            "fixed z-40 flex flex-col rounded-lg border border-border bg-card shadow-lg",
            "bottom-20 right-4 w-[min(320px,calc(100vw-2rem))] max-h-[420px]",
            "sm:bottom-24 sm:right-6"
          )}
          role="dialog"
          aria-label="Audit assistant chat"
        >
          <div className="flex items-center justify-between border-b border-border px-3 py-2">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Ask about this audit
            </p>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="h-7 w-7"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div
            ref={listRef}
            className="flex-1 space-y-3 overflow-y-auto px-3 py-3 text-sm"
          >
            {messages.map((msg, i) => (
              <div
                key={`${msg.role}-${i}`}
                className={cn(
                  "rounded-md px-3 py-2 leading-relaxed",
                  msg.role === "user"
                    ? "ml-6 bg-muted/60 text-foreground"
                    : "mr-2 bg-muted/30 text-muted-foreground"
                )}
              >
                {msg.content}
              </div>
            ))}
            {loading && (
              <p className="font-mono text-xs text-muted-foreground">Thinking…</p>
            )}
          </div>

          {!atLimit && messages.length <= 2 && (
            <div className="flex flex-wrap gap-1.5 border-t border-border px-3 py-2">
              {STARTER_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  disabled={loading}
                  onClick={() => void sendMessage(prompt)}
                  className="rounded-md border border-border bg-muted/40 px-2 py-1 font-mono text-[10px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {atLimit ? (
            <p className="border-t border-border px-3 py-2 text-xs text-muted-foreground">
              That&apos;s the limit for this session ({MAX_USER_TURNS} questions).
              Your report above has the full breakdown.
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex gap-2 border-t border-border p-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question…"
                disabled={loading}
                className="h-8 flex-1 text-sm"
                aria-label="Chat message"
              />
              <Button
                type="submit"
                size="icon-sm"
                disabled={loading || !input.trim()}
                className="h-8 w-8 shrink-0"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          )}
        </div>
      )}

      <Button
        type="button"
        data-audit-chat
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "fixed bottom-6 right-6 z-40 h-12 gap-2 rounded-full px-4 shadow-md",
          "bg-foreground text-background hover:bg-foreground/90",
          "sm:bottom-6 sm:right-6"
        )}
        aria-expanded={open}
        aria-label={open ? "Close audit chat" : "Ask about this audit"}
      >
        {open ? (
          <X className="h-5 w-5" />
        ) : (
          <>
            <MessageCircle className="h-5 w-5" />
            <span className="hidden text-sm font-medium sm:inline">
              Ask about this audit
            </span>
          </>
        )}
      </Button>
    </>
  );
}
