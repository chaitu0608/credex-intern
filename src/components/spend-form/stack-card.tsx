"use client";

import { ChevronDown, ChevronUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  calculateCurrentCost,
  formatPlanLabel,
  PLAN_OPTIONS,
} from "@/lib/pricing";
import { getToolMeta } from "@/lib/tool-meta";
import { ToolLogo } from "@/components/ui/tool-logo";
import type { ToolEntry } from "@/types";

interface StackCardProps {
  entry: ToolEntry;
  index: number;
  total: number;
  onUpdate: (index: number, patch: Partial<ToolEntry>) => void;
  onRemove: (index: number) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
}

export function StackCard({
  entry,
  index,
  total,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
}: StackCardProps) {
  const meta = getToolMeta(entry.tool);
  const estimate = entry.plan
    ? calculateCurrentCost(entry.tool, entry.plan, entry.seats)
    : null;

  const labelClass =
    "text-xs font-medium uppercase tracking-wide text-muted-foreground";

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <ToolLogo tool={entry.tool} className="h-9 w-9 shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">{meta.name}</p>
            <p className="text-xs text-muted-foreground">{meta.description}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-0.5 self-start">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            disabled={index === 0}
            onClick={() => onMoveUp(index)}
            aria-label={`Move ${meta.name} up`}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            disabled={index === total - 1}
            onClick={() => onMoveDown(index)}
            aria-label={`Move ${meta.name} down`}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={() => onRemove(index)}
            aria-label={`Remove ${meta.name}`}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2 sm:col-span-1">
          <Label htmlFor={`plan-${index}`} className={labelClass}>
            Plan
          </Label>
          <Select
            value={entry.plan}
            onValueChange={(v) => onUpdate(index, { plan: v ?? entry.plan })}
          >
            <SelectTrigger
              id={`plan-${index}`}
              aria-label={`Plan for ${meta.name}`}
            >
              <SelectValue placeholder="Select plan" />
            </SelectTrigger>
            <SelectContent>
              {PLAN_OPTIONS[entry.tool].map((p) => (
                <SelectItem key={p} value={p}>
                  {formatPlanLabel(entry.tool, p)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor={`spend-${index}`} className={labelClass}>
            Monthly spend ($)
          </Label>
          <Input
            id={`spend-${index}`}
            type="number"
            min={0}
            value={entry.monthlySpend || ""}
            onChange={(e) =>
              onUpdate(index, { monthlySpend: Number(e.target.value) })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`seats-${index}`} className={labelClass}>
            Seats
          </Label>
          <Input
            id={`seats-${index}`}
            type="number"
            min={1}
            value={entry.seats}
            onChange={(e) =>
              onUpdate(index, { seats: Number(e.target.value) })
            }
          />
        </div>
      </div>
      {estimate !== null && (
        <p className="mt-3 font-mono text-xs text-muted-foreground">
          List price estimate:{" "}
          <span className="text-foreground">${estimate}/mo</span>
        </p>
      )}
    </div>
  );
}
