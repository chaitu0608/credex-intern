import { cn } from "@/lib/utils";

interface AuditStackHealthProps {
  toolCount: number;
  totalMonthlySpend: number;
  totalMonthlySavings: number;
  optimizationScore: number;
}

const ROWS: {
  key: keyof Omit<AuditStackHealthProps, never>;
  label: string;
  format: (p: AuditStackHealthProps) => string;
}[] = [
  { key: "toolCount", label: "Total tools", format: (p) => String(p.toolCount) },
  {
    key: "totalMonthlySpend",
    label: "Monthly spend",
    format: (p) => `$${p.totalMonthlySpend.toLocaleString()}`,
  },
  {
    key: "totalMonthlySavings",
    label: "Potential savings",
    format: (p) =>
      p.totalMonthlySavings > 0
        ? `$${p.totalMonthlySavings.toLocaleString()}/mo`
        : "$0",
  },
  {
    key: "optimizationScore",
    label: "Optimization score",
    format: (p) => `${p.optimizationScore}/100`,
  },
];

export default function AuditStackHealth(props: AuditStackHealthProps) {
  return (
    <section aria-labelledby="stack-health-heading">
      <div className="mb-6 space-y-1">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Overview
        </p>
        <h2
          id="stack-health-heading"
          className="font-display text-xl font-bold tracking-tight sm:text-2xl"
        >
          Stack health
        </h2>
        <p className="text-sm text-muted-foreground">
          Snapshot of your reported AI spend and optimization opportunity.
        </p>
      </div>

      <div className="hidden overflow-hidden rounded-xl border border-border md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-6 py-3 text-left font-mono text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Metric
              </th>
              <th className="px-6 py-3 text-right font-mono text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Value
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row, i) => (
              <tr
                key={row.label}
                className={cn(
                  "border-b border-border last:border-0",
                  i % 2 === 0 ? "bg-card" : "bg-card/50"
                )}
              >
                <td className="px-6 py-4 font-medium text-foreground">
                  {row.label}
                </td>
                <td className="px-6 py-4 text-right font-mono tabular-nums text-foreground">
                  {row.format(props)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 md:hidden">
        {ROWS.map((row) => (
          <div
            key={row.label}
            className="rounded-xl border border-border bg-card px-4 py-4"
          >
            <p className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
              {row.label}
            </p>
            <p className="mt-1 font-mono text-lg font-semibold tabular-nums">
              {row.format(props)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
