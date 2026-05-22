# SEO and social sharing

Each audit gets a **stable, crawlable URL**: `/audit/{id}`.

## Metadata

[`src/app/audit/[id]/page.tsx`](../src/app/audit/[id]/page.tsx) exports `generateMetadata`:

- `title` — savings headline or “AI spend audit”
- `description` — top recommendation snippet
- `openGraph` / `twitter` — `NEXT_PUBLIC_APP_URL` + audit id

## Open Graph images

[`src/app/audit/[id]/opengraph-image.tsx`](../src/app/audit/[id]/opengraph-image.tsx) generates a **dynamic PNG** per audit (savings total, tool count) — no separate image CDN.

Requires `NEXT_PUBLIC_APP_URL` set in production for correct absolute URLs.

## Landing page

Root [`src/app/layout.tsx`](../src/app/layout.tsx) — site-wide title, description, `og:image` for marketing page.

Copy source: [`LANDING_COPY.md`](../LANDING_COPY.md).

## Technical SEO

- SSR audit pages (not client-only) — link unfurlers get HTML
- `revalidate = 3600` — edge cache for immutable reports
- No user-generated index spam — ids are unguessable nanoids

**Related:** [`API.md`](API.md), [`DEPLOYMENT.md`](DEPLOYMENT.md)
