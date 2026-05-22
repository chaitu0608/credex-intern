import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import AuditChatWidget from "@/components/audit/audit-chat-widget";
import AuditPdfDownload from "@/components/audit/audit-pdf-download";
import {
  AuditRecommendations,
  AuditSummary,
} from "@/components/audit/audit-results";
import LeadCapture from "@/components/audit/lead-capture";
import SavingsHero from "@/components/audit/savings-hero";
import ShareSection from "@/components/audit/share-section";
import { PageShell } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { AuditPdfPayload } from "@/lib/audit-pdf-export";
import { HONEST_PATH_MAX_MONTHLY } from "@/lib/auditEngine";
import {
  baseMetadata,
  buildOpenGraph,
  buildTwitterCard,
} from "@/lib/og-metadata";
import { getAudit } from "@/lib/supabase";
import type { ToolRecommendation } from "@/types";

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

function getTopRecommendation(
  recommendations: ToolRecommendation[]
): { toolName: string; savings: number; action: string } | undefined {
  const top = [...recommendations]
    .filter((r) => r.savings > 0)
    .sort((a, b) => b.savings - a.savings)[0];
  if (!top) return undefined;
  return {
    toolName: top.toolName,
    savings: top.savings,
    action: top.recommendedAction,
  };
}

function ReportSection({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/80 bg-card/60 p-6 sm:p-8",
        className
      )}
    >
      {children}
    </div>
  );
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

  const topRecommendation = getTopRecommendation(audit.recommendations);
  const toolCount = audit.input.tools.length;

  const pdfPayload: AuditPdfPayload = {
    id: audit.id,
    createdAt: audit.createdAt,
    toolCount,
    teamSize: audit.input.teamSize,
    useCase: audit.input.useCase,
    totalMonthlySavings: audit.totalMonthlySavings,
    totalAnnualSavings: audit.totalAnnualSavings,
    isHighSavings: audit.isHighSavings,
    aiSummary: audit.aiSummary,
    summarySource: audit.summarySource,
    recommendations: audit.recommendations,
  };

  const reportDate = new Date(audit.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const shareSection = (
    <ReportSection>
      <h2 className="font-display mb-1 text-lg font-bold tracking-tight">
        Share report
      </h2>
      <p className="mb-5 text-sm text-muted-foreground">
        Copy or post your results — no email required on the public link.
      </p>
      <ShareSection
        auditId={audit.id}
        totalMonthlySavings={audit.totalMonthlySavings}
      />
    </ReportSection>
  );

  return (
    <PageShell headerBackHref="/" headerBackLabel="← New audit" maxWidth="xl">
      <article id="audit-report" className="pb-8">
        <header className="mb-10 border-b border-border pb-8 sm:mb-12 sm:pb-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 flex-1 space-y-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                SpendSense audit report
              </p>
              <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                Your AI stack audit
              </h1>
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className="font-mono text-[10px] uppercase tracking-wide"
                >
                  {toolCount} tool{toolCount === 1 ? "" : "s"}
                </Badge>
                <Badge
                  variant="outline"
                  className="font-mono text-[10px] uppercase tracking-wide"
                >
                  {audit.input.teamSize}-person team
                </Badge>
                <Badge
                  variant="outline"
                  className="font-mono text-[10px] uppercase tracking-wide capitalize"
                >
                  {audit.input.useCase}
                </Badge>
              </div>
              <p className="font-mono text-xs text-muted-foreground">
                Report {audit.id} · Generated {reportDate}
              </p>
            </div>
            <div className="flex shrink-0 items-start gap-2 lg:pt-1">
              <AuditPdfDownload payload={pdfPayload} />
            </div>
          </div>
        </header>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_min(100%,340px)] lg:gap-12 lg:items-start">
          <div className="min-w-0 space-y-14 sm:space-y-16">
            <AuditSummary
              aiSummary={audit.aiSummary}
              summarySource={audit.summarySource}
            />

            <AuditRecommendations
              recommendations={audit.recommendations}
            />

            {audit.isHighSavings && (
              <ReportSection className="border-accent/30 bg-accent/5">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  03 · Credex opportunity
                </p>
                <CardTitle className="font-display mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                  ${audit.totalAnnualSavings.toLocaleString()}
                  <span className="mt-1 block text-base font-normal text-muted-foreground">
                    per year in potential savings
                  </span>
                </CardTitle>
                <CardDescription className="mt-4 max-w-lg text-sm leading-relaxed">
                  Discounted AI infrastructure credits for Cursor, Claude,
                  ChatGPT Enterprise, and more.
                </CardDescription>
                <a
                  href={`https://credex.rocks?utm_source=spendsense&utm_medium=audit&utm_campaign=high_savings&audit_id=${audit.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants(),
                    "mt-6 inline-flex gap-2 rounded-md bg-foreground text-background hover:bg-foreground/90"
                  )}
                >
                  Book Credex consultation
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </ReportSection>
            )}

            {isHonestPath && (
              <ReportSection>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  <span className="font-medium text-foreground">
                    You&apos;re spending well.
                  </span>{" "}
                  {audit.totalMonthlySavings === 0
                    ? "Your stack looks right-sized for your team size and use case."
                    : `We found about $${audit.totalMonthlySavings}/mo in small optimizations — nothing urgent.`}{" "}
                  Save your report below and we&apos;ll notify you when new
                  optimizations apply to your stack.
                </p>
              </ReportSection>
            )}

            {audit.isHighSavings && shareSection}

            <ReportSection>
              <LeadCapture
                auditId={audit.id}
                isHighSavings={audit.isHighSavings}
                isHonestPath={isHonestPath}
                totalMonthlySavings={audit.totalMonthlySavings}
              />
            </ReportSection>

            {!audit.isHighSavings && shareSection}
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <SavingsHero
              totalMonthlySavings={audit.totalMonthlySavings}
              totalAnnualSavings={audit.totalAnnualSavings}
              isHighSavings={audit.isHighSavings}
              toolCount={audit.recommendations.length}
              topRecommendation={topRecommendation}
            />
          </aside>
        </div>
      </article>

      <AuditChatWidget auditId={audit.id} />
    </PageShell>
  );
}
