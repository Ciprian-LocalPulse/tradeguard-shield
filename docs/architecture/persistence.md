# Persistence Architecture

The repository includes memory adapters for local development and PostgreSQL/Redis adapters for production deployments.

## Tables

- `domains`
- `checks`
- `signals`
- `reports`
- `feedback`
- `audit_events`

## Production Path

1. Set `DATABASE_URL` for the API deployment.
2. Apply migrations from `apps/api/db/migrations`.
3. The runtime selects `PostgresPersistenceAdapter` automatically when `DATABASE_URL` is present.
4. Run integration tests with a disposable database before production rollout.
5. Add backup and retention policies.

The cache follows the same selection rule: `REDIS_URL` activates Redis, otherwise the process uses the in-memory cache. Cache connection failures are treated as misses and never fail a domain check.
