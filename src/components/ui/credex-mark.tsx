import Image from "next/image";
import { cn } from "@/lib/utils";

interface CredexMarkProps {
  className?: string;
  size?: "sm" | "md";
}

/** Official Credex wordmark — icon + "credex" from credex.rocks brand assets */
const LOGO_ASPECT = 502 / 124;

export function CredexMark({ className, size = "sm" }: CredexMarkProps) {
  const height = size === "md" ? 24 : 20;
  const width = Math.round(height * LOGO_ASPECT);

  return (
    <Image
      src="/credex-logo.png"
      alt="Credex"
      width={width}
      height={height}
      className={cn("shrink-0", className)}
      priority={false}
    />
  );
}
