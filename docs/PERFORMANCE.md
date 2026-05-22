# Performance and scaling

Current architecture is synchronous: one `POST /api/audit` blocks on engine + OpenAI + Supabase insert. Adequate for intern MVP; section below is the **10k audits/day** scale-out from [`ARCHITECTURE.md`](../ARCHITECTURE.md).

## Today

| Layer | Behavior |
|-------|----------|
| Audit page | `revalidate = 3600` on `/audit/[id]` |
| OG images | Per-id `opengraph-image` route |
| Engine | Recomputed every POST |
| Rate limits | Postgres `rate_limits` table |

Reads dominate after viral share — caching share URLs is highest ROI.

## At ~10k audits/day

### Caching

- Add `Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400` on SSR audit pages
- CDN-cache OG PNGs for repeat unfurls
- Optional: hash `(tools, teamSize, useCase)` → cache `runAudit` 24h

### Queues

Return `202` + `id` immediately after `runAudit`; enqueue AI summary + DB write (Vercel Queues / Inngest).

### Rate limiting

Move from Postgres to **Redis (Upstash)** sliding window; split `audit:{ip}` vs `lead:{ip}`.

### Database

- `audits_created_at_idx` exists; partition by month after ~100k rows
- Supabase pooler (Supavisor) for read spikes on share pages

### Serverless

- Keep `auditEngine` bundle lean — cold starts matter on Vercel
- **No** reliance on `memoryAudits` in production ([`src/lib/runtime.ts`](../src/lib/runtime.ts))

### Cost rough estimate (10k/day, all OpenAI)

| Service | ~Monthly |
|---------|----------|
| Vercel Pro | $20 |
| Supabase Pro | $25 |
| OpenAI (gpt-4o-mini summaries) | $600 |
| Resend | $20 |
| Upstash | $10 |

See [`ECONOMICS.md`](../ECONOMICS.md) for unit economics.

**Related:** [`BENCHMARKING.md`](BENCHMARKING.md)
