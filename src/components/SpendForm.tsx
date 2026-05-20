"use client";

import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyStack } from "@/components/spend-form/empty-stack";
import { StackCard } from "@/components/spend-form/stack-card";
import { ToolCard } from "@/components/spend-form/tool-card";
import { ALL_TOOLS } from "@/lib/tool-meta";
import { PLAN_OPTIONS } from "@/lib/pricing";
import type { AITool, AuditInput, ToolEntry, UseCase } from "@/types";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "credex-audit-form-v1";
const USE_CASES: UseCase[] = ["coding", "writing", "data", "research", "mixed"];

function defaultEntry(tool: AITool): ToolEntry {
  const defaultPlan = PLAN_OPTIONS[tool][0] ?? "";
  return {
    tool,
    plan: defaultPlan,
    monthlySpend: 0,
    seats: 1,
  };
}

type StoredDraft = {
  stack?: ToolEntry[];
  rows?: Partial<ToolEntry>[];
  teamSize?: number;
  useCase?: UseCase;
};

interface SpendFormProps {
  onSubmit: (input: AuditInput) => void;
  isLoading: boolean;
}

export default function SpendForm({ onSubmit, isLoading }: SpendFormProps) {
  const [stack, setStack] = useState<ToolEntry[]>([]);
  const [teamSize, setTeamSize] = useState(5);
  const [useCase, setUseCase] = useState<UseCase>("coding");
  const [website, setWebsite] = useState("");
  const [draftVisible, setDraftVisible] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as StoredDraft;
      if (parsed.stack?.length) {
        setStack(parsed.stack);
      } else if (parsed.rows?.length) {
        const migrated = parsed.rows
          .filter((r): r is ToolEntry => Boolean(r.tool && r.plan && r.seats))
          .map((r) => ({
            tool: r.tool as AITool,
            plan: r.plan as string,
            monthlySpend: Number(r.monthlySpend) || 0,
            seats: Number(r.seats) || 1,
          }));
        if (migrated.length) setStack(migrated);
      }
      if (parsed.teamSize) setTeamSize(parsed.teamSize);
      if (parsed.useCase) setUseCase(parsed.useCase);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ stack, teamSize, useCase })
    );
    setDraftVisible(true);
    const t = setTimeout(() => setDraftVisible(false), 2000);
    return () => clearTimeout(t);
  }, [stack, teamSize, useCase]);

  const isInStack = useCallback(
    (tool: AITool) => stack.some((e) => e.tool === tool),
    [stack]
  );

  const toggleTool = useCallback((tool: AITool) => {
    setStack((prev) => {
      if (prev.some((e) => e.tool === tool)) {
        return prev.filter((e) => e.tool !== tool);
      }
      return [...prev, defaultEntry(tool)];
    });
  }, []);

  const addToolFromDrag = useCallback((tool: AITool) => {
    setStack((prev) => {
      if (prev.some((e) => e.tool === tool)) return prev;
      return [...prev, defaultEntry(tool)];
    });
  }, []);

  const handleDragStart = (e: React.DragEvent, tool: AITool) => {
    e.dataTransfer.setData("application/x-spendsense-tool", tool);
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const tool = e.dataTransfer.getData(
      "application/x-spendsense-tool"
    ) as AITool;
    if (tool && ALL_TOOLS.includes(tool)) {
      addToolFromDrag(tool);
    }
  };

  const updateEntry = (index: number, patch: Partial<ToolEntry>) => {
    setStack((prev) =>
      prev.map((entry, i) => (i === index ? { ...entry, ...patch } : entry))
    );
  };

  const removeEntry = (index: number) => {
    setStack((prev) => prev.filter((_, i) => i !== index));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setStack((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  };

  const moveDown = (index: number) => {
    setStack((prev) => {
      if (index >= prev.length - 1) return prev;
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  };

  const isValid =
    stack.length > 0 &&
    stack.every(
      (e) => e.plan && e.monthlySpend >= 0 && e.seats >= 1
    ) &&
    teamSize >= 1;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    onSubmit({ tools: stack, teamSize, useCase, website });
  };

  const labelClass =
    "text-xs font-medium uppercase tracking-wide text-muted-foreground";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center justify-end">
        {draftVisible && (
          <Badge variant="outline" className="font-mono text-xs">
            Draft saved
          </Badge>
        )}
      </div>

      <section>
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-foreground">Add your tools</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            <span className="hidden [@media(hover:hover)]:inline">
              Click to add, or drag a card into your stack below
            </span>
            <span className="[@media(hover:hover)]:hidden">
              Tap a tool to add it to your stack below
            </span>
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {ALL_TOOLS.map((tool) => (
            <ToolCard
              key={tool}
              tool={tool}
              selected={isInStack(tool)}
              onToggle={toggleTool}
              onDragStart={handleDragStart}
            />
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-foreground">Your stack</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Configure plan, seats, and monthly spend for each tool
          </p>
        </div>
        <div
          role="region"
          aria-label="Your stack"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "space-y-3 rounded-lg transition-colors",
            isDragOver && stack.length > 0 && "ring-2 ring-accent/30"
          )}
        >
          {stack.length === 0 ? (
            <EmptyStack isDragOver={isDragOver} />
          ) : (
            stack.map((entry, index) => (
              <StackCard
                key={entry.tool}
                entry={entry}
                index={index}
                total={stack.length}
                onUpdate={updateEntry}
                onRemove={removeEntry}
                onMoveUp={moveUp}
                onMoveDown={moveDown}
              />
            ))
          )}
        </div>
      </section>

      <Separator />

      <Card className="rounded-lg border-border bg-muted/30">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Team context</CardTitle>
          <CardDescription>
            Used to right-size plan recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className={labelClass}>Team size</Label>
            <Input
              type="number"
              min={1}
              value={teamSize}
              onChange={(e) => setTeamSize(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label className={labelClass}>Primary use case</Label>
            <Select
              value={useCase}
              onValueChange={(v) => setUseCase(v as UseCase)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {USE_CASES.map((uc) => (
                  <SelectItem key={uc} value={uc} className="capitalize">
                    {uc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <input
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
      />

      <Button
        type="submit"
        size="lg"
        disabled={!isValid || isLoading}
        className="h-14 w-full rounded-md bg-foreground text-base font-semibold text-background hover:bg-foreground/90"
      >
        {isLoading ? "Running audit…" : "Run my audit →"}
      </Button>
    </form>
  );
}
