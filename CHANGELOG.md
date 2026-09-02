# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
