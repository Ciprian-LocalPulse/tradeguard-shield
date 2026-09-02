# Roadmap

## Stage 1 - MVP

- API check endpoint
- Manifest V3 extension
- Rule-based scoring
- Mock signal providers
- Basic dashboard

## Stage 2 - Real Integrations

- RDAP adapter
- Certificate Transparency adapter
- Threat-feed ingestion
- Initial regulator registry connectors

## Stage 3 - Persistence and Alerts

- PostgreSQL schema
- Redis cache
- User reports
- Watchlists
- Pro alerts

## Stage 4 - Methodology Review

- Labeled benchmark dataset
- Score calibration
- False-positive appeal workflow
- Independent scoring-methodology review

```mermaid
gantt
  title TradeGuard Shield Roadmap
  dateFormat  YYYY-MM-DD
  section MVP
  API and extension           :done, 2026-09-02, 14d
  section Integrations
  RDAP and threat feeds       :active, 2026-09-16, 30d
  section Platform
  Persistence and alerts      :2026-10-16, 45d
  section Assurance
  Security and methodology review :2026-12-01, 45d
```
