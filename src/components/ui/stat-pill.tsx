import { cn } from "@/lib/utils";

interface StatPillProps {
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function StatPill({ icon, children, className }: StatPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-muted-foreground backdrop-blur-sm transition-colors hover:border-teal-500/25 hover:bg-teal-500/5 hover:text-foreground",
        className
      )}
    >
      {icon}
      {children}
    </span>
  );
}
