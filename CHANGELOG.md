# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Replaced the demonstration regulator map with a real FCA Warning List RSS integration.
- Added a 15-minute regulator-feed cache, three-second timeout, neutral failure semantics, and provider-matching tests.

## [0.4.0] - 2026-09-11

### Added

- Persistence-backed dashboard statistics and domain search.
- Dashboard API-key protection for operator endpoints, with secure production misconfiguration handling.
- Real HTTPS certificate validation with a three-second timeout.
- Dashboard metrics and review queue connected to live API data.

## [0.3.0] - 2026-09-11

### Added

- Production PostgreSQL persistence selected automatically by `DATABASE_URL`.
- Production Redis cache selected automatically by `REDIS_URL`, with a neutral cache-miss fallback when Redis is unavailable.
- PostgreSQL adapter contract tests using a mocked pool.

## [0.2.0] - 2026-09-11

### Added

- Real RDAP lookups with registration age, WHOIS privacy-proxy detection, explicit timeouts, and neutral failure handling.
- OpenPhish integration with a 15-minute local cache.
- Optional Google Safe Browsing v4 integration through `GOOGLE_SAFE_BROWSING_API_KEY`.
- Durable feedback submissions with tracking IDs and timestamps.
- CI compatibility with Node 22.12.0, Vitest 5, and Vite 8.

### Verified

- Workspace tests, typechecks, builds, extension packaging, and dependency audit pass.
- GitHub Actions CI, Security, Extension Build, and CodeQL checks pass.

## [0.1.0] - 2026-09-02

### Added

- TypeScript monorepo initial setup (pnpm workspaces: `apps/`, `packages/`, `services/`).
- Fastify API with URL risk checks, report ingestion, feedback, and aggregate metrics endpoints.
- Rule-based, explainable scoring engine (`@tradeguard/shared`) with documented, testable weights.
- Manifest V3 browser extension with green/yellow/red risk badge, restricted to HTTP/HTTPS pages.
- React dashboard (MVP) for analysts and operators to review recent checks and reports.
- Signal collector and async worker service interfaces with explicit timeout handling.
- Security package: SSRF protection (blocks localhost, private IPs, non-HTTP schemes), default security headers, request correlation IDs.
- Logger package with automated sensitive-data redaction.
- Environment configuration validation package.
- Deterministic in-memory adapters for dependency-free local development.
- Docker Compose development environment.
- CI workflows for API, shared packages, dashboard, and extension (lint, typecheck, test, security audit).
- Draft PostgreSQL schema migration.
- Project governance, security policy, contributing guidelines, code of conduct, and manifesto documentation.

### Known limitations

- No production PostgreSQL or Redis adapters yet (in-memory only).
- Dashboard is not yet authenticated.
- External data-provider integrations (RDAP/WHOIS, Certificate Transparency, Safe Browsing, PhishTank/OpenPhish, financial regulator registries) are not yet connected — provider interfaces exist but return deterministic local data.
- Scoring methodology has not yet undergone independent review.

[0.1.0]: https://github.com/Ciprian-LocalPulse/tradeguard-shield/releases/tag/v0.1.0
[0.2.0]: https://github.com/Ciprian-LocalPulse/tradeguard-shield/releases/tag/v0.2.0
[0.3.0]: https://github.com/Ciprian-LocalPulse/tradeguard-shield/releases/tag/v0.3.0
[0.4.0]: https://github.com/Ciprian-LocalPulse/tradeguard-shield/releases/tag/v0.4.0
