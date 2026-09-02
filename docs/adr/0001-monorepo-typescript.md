# ADR 0001: TypeScript Monorepo

## Status

Accepted

## Context

TradeGuard Shield includes an API, browser extension, dashboard, shared scoring logic, and supporting services.

## Decision

Use a pnpm TypeScript monorepo with package boundaries for shared code, configuration, logging, security, testing, collector, and worker code.

## Consequences

- Shared scoring and security logic can be tested once and reused.
- Build ordering matters and is encoded in root scripts.
- Production adapters can be added without rewriting application surfaces.
