# OpenAPI Contract

The API publishes its machine-readable contract at:

```text
GET /api/v1/openapi.json
```

The document follows OpenAPI 3.0.3 and describes the public check, report,
feedback, health, metrics, domain-search, and statistics routes. Dashboard
operations are documented with the `dashboardApiKey` bearer security scheme.

The contract is intentionally maintained without a heavy runtime dependency.
Route validation remains implemented by Zod and the response contract remains
covered by an API test. When a route changes, update the document and its
contract test in the same change.
