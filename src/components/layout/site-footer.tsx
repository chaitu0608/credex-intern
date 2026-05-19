import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-stone-200/80 bg-white/60 py-8">
      <p className="text-center text-sm text-muted-foreground">
        Built by{" "}
        <Link
          href="https://credex.rocks"
          className="font-medium text-primary hover:underline"
        >
          Credex
        </Link>
        <span className="mx-2 text-stone-300">·</span>
        credex.rocks
      </p>
    </footer>
  );
}
