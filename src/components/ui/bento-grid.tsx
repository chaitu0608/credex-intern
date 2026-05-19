import { cn } from "@/lib/utils";

export function BentoGrid({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4",
        className
      )}
    >
      {children}
    </div>
  );
}

export function BentoStatCard({
  value,
  label,
  className,
}: {
  value: string;
  label: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col justify-center rounded-2xl bg-[hsl(var(--spendsense-dark))] p-6 text-white",
        className
      )}
    >
      <p className="text-2xl font-bold tracking-tight md:text-3xl">{value}</p>
      <p className="mt-1 text-sm text-stone-400">{label}</p>
    </div>
  );
}

export function BentoFeatureCard({
  title,
  description,
  className,
}: {
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col justify-between rounded-2xl bg-[hsl(var(--spendsense-dark))] p-6 text-white lg:col-span-2 lg:row-span-2 lg:p-8",
        className
      )}
    >
      <div>
        <p className="text-xs font-medium uppercase tracking-widest text-stone-500">
          Free audit
        </p>
        <h3 className="mt-4 font-display text-2xl font-bold leading-tight md:text-3xl">
          {title}
        </h3>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-stone-400">
          {description}
        </p>
      </div>
      <div className="mt-8 flex flex-wrap gap-2">
        {["Cursor", "Claude", "ChatGPT", "Copilot", "Gemini"].map((t) => (
          <span
            key={t}
            className="rounded-lg border border-stone-700 bg-stone-800/50 px-3 py-1 text-xs text-stone-300"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
