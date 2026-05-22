"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AuditCoveragePanel } from "@/components/audit/audit-coverage-panel";
import SpendForm from "@/components/spend-form/spend-form";
import { PageShell } from "@/components/layout/page-shell";
import { TrustBar } from "@/components/ui/trust-bar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { AuditInput } from "@/types";
import { isHoneypotResponseId } from "@/lib/validation";

const LOADING_MESSAGES = [
  "Analyzing your tools...",
  "Calculating savings...",
  "Generating your report...",
  "Almost done...",
];

const STEPS = [
  { n: "01", title: "Add your stack", desc: "Tools, plans, seats, monthly spend" },
  { n: "02", title: "Get instant audit", desc: "Rule-based math — not vibes" },
  { n: "03", title: "Save & share", desc: "Email report after you see value" },
];

export default function HomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setMessageIndex((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSubmit = async (input: AuditInput) => {
    setIsLoading(true);
    const minLoaderMs = 600;
    const started = Date.now();
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = await res.json();

      if (res.status === 429) {
        toast.error(
          "Too many audits from this network. Try again in about an hour."
        );
        setIsLoading(false);
        return;
      }

      if (!res.ok) {
        throw new Error(data.error ?? "Audit failed");
      }

      if (isHoneypotResponseId(data.id)) {
        setIsLoading(false);
        return;
      }

      const elapsed = Date.now() - started;
      if (elapsed < minLoaderMs) {
        await new Promise((r) => setTimeout(r, minLoaderMs - elapsed));
      }
      router.push(`/audit/${data.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
      setIsLoading(false);
    }
  };

  return (
    <PageShell maxWidth="xl">
      <section className="grid gap-12 pb-8 pt-6 lg:grid-cols-2 lg:items-start lg:gap-16 lg:pt-12">
        <div>
          <div className="inline-flex items-center gap-2 rounded-md border border-border bg-card/50 px-3 py-1.5 font-mono text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            3-minute audit · No login
          </div>

          <h1 className="font-display mt-8 text-5xl font-bold leading-[1.02] tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl">
            Know exactly where your AI budget leaks.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            SpendSense audits Cursor, Claude, ChatGPT, Copilot, and more —
            with defensible downgrade and seat-fit math your finance team can
            trust.
          </p>

          <TrustBar className="mt-8 justify-start" />

          <div id="how-it-works" className="mt-12 grid gap-3 sm:grid-cols-3">
            {STEPS.map((step) => (
              <div
                key={step.title}
                className="rounded-lg border border-border bg-card p-4"
              >
                <p className="font-mono text-xs text-muted-foreground">
                  {step.n}
                </p>
                <p className="mt-2 text-sm font-semibold text-foreground">
                  {step.title}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative hidden lg:block">
          <AuditCoveragePanel />
        </div>
      </section>

      <div className="mb-8 lg:hidden" data-testid="hero-aside-mobile">
        <AuditCoveragePanel compact />
      </div>

      <section id="audit-form" className="scroll-mt-24 border-t border-border pt-12 lg:pt-12">
        <Card
          id="tools"
          className="overflow-hidden rounded-lg border-border bg-card"
        >
          <CardHeader className="border-b border-border">
            <CardTitle className="font-display text-2xl font-bold tracking-tight">
              Run your SpendSense audit
            </CardTitle>
            <CardDescription>
              Add each tool, your plan, monthly spend, and team size.
            </CardDescription>
          </CardHeader>
          <CardContent className="relative pt-6">
            {isLoading && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-b-lg bg-background/95 backdrop-blur-sm">
                <Loader2 className="h-8 w-8 animate-spin text-foreground" />
                <p className="mt-4 font-mono text-sm text-muted-foreground">
                  {LOADING_MESSAGES[messageIndex]}
                </p>
                <Progress
                  value={
                    ((messageIndex + 1) / LOADING_MESSAGES.length) * 100
                  }
                  className="mt-4 w-full max-w-xs"
                />
              </div>
            )}
            <SpendForm onSubmit={handleSubmit} isLoading={isLoading} />
          </CardContent>
        </Card>
      </section>
    </PageShell>
  );
}
