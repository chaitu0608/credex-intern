# Design system

Lightweight system for a single-product marketing + audit UI — not a published package.

## Tokens

[`src/app/globals.css`](../src/app/globals.css):

| Token | Usage |
|-------|--------|
| `--accent` (hsl 142 71% 45%) | Savings amounts, positive actions |
| `--foreground` / `--background` | Light + `.dark` themes |
| `--radius` | Card and button rounding (0.5rem) |
| `.text-savings` | Display savings figures |
| `.font-display` | Hero headlines (Bricolage Grotesque) |

## Typography

- **Sans:** Geist / system UI — body and UI chrome
- **Display:** Bricolage Grotesque — landing hero, audit hero

Configured in [`src/app/layout.tsx`](../src/app/layout.tsx).

## Components

| Layer | Path |
|-------|------|
| Primitives | `src/components/ui/` — shadcn (Button, Card, Dialog, …) |
| Brand | `credex-mark.tsx`, `brand-lockup.tsx`, `credex-icon.tsx` |
| Layout | `src/components/layout/` — header, footer, page shell |
| Audit | `src/components/audit/` — hero, results, lead capture, chat |
| Form | `src/components/spend-form/` — stack cards, tool picker |

## Visual direction

- **Internal fintech** over hackathon neon — restrained palette, whitespace, no fake urgency
- Tool logos in `public/logos/` — SVG brand marks for stack cards
- Savings green only where numbers are real engine output

## Responsive

Mobile-first audit report: stacked recommendation cards, full-width modals, sticky CTA on small screens.

**Related:** [`LANDING_COPY.md`](../LANDING_COPY.md), [`ACCESSIBILITY.md`](ACCESSIBILITY.md)
