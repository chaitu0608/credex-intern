# P4 frontend cross-check (2026-05-21)

## P4.1 — Mobile hero aside (audit coverage panel)

- [`audit-coverage-panel.tsx`](../../../src/components/audit/audit-coverage-panel.tsx)
- Desktop: right column (`lg:block`)
- Mobile: compact card above audit form (`lg:hidden`)
- E2E: `tests/e2e/mobile-landing.spec.ts` (Pixel 5 project)

## P4.2 — Accessibility

- E2E-005: landing axe (wcag2a/aa), zero critical
- E2E-005b: full audit flow → results page axe, zero critical
- Honeypot: `tabIndex={-1}`, `aria-hidden` on audit + lead forms

## P4.3 — Lead form errors

- 503 → explicit retry message
- 400 → server validation message

## P4.5 — 429 UX

- `page.tsx` dedicated toast before generic error handler

## Verification

```bash
npm run test:e2e
npm run lint && npm test && npm run build
```
