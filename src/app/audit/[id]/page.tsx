import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import AuditResults from "@/components/AuditResults";
import LeadCapture from "@/components/LeadCapture";
import SavingsHero from "@/components/SavingsHero";
import ShareSection from "@/components/ShareSection";
import { PageShell } from "@/components/layout/page-shell";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";
import { getAudit } from "@/lib/supabase";

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const audit = await getAudit(params.id);
  if (!audit) {
    return { title: "Audit not found | AI Spend Audit" };
  }

  const title =
    audit.totalMonthlySavings > 0
      ? `$${audit.totalMonthlySavings}/mo AI savings found`
      : "AI stack audit — optimized";

  const description = `Audit of ${audit.input.tools.length} AI tools. Potential savings: $${audit.totalMonthlySavings}/month ($${audit.totalAnnualSavings}/year).`;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  return {
    title: `${title} | AI Spend Audit`,
    description,
    openGraph: {
      title,
      description,
      url: `${appUrl}/audit/${params.id}`,
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function AuditPage({ params }: PageProps) {
  const audit = await getAudit(params.id);

  if (!audit) {
    return (
      <PageShell headerBackHref="/" headerBackLabel="← New audit">
        <Card className="rounded-2xl p-12 text-center shadow-sm">
          <CardTitle className="text-xl font-bold">Audit not found</CardTitle>
          <CardDescription className="mt-2">
            This link may have expired or the audit was not saved.
          </CardDescription>
          <Link
            href="/"
            className={cn(
              buttonVariants(),
              "mt-8 inline-flex rounded-full bg-foreground text-background hover:bg-foreground/90"
            )}
          >
            Run your own audit
          </Link>
        </Card>
      </PageShell>
    );
  }

  return (
    <PageShell headerBackHref="/" headerBackLabel="← New audit" maxWidth="lg">
      <div className="space-y-10">
        <SavingsHero
          totalMonthlySavings={audit.totalMonthlySavings}
          totalAnnualSavings={audit.totalAnnualSavings}
          isHighSavings={audit.isHighSavings}
          toolCount={audit.recommendations.length}
        />

        <section>
          <SectionHeading
            title="Recommended actions"
            subtitle="Per-tool breakdown with savings math"
          />
          <AuditResults
            recommendations={audit.recommendations}
            aiSummary={audit.aiSummary}
          />
        </section>

        {audit.isHighSavings && (
          <Card className="overflow-hidden rounded-2xl bg-[hsl(var(--credex-dark))] text-white">
            <CardHeader>
              <CardDescription className="text-stone-400">
                Credex opportunity
              </CardDescription>
              <CardTitle className="text-2xl font-bold sm:text-3xl">
                Capture ${audit.totalAnnualSavings.toLocaleString()}/year
              </CardTitle>
              <CardDescription className="max-w-lg text-stone-400">
                Discounted AI infrastructure credits for Cursor, Claude,
                ChatGPT Enterprise, and more.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <a
                href="https://credex.rocks"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants(),
                  "inline-flex gap-2 rounded-full bg-white text-foreground hover:bg-stone-100"
                )}
              >
                Book consultation
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </CardContent>
          </Card>
        )}

        {audit.totalMonthlySavings < 100 && !audit.isHighSavings && (
          <Card className="rounded-xl border-stone-200 bg-accent/30">
            <CardContent className="py-4">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  You&apos;re spending well.
                </span>{" "}
                Save your report to get notified when new optimizations apply.
              </p>
            </CardContent>
          </Card>
        )}

        <LeadCapture
          auditId={audit.id}
          isHighSavings={audit.isHighSavings}
          totalMonthlySavings={audit.totalMonthlySavings}
        />

        <section>
          <SectionHeading title="Share" subtitle="Copy or post your results" />
          <ShareSection
            auditId={audit.id}
            totalMonthlySavings={audit.totalMonthlySavings}
          />
        </section>
      </div>
    </PageShell>
  );
}
