import { cn } from "@/lib/utils";

/** Stylized circular "O" mark from credex.rocks brand */
export function CredexIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M22.4 5.2c4.8 2.8 6.4 8.8 3.6 13.6-2.8 4.8-8.8 6.4-13.6 3.6-4.8-2.8-6.4-8.8-3.6-13.6 2.8-4.8 8.8-6.4 13.6-3.6Zm-2.2 4.6c-3.2-1.9-7.3-.8-9.2 2.4-1.9 3.2-.8 7.3 2.4 9.2 3.2 1.9 7.3.8 9.2-2.4 1.9-3.2.8-7.3-2.4-9.2Z"
      />
    </svg>
  );
}
