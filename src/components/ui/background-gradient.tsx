"use client";

import { cn } from "@/lib/utils";

export function BackgroundGradient({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none fixed inset-0 -z-10 overflow-hidden", className)}>
      <div className="absolute inset-0 bg-[#060a12]" aria-hidden />
      <div
        className="animate-aurora absolute -left-[20%] -top-[30%] h-[70vh] w-[70vh] rounded-full bg-teal-500/20 blur-[120px]"
        aria-hidden
      />
      <div
        className="animate-aurora absolute -right-[15%] top-[10%] h-[60vh] w-[60vh] rounded-full bg-violet-600/25 blur-[120px] [animation-delay:2s]"
        aria-hidden
      />
      <div
        className="animate-aurora absolute bottom-[-20%] left-[30%] h-[50vh] w-[50vh] rounded-full bg-cyan-500/15 blur-[100px] [animation-delay:4s]"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#060a12_70%)]"
        aria-hidden
      />
    </div>
  );
}
