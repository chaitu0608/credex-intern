import Link from "next/link";

interface SiteHeaderProps {
  backHref?: string;
  backLabel?: string;
}

export function SiteHeader({ backHref, backLabel }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 px-4 py-4 sm:px-6">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 rounded-full border border-stone-200/80 bg-white/90 px-4 py-2.5 shadow-[0_2px_20px_rgba(0,0,0,0.06)] backdrop-blur-md sm:px-6">
        {backHref ? (
          <Link
            href={backHref}
            className="shrink-0 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            {backLabel ?? "← Back"}
          </Link>
        ) : (
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
              C
            </span>
            <span className="font-semibold text-foreground">credex</span>
          </Link>
        )}

        <nav className="hidden items-center gap-1 rounded-full bg-stone-100 p-1 md:flex">
          <span className="rounded-full bg-accent px-4 py-1.5 text-xs font-medium text-accent-foreground">
            AI Spend Audit
          </span>
          <Link
            href="https://credex.rocks"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full px-4 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Buy Credits
          </Link>
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          {["How it Works", "FAQ", "Contact"].map((link) => (
            <Link
              key={link}
              href="https://credex.rocks"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              {link}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
