# Deployment

## Local reproducibility

```bash
corepack enable
pnpm install
pnpm build
docker compose -f infra/compose/dev.yml up --build
```

The minimum supported runtime for the current CI baseline is Node.js 22.12 and pnpm 9.9. Use `.env.example` as a checklist; never commit real credentials.

## Required operational controls

- Put the API behind TLS and a reverse proxy with request-size and rate limits.
- Store `GOOGLE_SAFE_BROWSING_API_KEY` and `DASHBOARD_API_KEY` in a secret manager.
- Restrict dashboard and metrics routes in production with `DASHBOARD_API_KEY`.
- Configure PostgreSQL backups and test restoration before accepting consequential workloads.
- Configure Redis only as an availability/performance aid; a cache outage must not fabricate evidence.
- Monitor provider timeout rates, feed age, quota errors, and neutral-fallback counts.

## Deployment boundaries

The repository provides application code and development infrastructure. It does not claim a managed production service, a global regulator database, a service-level agreement, or regulatory certification. A production operator remains responsible for network policy, secret rotation, backups, privacy notices, incident response, and legal review.
