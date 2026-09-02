# API Reference

Base path: `/api/v1`

## Endpoints

```mermaid
flowchart TB
  API[API v1]
  API --> Health["GET /health"]
  API --> Check["GET /check?url="]
  API --> Report["POST /report"]
  API --> Feedback["POST /feedback"]
  API --> Domains["GET /domains?q="]
  API --> Stats["GET /stats"]
```

## Check Response

```json
{
  "domain": "example-broker.com",
  "score": 38,
  "riskLevel": "medium",
  "badge": "yellow",
  "reasons": [
    {
      "code": "DOMAIN_YOUNG",
      "severity": "warning",
      "detail": "Domain age is below the configured trust threshold.",
      "source": "rdap"
    }
  ],
  "checkedAt": "2026-09-02T10:00:00.000Z",
  "cacheTtlSeconds": 86400
}
```
