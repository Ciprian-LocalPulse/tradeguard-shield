# Development

## Prerequisites

- Node.js 20+
- pnpm 9+

## Commands

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Local Services

The API uses memory adapters by default for local development. Set `DATABASE_URL` after applying `apps/api/db/migrations/0001_initial.sql` to activate PostgreSQL persistence. Set `REDIS_URL` to activate the Redis cache; Redis connection failures degrade to uncached requests.
