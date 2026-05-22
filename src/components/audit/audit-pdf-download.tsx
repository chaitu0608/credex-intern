"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  downloadAuditPdf,
  type AuditPdfPayload,
} from "@/lib/audit-pdf-export";

interface AuditPdfDownloadProps {
  payload: AuditPdfPayload;
}

export default function AuditPdfDownload({ payload }: AuditPdfDownloadProps) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      await downloadAuditPdf(payload);
    } catch (err) {
      console.error("PDF export failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() => void handleDownload()}
      disabled={loading}
      className="h-8 shrink-0 gap-1.5 font-mono text-xs"
      aria-label="Download audit report as PDF"
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Download className="h-3.5 w-3.5" />
      )}
      Download PDF
    </Button>
  );
}
