import Image from "next/image";
import { cn } from "@/lib/utils";

interface CredexMarkProps {
  className?: string;
  size?: "sm" | "md";
}

/** Credex brand mark — gradient monogram from public/credex-mark.svg */
export function CredexMark({ className, size = "sm" }: CredexMarkProps) {
  const dim = size === "md" ? 24 : 20;

  return (
    <Image
      src="/credex-mark.svg"
      alt="Credex"
      width={dim}
      height={dim}
      className={cn("shrink-0 rounded-md", className)}
      priority={false}
    />
  );
}
