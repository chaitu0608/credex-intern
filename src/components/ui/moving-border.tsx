"use client";

import { cn } from "@/lib/utils";

/** Aceternity-style animated border — use sparingly on primary CTAs */
export function MovingBorder({
  children,
  className,
  containerClassName,
  borderClassName,
  as: Component = "button",
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  borderClassName?: string;
  as?: React.ElementType;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Component
      className={cn(
        "relative inline-flex h-11 w-full overflow-hidden rounded-lg p-[1px] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
        containerClassName
      )}
      {...props}
    >
      <span
        className={cn(
          "absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,hsl(var(--primary))_50%,transparent_100%)]",
          borderClassName
        )}
      />
      <span
        className={cn(
          "relative inline-flex h-full w-full items-center justify-center rounded-[7px] bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90",
          className
        )}
      >
        {children}
      </span>
    </Component>
  );
}
