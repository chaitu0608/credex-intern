import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/80 bg-white/70 py-8">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
        <p className="font-display text-sm font-semibold text-foreground">
          SpendSense
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Free AI spend audit · Powered by{" "}
          <Link
            href="https://credex.rocks"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary hover:underline"
          >
            Credex
          </Link>
        </p>
      </div>
    </footer>
  );
}
