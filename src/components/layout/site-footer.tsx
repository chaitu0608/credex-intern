import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background py-10">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
        <p className="font-display text-sm font-semibold tracking-tight text-foreground">
          SpendSense
        </p>
        <p className="mt-2 font-mono text-xs text-muted-foreground">
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
