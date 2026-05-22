import { PageShell } from "@/components/layout/page-shell";

function Pulse({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-muted/60 ${className ?? ""}`}
    />
  );
}

export default function AuditLoading() {
  return (
    <PageShell headerBackHref="/" headerBackLabel="← New audit" maxWidth="xl">
      <div className="space-y-10 pb-8">
        <div className="space-y-4 border-b border-border pb-8">
          <Pulse className="h-3 w-40" />
          <Pulse className="h-10 w-2/3 max-w-md" />
          <div className="flex gap-2">
            <Pulse className="h-6 w-20" />
            <Pulse className="h-6 w-24" />
            <Pulse className="h-6 w-16" />
          </div>
        </div>

        <div className="rounded-2xl border border-border p-8 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_180px]">
            <div className="space-y-4">
              <Pulse className="h-4 w-32" />
              <Pulse className="h-16 w-48" />
              <Pulse className="h-4 w-full max-w-lg" />
              <Pulse className="h-4 w-full max-w-md" />
            </div>
            <Pulse className="h-32 w-full rounded-xl" />
          </div>
        </div>

        <div className="space-y-3">
          <Pulse className="h-6 w-36" />
          <div className="hidden rounded-xl border border-border md:block">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex justify-between border-b border-border px-6 py-4 last:border-0"
              >
                <Pulse className="h-4 w-28" />
                <Pulse className="h-4 w-20" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Pulse className="h-6 w-48" />
          <Pulse className="h-32 w-full rounded-xl" />
        </div>

        <div className="space-y-4">
          <Pulse className="h-6 w-40" />
          {[1, 2, 3].map((i) => (
            <Pulse key={i} className="h-48 w-full rounded-xl" />
          ))}
        </div>

        <p className="font-mono text-center text-xs text-muted-foreground">
          Analyzing your AI infrastructure…
        </p>
      </div>
    </PageShell>
  );
}
