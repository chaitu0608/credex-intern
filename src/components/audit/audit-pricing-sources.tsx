import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { ToolLogo } from "@/components/ui/tool-logo";
import {
  PRICING_SOURCES,
  PRICING_VERIFIED_AT,
  TOOL_NAMES,
} from "@/lib/pricing";
import type { ToolEntry } from "@/types";

const PRICING_DATA_REPO_PATH =
  "https://github.com/chaitu0608/credex-intern/blob/main/docs/deliverables/PRICING_DATA.md";

interface AuditPricingSourcesProps {
  tools: ToolEntry[];
}

export default function AuditPricingSources({
  tools,
}: AuditPricingSourcesProps) {
  const uniqueTools = tools.filter(
    (entry, index, arr) =>
      arr.findIndex((e) => e.tool === entry.tool) === index
  );

  return (
    <section aria-labelledby="audit-methodology-heading">
      <details className="group rounded-xl border border-border bg-card/60 shadow-sm">
        <summary className="cursor-pointer list-none px-6 py-5 sm:px-8 [&::-webkit-details-marker]:hidden">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Methodology
              </p>
              <h2
                id="audit-methodology-heading"
                className="font-display text-lg font-bold tracking-tight sm:text-xl"
              >
                How we calculated this
              </h2>
              <p className="text-sm text-muted-foreground">
                Rule-based audit using list prices from official vendor pages —
                no LLM math.
              </p>
            </div>
            <span className="mt-1 shrink-0 font-mono text-xs text-muted-foreground group-open:hidden">
              Show sources
            </span>
            <span className="mt-1 hidden shrink-0 font-mono text-xs text-muted-foreground group-open:inline">
              Hide
            </span>
          </div>
        </summary>

        <div className="space-y-4 border-t border-border px-6 pb-6 pt-4 sm:px-8 sm:pb-8">
          <ul className="divide-y divide-border">
            {uniqueTools.map((entry) => {
              const source = PRICING_SOURCES[entry.tool];
              return (
                <li
                  key={entry.tool}
                  className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <ToolLogo tool={entry.tool} className="h-9 w-9" />
                    <div>
                      <p className="font-medium text-foreground">
                        {TOOL_NAMES[entry.tool]}
                      </p>
                      <p className="font-mono text-xs capitalize text-muted-foreground">
                        {entry.plan} · ${entry.monthlySpend}/mo reported
                      </p>
                    </div>
                  </div>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-mono text-xs text-foreground underline-offset-4 hover:underline"
                  >
                    {source.label}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </li>
              );
            })}
          </ul>

          <p className="font-mono text-[10px] leading-relaxed text-muted-foreground">
            Verified {PRICING_VERIFIED_AT}. Full price table in{" "}
            <Link
              href={PRICING_DATA_REPO_PATH}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline underline-offset-2"
            >
              PRICING_DATA.md
            </Link>
            .
          </p>
        </div>
      </details>
    </section>
  );
}
