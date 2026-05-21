import { ToolLogo } from "@/components/ui/tool-logo";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import type { AITool } from "@/types";

const SAMPLE_ROWS: {
  tool: AITool;
  label: string;
  save: string;
}[] = [
  { tool: "cursor", label: "Cursor Business → Pro", save: "$20/mo" },
  { tool: "claude", label: "Claude Team → Pro", save: "$70/mo" },
  { tool: "chatgpt", label: "Duplicate ChatGPT seat", save: "$30/mo" },
];

interface SampleAuditPreviewProps {
  compact?: boolean;
  "data-testid"?: string;
}

export function SampleAuditPreview({
  compact = false,
  "data-testid": testId,
}: SampleAuditPreviewProps) {
  return (
    <Card
      data-testid={testId}
      className="overflow-hidden rounded-lg border-border bg-card"
    >
      <CardHeader
        className={
          compact
            ? "border-b border-border px-4 py-4"
            : "border-b border-border pb-6"
        }
      >
        <CardDescription className="font-mono text-xs uppercase tracking-widest">
          Sample audit preview
        </CardDescription>
        <p
          className={
            compact
              ? "font-display mt-2 text-4xl font-bold tabular-nums tracking-tight text-foreground"
              : "font-display mt-4 text-6xl font-bold tabular-nums tracking-tight text-foreground"
          }
        >
          $847
          <span
            className={
              compact
                ? "text-lg font-medium text-muted-foreground"
                : "text-2xl font-medium text-muted-foreground"
            }
          >
            /mo
          </span>
        </p>
        <p className="mt-1 font-mono text-xs text-muted-foreground sm:text-sm">
          $10,164/year potential savings
        </p>
      </CardHeader>
      <CardContent className="space-y-0 divide-y divide-border p-0">
        {SAMPLE_ROWS.map((row) => (
          <div
            key={row.label}
            className={
              compact
                ? "flex items-center justify-between gap-2 px-4 py-2.5 text-xs"
                : "flex items-center justify-between gap-3 px-6 py-3 text-sm"
            }
          >
            <span className="flex min-w-0 items-center gap-2 text-muted-foreground sm:gap-3">
              <ToolLogo
                tool={row.tool}
                className={compact ? "h-6 w-6 shrink-0" : "h-7 w-7"}
              />
              <span className="truncate">{row.label}</span>
            </span>
            <span className="shrink-0 font-mono font-medium text-savings">
              {row.save}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
