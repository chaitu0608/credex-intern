# Accessibility

Target: **Lighthouse Accessibility ≥ 90** on mobile (logged in [`DEVLOG.md`](../DEVLOG.md) when run).

## Automated tests

Playwright a11y suite in [`tests/e2e/accessibility.spec.ts`](../tests/e2e/accessibility.spec.ts):

- Landing page — axe-core scan
- Audit results page — keyboard focus, headings, form labels
- Sample audit preview dialog

Run:

```bash
npx playwright install chromium
npm run test:e2e -- tests/e2e/accessibility.spec.ts
```

## Implementation choices

| Area | Approach |
|------|----------|
| Forms | Labels on tool/plan/seat inputs; error text tied to fields |
| Modals | Sample audit dialog — focus trap via Radix/shadcn |
| Color | Savings green (`--accent`) meets contrast on white/dark |
| Motion | No autoplay; `prefers-reduced-motion` respected in globals |
| Icons | Decorative SVGs with `aria-hidden` where adjacent text exists |

## Manual checklist

- Tab through SpendForm → submit → audit page without mouse
- Screen reader: hero savings number announced with context
- OG/share buttons have accessible names

**Related:** [`TESTS.md`](../TESTS.md), [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md)
