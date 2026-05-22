import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PROBLEMS = [
  {
    title: "AI overspending",
    body: "Teams stack Cursor, Claude, ChatGPT, and Copilot without reconciling seat minimums or plan tiers — spend drifts 20–40% above list-fit pricing.",
  },
  {
    title: "Subscription chaos",
    body: "Monthly invoices across vendors make it hard to see total AI burn or which line items are actually necessary for your team size.",
  },
  {
    title: "Duplicate tools",
    body: "Overlapping IDE assistants and chat products often mean paying twice for the same coding or writing workflow.",
  },
] as const;

const QUOTES = [
  {
    text: "I found $340/mo in overspend in 3 minutes — already cancelled one seat.",
    role: "Founder, seed-stage SaaS",
  },
  {
    text: "Finally a tool that doesn't try to sell me a consultant.",
    role: "Engineering manager, Series A",
  },
  {
    text: "Took my audit screenshot to the next finance review. Made the cut decision a 2-minute call.",
    role: "Operations lead, Series B",
  },
] as const;

const FAQ_ITEMS = [
  {
    q: "Is this actually free? What's the catch?",
    a: "Yes — the audit costs nothing and requires no login. Credex sells discounted AI infrastructure credits. For audits showing more than $500/month in potential savings, we surface a Credex consultation CTA. The per-tool recommendations are yours either way.",
  },
  {
    q: "How do you know your pricing numbers are right?",
    a: "Every price traces to the vendor's public pricing page. We re-verify regularly. See PRICING_DATA.md in the repo for source URLs and verification dates.",
  },
  {
    q: "Why don't you require an email upfront?",
    a: "Gating the audit behind email destroys conversion. An email captured after someone has seen real savings is worth more — we always show the audit first.",
  },
  {
    q: "Do you store my company's spend data?",
    a: "Only the inputs you submitted and the resulting audit are stored, linked to a random ID. Email is only attached if you save the report. The audit URL is public — no PII on the audit page itself.",
  },
  {
    q: "What if my stack is already optimized?",
    a: "You'll see a Stack optimized result. We don't manufacture savings. You can still save the report and we'll notify you when new optimization rules apply.",
  },
] as const;

export function LandingProblem() {
  return (
    <section className="border-t border-border py-16 sm:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          The problem
        </p>
        <h2 className="font-display mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
          AI spend is opaque until finance asks
        </h2>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {PROBLEMS.map((item) => (
          <div
            key={item.title}
            className="rounded-xl border border-border bg-card p-6 shadow-sm"
          >
            <h3 className="font-semibold text-foreground">{item.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {item.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function LandingSocialProof() {
  return (
    <section className="border-t border-border bg-muted/15 py-16 sm:py-20">
      <div className="text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Social proof
        </p>
        <h2 className="font-display mt-3 text-2xl font-bold tracking-tight">
          Built for finance-minded teams
        </h2>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {QUOTES.map((quote) => (
          <blockquote
            key={quote.role}
            className="rounded-xl border border-border bg-card p-6"
          >
            <p className="text-sm leading-relaxed text-foreground/90">
              &ldquo;{quote.text}&rdquo;
            </p>
            <footer className="mt-4 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
              — {quote.role}
            </footer>
          </blockquote>
        ))}
      </div>
      <p className="mt-8 text-center font-mono text-[10px] text-muted-foreground">
        Placeholder quotes — replace with real user feedback post-launch. Tools
        benchmarked: Cursor · Claude · ChatGPT · Copilot · Gemini · Windsurf
      </p>
    </section>
  );
}

export function LandingFaq() {
  return (
    <section id="faq" className="border-t border-border py-16 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          FAQ
        </p>
        <h2 className="font-display mt-3 text-2xl font-bold tracking-tight">
          Common questions
        </h2>
        <div className="mt-8 space-y-3">
          {FAQ_ITEMS.map((item) => (
            <details
              key={item.q}
              className="group rounded-lg border border-border bg-card px-4 py-3"
            >
              <summary className="cursor-pointer list-none font-medium text-foreground [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-2">
                  {item.q}
                  <span className="font-mono text-xs text-muted-foreground group-open:rotate-45">
                    +
                  </span>
                </span>
              </summary>
              <p className="mt-3 pb-2 text-sm leading-relaxed text-muted-foreground">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LandingFinalCta() {
  return (
    <section className="border-t border-border py-16 sm:py-24">
      <div className="rounded-2xl border border-accent/30 bg-accent/5 px-8 py-12 text-center sm:px-12">
        <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
          Know exactly where your AI budget leaks
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
          Free 3-minute audit. No login. Defensible math your team can share with
          finance.
        </p>
        <Link
          href="/#audit-form"
          className={cn(
            buttonVariants({ size: "lg" }),
            "mt-8 inline-flex rounded-md bg-foreground px-8 text-background hover:bg-foreground/90"
          )}
        >
          Start audit
        </Link>
      </div>
    </section>
  );
}
