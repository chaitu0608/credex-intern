import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { SampleAuditPreviewCard } from "@/components/landing/sample-audit-preview-card";
import { SAMPLE_PREVIEW_SECTION } from "@/components/landing/sample-audit-preview-data";
import { cn } from "@/lib/utils";

export function SampleAuditPreviewSection() {
  const { eyebrow, title, description, disclaimer, ctaLabel, ctaHref } =
    SAMPLE_PREVIEW_SECTION;

  return (
    <section
      id="sample-preview"
      aria-labelledby="sample-preview-heading"
      className="border-t border-border py-16 sm:py-20"
    >
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {eyebrow}
        </p>
        <h2
          id="sample-preview-heading"
          className="font-display mt-3 text-2xl font-bold tracking-tight sm:text-3xl"
        >
          {title}
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {description}
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-3xl">
        <SampleAuditPreviewCard variant="full" />
      </div>

      <p className="mx-auto mt-6 max-w-xl text-center text-[11px] leading-relaxed text-muted-foreground">
        {disclaimer}
      </p>

      <div className="mt-8 flex justify-center">
        <Link
          href={ctaHref}
          className={cn(
            buttonVariants({ size: "lg" }),
            "inline-flex rounded-md bg-foreground px-8 text-background hover:bg-foreground/90"
          )}
        >
          {ctaLabel}
        </Link>
      </div>
    </section>
  );
}
