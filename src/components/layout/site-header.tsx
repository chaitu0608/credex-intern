import Link from "next/link";
import { BrandLockup } from "@/components/ui/brand-lockup";
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
      <div className="mx-auto flex max-w-6xl min-w-0 items-center justify-between gap-2 px-3 py-3 sm:gap-4 sm:px-6 sm:py-4">
        <div className="min-w-0 flex-1">
          {backHref ? (
            <Link
              href={backHref}
              className="inline-block max-w-full truncate font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {backLabel ?? "← Back"}
            </Link>
          ) : (
            <BrandLockup compact />
          )}
        </div>

        <nav className="hidden items-center gap-4 md:flex md:gap-6">
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

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <ThemeToggle />
          <Link
            href="/#audit-form"
            className={cn(
              buttonVariants({ size: "sm" }),
              "inline-flex rounded-md bg-foreground px-2.5 text-background hover:bg-foreground/90 sm:px-4"
            )}
          >
            <span className="sm:hidden">Audit</span>
            <span className="hidden sm:inline">Start audit</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
