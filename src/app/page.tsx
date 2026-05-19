"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import SpendForm from "@/components/SpendForm";
import { PageShell } from "@/components/layout/page-shell";
import {
  BentoFeatureCard,
  BentoGrid,
  BentoStatCard,
} from "@/components/ui/bento-grid";
import { FloatingIcons } from "@/components/ui/floating-icons";
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
      {/* Hero — Credex.rocks style */}
      <section className="relative px-2 pb-4 pt-6 text-center sm:pt-10">
        <FloatingIcons />

        <div className="mx-auto inline-flex overflow-hidden rounded-full border border-stone-200 bg-white text-xs shadow-sm">
          <span className="bg-accent px-4 py-2 font-semibold uppercase tracking-wide text-primary">
            Free audit
          </span>
          <span className="px-4 py-2 text-muted-foreground">
            No login · Instant results
          </span>
        </div>

        <h1 className="mx-auto mt-8 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl md:text-[3.5rem]">
          <span className="text-primary">Save Up To 60%</span>
          <br />
          <span className="text-foreground">On AI Tool Spend</span>
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
          Audit your Cursor, Claude, ChatGPT, and Copilot stack. Get defensible
          savings recommendations in under two minutes.
        </p>

        <TrustBar />
      </section>

      {/* Bento stats — screenshot 2 style */}
      <section className="mb-10">
        <BentoGrid className="lg:grid-rows-2">
          <BentoFeatureCard
            title="Stop overpaying for AI tools you barely use"
            description="Enter what you pay today. Our audit engine checks plan fit, seat count, and cheaper alternatives — with real dollar math, not vibes."
          />
          <BentoStatCard value="8+" label="Tools supported" />
          <BentoStatCard value="2 min" label="To complete" />
          <BentoStatCard value="$340" label="Avg. savings found*" />
          <BentoStatCard value="Free" label="Always" />
        </BentoGrid>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          *Illustrative benchmark from sample audits
        </p>
      </section>

      {/* Audit form */}
      <Card className="overflow-hidden rounded-2xl border-stone-200/80 shadow-[0_4px_40px_rgba(0,0,0,0.06)]">
        <CardHeader className="border-b border-stone-100 bg-white pb-4">
          <CardTitle className="text-xl font-bold">Run your audit</CardTitle>
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
                value={((messageIndex + 1) / LOADING_MESSAGES.length) * 100}
                className="mt-4 w-full max-w-xs"
              />
            </div>
          )}
          <SpendForm onSubmit={handleSubmit} isLoading={isLoading} />
        </CardContent>
      </Card>
    </PageShell>
  );
}
