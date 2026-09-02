# Deployment

## Local

```bash
pnpm install
pnpm build
docker compose -f infra/compose/dev.yml up --build
```

## Production

Recommended baseline:

- API on a managed container platform.
- PostgreSQL with automated backups.
- Redis for cache and rate limits.
- Scheduled worker for source refresh.
- CDN-hosted dashboard behind authentication.
- Secrets managed through the cloud provider, not committed environment files.
