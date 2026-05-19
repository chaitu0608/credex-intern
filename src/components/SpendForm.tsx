"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
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
import {
  calculateCurrentCost,
  formatPlanLabel,
  PLAN_OPTIONS,
  TOOL_NAMES,
} from "@/lib/pricing";
import type { AITool, AuditInput, ToolEntry, UseCase } from "@/types";

const STORAGE_KEY = "credex-audit-form-v1";
const TOOLS = Object.keys(TOOL_NAMES) as AITool[];
const USE_CASES: UseCase[] = ["coding", "writing", "data", "research", "mixed"];

const emptyRow = (): Partial<ToolEntry> => ({
  tool: undefined,
  plan: "",
  monthlySpend: 0,
  seats: 1,
});

interface SpendFormProps {
  onSubmit: (input: AuditInput) => void;
  isLoading: boolean;
}

export default function SpendForm({ onSubmit, isLoading }: SpendFormProps) {
  const [rows, setRows] = useState<Partial<ToolEntry>[]>([emptyRow()]);
  const [teamSize, setTeamSize] = useState(5);
  const [useCase, setUseCase] = useState<UseCase>("coding");
  const [website, setWebsite] = useState("");
  const [draftVisible, setDraftVisible] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as {
        rows?: Partial<ToolEntry>[];
        teamSize?: number;
        useCase?: UseCase;
      };
      if (parsed.rows?.length) setRows(parsed.rows);
      if (parsed.teamSize) setTeamSize(parsed.teamSize);
      if (parsed.useCase) setUseCase(parsed.useCase);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ rows, teamSize, useCase })
    );
    setDraftVisible(true);
    const t = setTimeout(() => setDraftVisible(false), 2000);
    return () => clearTimeout(t);
  }, [rows, teamSize, useCase]);

  const updateRow = useCallback(
    (index: number, patch: Partial<ToolEntry>) => {
      setRows((prev) =>
        prev.map((row, i) => (i === index ? { ...row, ...patch } : row))
      );
    },
    []
  );

  const addRow = () => setRows((prev) => [...prev, emptyRow()]);
  const removeRow = (index: number) =>
    setRows((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)));

  const isValid = rows.some(
    (r) =>
      r.tool &&
      r.plan &&
      (r.monthlySpend ?? 0) >= 0 &&
      (r.seats ?? 0) >= 1
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tools: ToolEntry[] = rows
      .filter((r): r is ToolEntry => Boolean(r.tool && r.plan && r.seats))
      .map((r) => ({
        tool: r.tool as AITool,
        plan: r.plan as string,
        monthlySpend: Number(r.monthlySpend) || 0,
        seats: Number(r.seats) || 1,
      }));

    if (!tools.length || teamSize < 1) return;
    onSubmit({ tools, teamSize, useCase, website });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-end">
        {draftVisible && (
          <Badge variant="secondary">Draft saved</Badge>
        )}
      </div>

      <div className="space-y-4">
        {rows.map((row, index) => {
          const tool = row.tool as AITool | undefined;
          const estimate =
            tool && row.plan
              ? calculateCurrentCost(tool, row.plan, row.seats ?? 1)
              : null;

          return (
            <Card key={index} size="sm" className="rounded-xl border-stone-200 bg-stone-50/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Tool {index + 1}
                </CardTitle>
                {rows.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground"
                    onClick={() => removeRow(index)}
                    aria-label="Remove tool"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Tool</Label>
                  <Select
                    value={row.tool ?? ""}
                    onValueChange={(v) =>
                      updateRow(index, { tool: v as AITool, plan: "" })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select tool" />
                    </SelectTrigger>
                    <SelectContent>
                      {TOOLS.map((t) => (
                        <SelectItem key={t} value={t}>
                          {TOOL_NAMES[t]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Plan</Label>
                  <Select
                    value={row.plan ?? ""}
                    disabled={!tool}
                    onValueChange={(v) => updateRow(index, { plan: v ?? "" })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select plan" />
                    </SelectTrigger>
                    <SelectContent>
                      {tool &&
                        PLAN_OPTIONS[tool].map((p) => (
                          <SelectItem key={p} value={p}>
                            {formatPlanLabel(tool, p)}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Monthly spend ($)</Label>
                  <Input
                    type="number"
                    min={0}
                    placeholder="240"
                    value={row.monthlySpend ?? ""}
                    onChange={(e) =>
                      updateRow(index, {
                        monthlySpend: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Seats</Label>
                  <Input
                    type="number"
                    min={1}
                    value={row.seats ?? 1}
                    onChange={(e) =>
                      updateRow(index, { seats: Number(e.target.value) })
                    }
                  />
                </div>
                {estimate !== null && (
                  <p className="text-xs text-muted-foreground sm:col-span-2">
                    List price estimate:{" "}
                    <span className="font-medium text-foreground">
                      ${estimate}/mo
                    </span>
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={addRow}
        className="w-full border-dashed"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add another tool
      </Button>

      <Separator />

      <Card size="sm" className="rounded-xl border-stone-200 bg-stone-50/50">
        <CardHeader>
          <CardTitle className="text-sm">Team context</CardTitle>
          <CardDescription>Used to right-size plan recommendations</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Team size</Label>
            <Input
              type="number"
              min={1}
              value={teamSize}
              onChange={(e) => setTeamSize(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label>Primary use case</Label>
            <Select value={useCase} onValueChange={(v) => setUseCase(v as UseCase)}>
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
        className="h-12 w-full rounded-full bg-foreground text-base font-semibold text-background hover:bg-foreground/90"
      >
        {isLoading ? "Running audit…" : "Run my audit →"}
      </Button>
    </form>
  );
}
