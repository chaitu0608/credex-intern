import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SiteHeaderProps {
  backHref?: string;
  backLabel?: string;
}

const NAV_LINKS = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "Tools", href: "/#tools" },
  { label: "Credex", href: "https://credex.rocks", external: true },
] as const;

export function SiteHeader({ backHref, backLabel }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 px-4 py-4 sm:px-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full border border-border/80 bg-white/90 px-4 py-2.5 shadow-[0_2px_24px_rgba(15,23,42,0.06)] backdrop-blur-md sm:px-5">
        {backHref ? (
          <Link
            href={backHref}
            className="shrink-0 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            {backLabel ?? "← Back"}
          </Link>
        ) : (
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-[hsl(var(--spendsense-indigo))] text-sm font-bold text-white shadow-sm">
              S
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-foreground">
              SpendSense
            </span>
          </Link>
        )}

        <nav className="hidden items-center gap-0.5 rounded-full bg-muted/80 p-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              target={"external" in link && link.external ? "_blank" : undefined}
              rel={
                "external" in link && link.external
                  ? "noopener noreferrer"
                  : undefined
              }
              className="rounded-full px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-white hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/#audit-form"
          className={cn(
            buttonVariants({ size: "sm" }),
            "hidden rounded-full bg-foreground px-5 text-background hover:bg-foreground/90 sm:inline-flex"
          )}
        >
          Start audit
        </Link>
      </div>
    </header>
  );
}
