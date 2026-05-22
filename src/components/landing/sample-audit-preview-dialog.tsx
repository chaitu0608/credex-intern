"use client";

import { useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { SampleAuditPreviewCard } from "@/components/landing/sample-audit-preview-card";
import { SAMPLE_PREVIEW_SECTION } from "@/components/landing/sample-audit-preview-data";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SampleAuditPreviewDialog({
  triggerClassName,
}: {
  triggerClassName?: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const {
    dialogTitle,
    disclaimer,
    viewExampleLabel,
    ctaLabel,
    ctaHref,
  } = SAMPLE_PREVIEW_SECTION;

  const open = useCallback(() => {
    dialogRef.current?.showModal();
  }, []);

  const close = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const onCancel = () => close();
    dialog.addEventListener("cancel", onCancel);
    return () => dialog.removeEventListener("cancel", onCancel);
  }, [close]);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="lg"
        className={cn("rounded-md px-6", triggerClassName)}
        onClick={open}
      >
        {viewExampleLabel}
      </Button>

      <dialog
        ref={dialogRef}
        aria-labelledby="sample-audit-dialog-title"
        className="fixed inset-0 z-50 m-0 h-full max-h-none w-full max-w-none border-0 bg-transparent p-0 backdrop:bg-black/60 open:animate-in open:fade-in-0"
        onClick={(e) => {
          if (e.target === dialogRef.current) close();
        }}
      >
        <div className="flex min-h-full items-end justify-center p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:items-center sm:p-6">
          <div
            role="document"
            className="relative flex max-h-[min(92dvh,880px)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl sm:max-h-[min(90vh,880px)]"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="flex shrink-0 items-start justify-between gap-3 border-b border-border px-4 py-3 sm:gap-4 sm:px-6 sm:py-4">
              <div className="min-w-0 pr-2">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {SAMPLE_PREVIEW_SECTION.eyebrow}
                </p>
                <h2
                  id="sample-audit-dialog-title"
                  className="font-display mt-1 text-lg font-bold tracking-tight sm:text-xl"
                >
                  {dialogTitle}
                </h2>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0 rounded-md"
                aria-label="Close example report"
                onClick={close}
              >
                <X className="h-5 w-5" />
              </Button>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
              <SampleAuditPreviewCard />
            </div>

            <footer className="shrink-0 border-t border-border bg-muted/20 px-4 py-3 sm:px-6 sm:py-4">
              <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
                {disclaimer}
              </p>
              <div className="mt-4 flex justify-center">
                <Link
                  href={ctaHref}
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "rounded-md bg-foreground px-8 text-background hover:bg-foreground/90"
                  )}
                  onClick={close}
                >
                  {ctaLabel}
                </Link>
              </div>
            </footer>
          </div>
        </div>
      </dialog>
    </>
  );
}
