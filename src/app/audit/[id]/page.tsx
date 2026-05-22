import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import AuditResults from "@/components/audit/audit-results";
import LeadCapture from "@/components/audit/lead-capture";
import SavingsHero from "@/components/audit/savings-hero";
import ShareSection from "@/components/audit/share-section";
import { PageShell } from "@/components/layout/page-shell";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { HONEST_PATH_MAX_MONTHLY } from "@/lib/auditEngine";
import {
  baseMetadata,
  buildOpenGraph,
  buildTwitterCard,
} from "@/lib/og-metadata";
import { getAudit } from "@/lib/supabase";

interface PageProps {
  params: { id: string };
}

/** Audits are immutable after creation — safe to cache at the edge. */
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const audit = await getAudit(params.id);
  if (!audit) {
    return { title: "Audit not found" };
  }

  const title =
    audit.totalMonthlySavings > 0
      ? `$${audit.totalMonthlySavings}/mo AI savings found`
      : "AI stack audit — optimized";

  const description = `SpendSense audit of ${audit.input.tools.length} AI tools. Potential savings: $${audit.totalMonthlySavings}/month ($${audit.totalAnnualSavings}/year).`;
  const path = `/audit/${params.id}`;
  const imagePath = `${path}/opengraph-image`;

  return {
    ...baseMetadata(),
    title,
    description,
    openGraph: buildOpenGraph({
      title,
      description,
      path,
      imagePath,
      siteName: "SpendSense",
    }),
    twitter: buildTwitterCard(title, description, imagePath),
  };
}

export default async function AuditPage({ params }: PageProps) {
  const audit = await getAudit(params.id);

  if (!audit) {
    return (
      <PageShell headerBackHref="/" headerBackLabel="← New audit">
        <Card className="rounded-lg border-border bg-card p-12 text-center">
          <CardTitle className="font-display text-xl font-bold">
            Audit not found
          </CardTitle>
          <CardDescription className="mt-2">
            This link may have expired or the audit was not saved.
          </CardDescription>
          <Link
            href="/"
            className={cn(
              buttonVariants(),
              "mt-8 inline-flex rounded-md bg-foreground text-background hover:bg-foreground/90"
            )}
          >
            Run your own audit
          </Link>
        </Card>
      </PageShell>
    );
  }

  const isHonestPath =
    !audit.isHighSavings && audit.totalMonthlySavings < HONEST_PATH_MAX_MONTHLY;

  return (
    <PageShell headerBackHref="/" headerBackLabel="← New audit" maxWidth="xl">
      <p className="mb-8 font-mono text-xs uppercase tracking-widest text-muted-foreground">
        Your SpendSense report
      </p>

      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <aside className="order-first lg:order-2">
          <SavingsHero
            totalMonthlySavings={audit.totalMonthlySavings}
            totalAnnualSavings={audit.totalAnnualSavings}
            isHighSavings={audit.isHighSavings}
            toolCount={audit.recommendations.length}
          />
        </aside>

        <div className="order-2 space-y-12 lg:order-1">
          <AuditResults
            recommendations={audit.recommendations}
            aiSummary={audit.aiSummary}
            summarySource={audit.summarySource}
          />

          {audit.isHighSavings && (
            <Card className="rounded-lg border-border bg-card">
              <CardHeader>
                <CardDescription className="font-mono text-xs uppercase tracking-widest">
                  Credex opportunity
                </CardDescription>
                <CardTitle className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
                  ${audit.totalAnnualSavings.toLocaleString()}
                  <span className="block text-lg font-normal text-muted-foreground">
                    per year in potential savings
                  </span>
                </CardTitle>
                <CardDescription className="max-w-lg">
                  Discounted AI infrastructure credits for Cursor, Claude,
                  ChatGPT Enterprise, and more.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <a
                  href={`https://credex.rocks?utm_source=spendsense&utm_medium=audit&utm_campaign=high_savings&audit_id=${audit.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants(),
                    "inline-flex gap-2 rounded-md bg-foreground text-background hover:bg-foreground/90"
                  )}
                >
                  Book Credex consultation
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </CardContent>
            </Card>
          )}

          {isHonestPath && (
            <Card className="rounded-lg border-border bg-card">
              <CardContent className="py-4">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">
                    You&apos;re spending well.
                  </span>{" "}
                  {audit.totalMonthlySavings === 0
                    ? "Your stack looks right-sized for your team size and use case."
                    : `We found about $${audit.totalMonthlySavings}/mo in small optimizations — nothing urgent.`}{" "}
                  Save your report below and we&apos;ll notify you when new
                  optimizations apply to your stack.
                </p>
              </CardContent>
            </Card>
          )}

          <LeadCapture
            auditId={audit.id}
            isHighSavings={audit.isHighSavings}
            isHonestPath={isHonestPath}
            totalMonthlySavings={audit.totalMonthlySavings}
          />

          <section className="border-t border-border pt-8">
            <h2 className="font-display mb-2 text-lg font-bold tracking-tight">
              Share
            </h2>
            <p className="mb-4 text-sm text-muted-foreground">
              Copy or post your results — no email on the public link
            </p>
            <ShareSection
              auditId={audit.id}
              totalMonthlySavings={audit.totalMonthlySavings}
            />
          </section>
        </div>
      </div>
    </PageShell>
  );
}
