# API

Base path: `/api/v1`

## GET /health

Returns service health.

## GET /check?url=

Checks a URL or domain and returns a score from 0 to 100.

## POST /report

Accepts user reports for suspicious trading websites.

```json
{
  "url": "https://example-broker.com",
  "reason": "Asked for crypto deposit and promises guaranteed returns.",
  "contactEmail": "optional@example.com"
}
```

## POST /feedback

Collects feedback about scoring accuracy.

## GET /domains?q=

Searches indexed domains.

## GET /stats

Returns public aggregate metrics.
