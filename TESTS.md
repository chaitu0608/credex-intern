# Tests

## Run locally

```bash
npm test          # single run
npm run test:watch  # watch mode
```

## What's covered

`src/lib/auditEngine.test.ts` — **6 unit tests** on pure audit logic:

1. High savings flag (`> $500/mo`)
2. Already-optimal solo stack (zero savings)
3. Claude Team → Pro seat optimization
4. Cursor Business → Pro downgrade
5. Windsurf alternative for Copilot Business (coding)
6. Duplicate writing assistant detection

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs on push/PR:

- `npm test`
- `npm run build`
- `npm run lint`

## Automated smoke test

```bash
npm run build && PORT=3005 npm run start
# another terminal:
SMOKE_BASE_URL=http://localhost:3005 npm run smoke
```

## Manual E2E (not automated)

See `docs/task2.json` step 2.4 — cold visit through share URL in incognito.

After Supabase keys are set:

```bash
npm run test:supabase
```
