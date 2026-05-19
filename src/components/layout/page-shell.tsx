import { AuroraBackground } from "@/components/ui/aurora-background";
import { GridBackground } from "@/components/ui/grid-background";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

interface PageShellProps {
  children: React.ReactNode;
  headerBackHref?: string;
  headerBackLabel?: string;
  maxWidth?: "md" | "lg" | "xl";
}

const widthClass = {
  md: "max-w-3xl",
  lg: "max-w-5xl",
  xl: "max-w-6xl",
};

export function PageShell({
  children,
  headerBackHref,
  headerBackLabel,
  maxWidth = "lg",
}: PageShellProps) {
  return (
    <div className="relative min-h-screen">
      <AuroraBackground />
      <GridBackground />
      <SiteHeader backHref={headerBackHref} backLabel={headerBackLabel} />
      <main
        className={`relative mx-auto ${widthClass[maxWidth]} px-4 pb-16 pt-4 sm:px-6 sm:pt-8`}
      >
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
