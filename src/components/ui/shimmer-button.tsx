"use client";

import { cn } from "@/lib/utils";

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function ShimmerButton({
  className,
  children,
  disabled,
  type = "button",
  ...props
}: ShimmerButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        "group relative inline-flex h-12 w-full items-center justify-center overflow-hidden rounded-xl px-6 font-semibold text-primary-foreground transition-transform active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    >
      <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-500 via-cyan-500 to-violet-500" />
      <span className="absolute inset-[1px] rounded-[11px] bg-[#0a1018] transition-colors group-hover:bg-[#0d1520]" />
      <span
        className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:200%_100%] group-hover:translate-x-0"
        aria-hidden
      />
      <span className="relative z-10 flex items-center gap-2 bg-gradient-to-r from-teal-200 to-cyan-200 bg-clip-text text-transparent">
        {children}
      </span>
    </button>
  );
}
