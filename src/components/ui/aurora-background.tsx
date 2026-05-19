import { cn } from "@/lib/utils";

export function AuroraBackground({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 -z-20 overflow-hidden",
        className
      )}
      aria-hidden
    >
      <div
        className="absolute -left-[20%] top-[10%] h-[55vh] w-[55vw] rounded-full opacity-[0.14] blur-[100px] dark:opacity-[0.18] animate-aurora-drift-a"
        style={{
          background:
            "radial-gradient(circle, hsl(172 66% 50%) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute -right-[15%] top-[30%] h-[50vh] w-[50vw] rounded-full opacity-[0.12] blur-[100px] dark:opacity-[0.16] animate-aurora-drift-b"
        style={{
          background:
            "radial-gradient(circle, hsl(262 83% 58%) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-[5%] left-[25%] h-[45vh] w-[45vw] rounded-full opacity-[0.1] blur-[90px] dark:opacity-[0.14] animate-aurora-drift-c"
        style={{
          background:
            "radial-gradient(circle, hsl(199 89% 48%) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}
