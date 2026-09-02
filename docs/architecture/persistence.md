# Persistence Architecture

The repository includes a persistence port and memory adapter. The PostgreSQL adapter is intentionally documented as requiring implementation before production use.

## Tables

- `domains`
- `checks`
- `signals`
- `reports`
- `feedback`
- `audit_events`

## Production Path

1. Add a PostgreSQL client.
2. Apply migrations from `apps/api/db/migrations`.
3. Implement `PostgresPersistenceAdapter`.
4. Add integration tests with a disposable database.
5. Add backup and retention policies.
