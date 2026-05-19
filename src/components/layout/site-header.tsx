import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
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
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        {backHref ? (
          <Link
            href={backHref}
            className="shrink-0 font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {backLabel ?? "← Back"}
          </Link>
        ) : (
          <Link
            href="/"
            className="font-display shrink-0 text-lg font-bold tracking-tight text-foreground"
          >
            SpendSense
          </Link>
        )}

        <nav className="hidden items-center gap-6 md:flex">
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
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/#audit-form"
            className={cn(
              buttonVariants({ size: "sm" }),
              "hidden rounded-md bg-foreground px-4 text-background hover:bg-foreground/90 sm:inline-flex"
            )}
          >
            Start audit
          </Link>
        </div>
      </div>
    </header>
  );
}
