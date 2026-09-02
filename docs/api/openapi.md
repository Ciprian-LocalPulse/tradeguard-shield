# OpenAPI Plan

The API currently exposes stable JSON routes and Zod validation. A generated OpenAPI document should be added before public API launch.

## Current API Surface

- `GET /api/v1/health`
- `GET /api/v1/health/live`
- `GET /api/v1/health/ready`
- `GET /api/v1/metrics`
- `GET /api/v1/check?url=`
- `POST /api/v1/report`
- `POST /api/v1/feedback`
- `GET /api/v1/domains?q=`
- `GET /api/v1/stats`

## Production Requirement

Use Fastify schema definitions or a Zod-to-OpenAPI generator so route validation and documentation cannot drift.
