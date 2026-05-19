import Link from "next/link";
import { BrandLockup } from "@/components/ui/brand-lockup";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 sm:px-6">
        <BrandLockup markSize="md" href="/" />
        <p className="font-mono text-xs text-muted-foreground">
          Free AI spend audit · Powered by{" "}
          <Link
            href="https://credex.rocks"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground underline-offset-4 hover:underline"
          >
            Credex
          </Link>
        </p>
      </div>
    </footer>
  );
}
