"use client";

import { useState } from "react";
import { CheckCircle2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LeadCaptureProps {
  auditId: string;
  isHighSavings: boolean;
  totalMonthlySavings: number;
}

type State = "idle" | "submitting" | "success" | "error";

export default function LeadCapture({
  auditId,
  isHighSavings,
  totalMonthlySavings,
}: LeadCaptureProps) {
  const [state, setState] = useState<State>("idle");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const heading = isHighSavings
    ? `Save your $${totalMonthlySavings.toLocaleString()}/mo audit`
    : totalMonthlySavings > 0
      ? "Email me this report"
      : "Get optimization updates";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("submitting");
    setError("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          companyName: companyName || undefined,
          role: role || undefined,
          auditId,
          phone,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to submit");
      }
      setState("success");
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  if (state === "success") {
    return (
      <Card className="rounded-2xl border-primary/30">
        <CardContent className="flex flex-col items-center py-10 text-center">
          <CheckCircle2 className="h-10 w-10 text-primary" />
          <p className="mt-4 font-semibold">Report sent to your email</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Check your inbox for the shareable link.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl border-stone-200 shadow-sm">
      <CardHeader>
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent">
            <Mail className="h-4 w-4 text-primary" />
          </span>
          <div>
            <CardTitle className="text-base">{heading}</CardTitle>
            <CardDescription className="mt-1">
              {isHighSavings
                ? "Credex can help capture additional savings via discounted credits."
                : "No spam — we only email your audit link."}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Work email</Label>
            <Input
              id="email"
              type="email"
              required
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="company">Company (optional)</Label>
              <Input
                id="company"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role (optional)</Label>
              <Input
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>
          </div>
          <input
            type="text"
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
          />
          {state === "error" && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <Button
            type="submit"
            disabled={state === "submitting"}
            className="h-11 w-full rounded-full bg-foreground text-background hover:bg-foreground/90"
          >
            {state === "submitting" ? "Sending…" : "Save report"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
