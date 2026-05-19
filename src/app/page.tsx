"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BarChart3, Loader2, Shield, Zap } from "lucide-react";
import { toast } from "sonner";
import SpendForm from "@/components/SpendForm";
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

const LOADING_MESSAGES = [
  "Analyzing your tools...",
  "Calculating savings...",
  "Generating your report...",
  "Almost done...",
];

const STEPS = [
  { icon: Zap, title: "Add your stack", desc: "Tools, plans, seats, monthly spend" },
  { icon: BarChart3, title: "Get instant audit", desc: "Rule-based math — not vibes" },
  { icon: Shield, title: "Save & share", desc: "Email report after you see value" },
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
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Audit failed");
      router.push(`/audit/${data.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
      setIsLoading(false);
    }
  };

  return (
    <PageShell maxWidth="xl">
      <section className="grid gap-10 pb-6 pt-4 lg:grid-cols-2 lg:items-center lg:gap-12 lg:pt-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            3-minute audit · No login
          </div>

          <h1 className="font-display mt-6 text-4xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-5xl">
            Know exactly where your{" "}
            <span className="bg-gradient-to-r from-primary to-[hsl(var(--spendsense-indigo))] bg-clip-text text-transparent">
              AI budget leaks
            </span>
          </h1>

          <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
            SpendSense audits Cursor, Claude, ChatGPT, Copilot, and more —
            with defensible downgrade and seat-fit math your finance team can
            trust.
          </p>

          <TrustBar className="mt-6 justify-start" />

          <div id="how-it-works" className="mt-8 grid gap-3 sm:grid-cols-3">
            {STEPS.map((step) => (
              <div
                key={step.title}
                className="rounded-xl border border-border/80 bg-white/80 p-3 shadow-sm"
              >
                <step.icon className="mb-2 h-4 w-4 text-primary" />
                <p className="text-sm font-semibold">{step.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative hidden lg:block">
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/10 via-transparent to-[hsl(var(--spendsense-indigo))]/10 blur-2xl" />
          <Card className="relative overflow-hidden rounded-2xl border-border shadow-lg">
            <div className="bg-spendsense-dark px-6 py-5 text-white">
              <p className="text-xs font-medium uppercase tracking-widest text-white/60">
                Sample audit preview
              </p>
              <p className="font-display mt-2 text-4xl font-bold tabular-nums text-primary">
                $847
                <span className="text-lg font-medium text-white/70">/mo</span>
              </p>
              <p className="mt-1 text-sm text-white/60">
                $10,164/year potential savings
              </p>
            </div>
            <CardContent className="space-y-3 p-5">
              {[
                { tool: "Cursor Business → Pro", save: "$20/mo" },
                { tool: "Claude Team → Pro", save: "$70/mo" },
                { tool: "Duplicate ChatGPT seat", save: "$30/mo" },
              ].map((row) => (
                <div
                  key={row.tool}
                  className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2 text-sm"
                >
                  <span className="text-muted-foreground">{row.tool}</span>
                  <span className="font-semibold text-primary">{row.save}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="audit-form" className="scroll-mt-24">
        <Card
          id="tools"
          className="overflow-hidden rounded-2xl border-border shadow-[0_8px_40px_rgba(15,23,42,0.08)]"
        >
          <CardHeader className="border-b border-border bg-white pb-4">
            <CardTitle className="font-display text-xl font-bold">
              Run your SpendSense audit
            </CardTitle>
            <CardDescription>
              Add each tool, your plan, monthly spend, and team size.
            </CardDescription>
          </CardHeader>
          <CardContent className="relative bg-white pt-6">
            {isLoading && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-b-2xl bg-white/95">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-4 text-sm font-medium text-muted-foreground">
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
