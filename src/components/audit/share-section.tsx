"use client";

import { useState } from "react";
import { Copy, Link2, Share2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ShareSectionProps {
  auditId: string;
  totalMonthlySavings: number;
}

export default function ShareSection({
  auditId,
  totalMonthlySavings,
}: ShareSectionProps) {
  const [copied, setCopied] = useState(false);

  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/audit/${auditId}`
      : `/audit/${auditId}`;

  const shareTitle = `SpendSense audit: $${totalMonthlySavings}/mo in potential AI savings`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tweetText = encodeURIComponent(
    `I audited my AI tool spend — $${totalMonthlySavings}/mo in potential savings.`
  );
  const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}&url=${encodeURIComponent(url)}`;

  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        type="button"
        variant="outline"
        onClick={copyLink}
        className="rounded-md border-border hover:bg-muted"
      >
        <Copy className="mr-2 h-4 w-4" />
        {copied ? "Copied" : "Copy link"}
      </Button>
      <a
        href={tweetUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          buttonVariants({ variant: "outline" }),
          "inline-flex rounded-md border-border hover:bg-muted"
        )}
      >
        <Share2 className="mr-2 h-4 w-4" />
        Share on X
      </a>
      <a
        href={linkedInUrl}
        target="_blank"
        rel="noopener noreferrer"
        title={shareTitle}
        className={cn(
          buttonVariants({ variant: "outline" }),
          "inline-flex rounded-md border-border hover:bg-muted"
        )}
      >
        <Link2 className="mr-2 h-4 w-4" />
        LinkedIn
      </a>
    </div>
  );
}
