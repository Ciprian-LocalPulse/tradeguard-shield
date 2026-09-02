# Architecture

TradeGuard Shield is a monorepo with four main layers:

1. Browser extension detects the current tab URL and requests a risk verdict.
2. API normalizes the URL, checks cache, gathers domain signals, calculates a score, and returns evidence.
3. Shared package owns URL normalization, score thresholds, risk types, and reusable logic.
4. Dashboard gives analysts visibility into reports, check volume, and high-risk domains.

## Check Flow

```text
Browser tab -> Extension background worker -> API /api/v1/check
  -> cache lookup
  -> RDAP, TLS, threat feed, regulator, content signals
  -> explainable scoring
  -> response persisted and returned
```

## Production Additions

- PostgreSQL for domains, reports, feedback, and regulator matches.
- Redis for check cache and rate-limit state.
- Queue worker for periodic data-source refresh.
- Object storage for evidence snapshots.
- Observability through OpenTelemetry, Prometheus, and Grafana.
