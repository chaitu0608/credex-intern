import { Code2, Layers, Scale, Users } from "lucide-react";
import { ALL_TOOLS, getToolMeta } from "@/lib/tool-meta";
import { ToolLogo } from "@/components/ui/tool-logo";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const FINDING_TYPES = [
  {
    icon: Layers,
    title: "Plan & seat fit",
    desc: "Downgrade paths when list price beats your usage",
  },
  {
    icon: Code2,
    title: "IDE overlap",
    desc: "Cursor + Copilot + Windsurf — pick one assistant",
  },
  {
    icon: Users,
    title: "Duplicate seats",
    desc: "ChatGPT, Claude, and writing tools you pay twice for",
  },
  {
    icon: Scale,
    title: "API vs subscription",
    desc: "Flat plans vs token billing — benchmark before you switch",
  },
] as const;

const WHAT_THIS_IS = {
  title: "What is SpendSense?",
  body: "A free audit of your team's AI tool spend. You list what you pay for — tools, plans, seats, and monthly cost — and we check it against public list pricing to spot overspend: wrong plan tiers, duplicate seats, overlapping coding assistants, and API vs flat subscriptions.",
  footnote:
    "You get a shareable report in under 3 minutes. No login to run the audit; email only if you want the report saved.",
};

interface AuditCoveragePanelProps {
  compact?: boolean;
  "data-testid"?: string;
}

export function AuditCoveragePanel({
  compact = false,
  "data-testid": testId,
}: AuditCoveragePanelProps) {
  return (
    <Card
      data-testid={testId}
      className="overflow-hidden rounded-lg border-border bg-card"
    >
      <CardHeader
        className={cn(
          "space-y-4 border-b border-border",
          compact ? "px-4 py-4" : "pb-6"
        )}
      >
        <div className="space-y-2">
          <CardDescription className="font-mono text-xs uppercase tracking-widest">
            {WHAT_THIS_IS.title}
          </CardDescription>
          <p
            className={cn(
              "leading-relaxed text-muted-foreground",
              compact ? "text-xs" : "text-sm"
            )}
          >
            {WHAT_THIS_IS.body}
          </p>
          <p
            className={cn(
              "font-mono text-muted-foreground/90",
              compact ? "text-[10px] leading-snug" : "text-xs"
            )}
          >
            {WHAT_THIS_IS.footnote}
          </p>
        </div>

        <div className="space-y-1 border-t border-border pt-4">
          <CardDescription className="font-mono text-xs uppercase tracking-widest">
            What we benchmark
          </CardDescription>
          <p
            className={cn(
              "font-display font-bold tracking-tight text-foreground",
              compact ? "text-lg" : "text-xl"
            )}
          >
            Your stack, your numbers
          </p>
          <p className="text-xs text-muted-foreground">
            Eight tools · rule-based savings math · no demo totals
          </p>
        </div>
      </CardHeader>

      <CardContent className={cn("space-y-4", compact ? "px-4 py-4" : "px-6 py-5")}>
        <div
          className={cn(
            "grid gap-2",
            compact ? "grid-cols-4" : "grid-cols-4"
          )}
        >
          {ALL_TOOLS.map((tool) => {
            const { name } = getToolMeta(tool);
            return (
              <div
                key={tool}
                className="flex flex-col items-center gap-1.5 rounded-md border border-border bg-muted/30 px-1 py-2"
                title={name}
              >
                <ToolLogo tool={tool} className={compact ? "h-6 w-6" : "h-7 w-7"} />
                <span className="max-w-full truncate text-center text-[10px] leading-tight text-muted-foreground">
                  {name.split(" ")[0]}
                </span>
              </div>
            );
          })}
        </div>

        <div className="space-y-2 border-t border-border pt-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Finding types
          </p>
          <ul className={cn("space-y-2", compact && "space-y-1.5")}>
            {FINDING_TYPES.map(({ icon: Icon, title, desc }) => (
              <li
                key={title}
                className={cn(
                  "flex gap-2.5 rounded-md border border-border/60 bg-background/50 px-2.5 py-2",
                  compact && "py-1.5"
                )}
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded border border-border bg-muted">
                  <Icon className="h-3 w-3 text-foreground" strokeWidth={2} />
                </span>
                <span className="min-w-0">
                  <span
                    className={cn(
                      "block font-medium text-foreground",
                      compact ? "text-xs" : "text-sm"
                    )}
                  >
                    {title}
                  </span>
                  <span
                    className={cn(
                      "block text-muted-foreground",
                      compact ? "text-[10px] leading-snug" : "text-xs"
                    )}
                  >
                    {desc}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
