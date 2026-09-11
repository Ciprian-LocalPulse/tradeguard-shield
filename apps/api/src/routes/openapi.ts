export const openApiDocument = {
  openapi: "3.0.3",
  info: {
    title: "TradeGuard Shield API",
    version: "0.4.0",
    description: "Explainable, fail-neutral risk intelligence for trading websites."
  },
  servers: [{ url: "/" }],
  tags: [{ name: "public" }, { name: "operations" }],
  paths: {
    "/api/v1/openapi.json": { get: { tags: ["public"], responses: { "200": { description: "OpenAPI document" } } } },
    "/api/v1/health": { get: { tags: ["public"], responses: { "200": { description: "Service health" } } } },
    "/api/v1/health/live": { get: { tags: ["public"], responses: { "200": { description: "Liveness status" } } } },
    "/api/v1/health/ready": { get: { tags: ["operations"], responses: { "200": { description: "Readiness status" } } } },
    "/api/v1/check": {
      get: {
        tags: ["public"],
        parameters: [{ name: "url", in: "query", required: true, schema: { type: "string", format: "uri", maxLength: 2048 } }],
        responses: {
          "200": { description: "Explainable domain risk result", content: { "application/json": { schema: { "$ref": "#/components/schemas/CheckResponse" } } } },
          "400": { "$ref": "#/components/responses/BadRequest" }
        }
      }
    },
    "/api/v1/report": {
      post: {
        tags: ["public"],
        requestBody: { required: true, content: { "application/json": { schema: { "$ref": "#/components/schemas/ReportRequest" } } } },
        responses: { "201": { description: "Report accepted" }, "400": { "$ref": "#/components/responses/BadRequest" } }
      }
    },
    "/api/v1/feedback": {
      post: {
        tags: ["public"],
        requestBody: { required: true, content: { "application/json": { schema: { "$ref": "#/components/schemas/FeedbackRequest" } } } },
        responses: { "202": { description: "Feedback accepted" }, "400": { "$ref": "#/components/responses/BadRequest" } }
      }
    },
    "/api/v1/metrics": { get: { tags: ["operations"], security: [{ dashboardApiKey: [] }], responses: { "200": { description: "Prometheus-compatible metrics" }, "401": { "$ref": "#/components/responses/Unauthorized" } } } },
    "/api/v1/domains": { get: { tags: ["operations"], security: [{ dashboardApiKey: [] }], parameters: [{ name: "q", in: "query", schema: { type: "string", maxLength: 253 } }], responses: { "200": { description: "Indexed domain summaries" }, "401": { "$ref": "#/components/responses/Unauthorized" } } } },
    "/api/v1/stats": { get: { tags: ["operations"], security: [{ dashboardApiKey: [] }], responses: { "200": { description: "Aggregate dashboard statistics" }, "401": { "$ref": "#/components/responses/Unauthorized" } } } }
  },
  components: {
    securitySchemes: { dashboardApiKey: { type: "http", scheme: "bearer", description: "Production dashboard API key." } },
    responses: {
      BadRequest: { description: "Validation or URL safety failure" },
      Unauthorized: { description: "Dashboard authentication required" }
    },
    schemas: {
      RiskReason: { type: "object", required: ["code", "severity", "detail", "source"], properties: { code: { type: "string" }, severity: { type: "string", enum: ["info", "warning", "critical"] }, detail: { type: "string" }, source: { type: "string" }, evidenceUrl: { type: "string", format: "uri" }, observedAt: { type: "string", format: "date-time" } } },
      CheckResponse: { type: "object", required: ["domain", "score", "riskLevel", "badge", "reasons", "checkedAt", "cacheTtlSeconds"], properties: { domain: { type: "string" }, score: { type: "integer", minimum: 0, maximum: 100 }, riskLevel: { type: "string", enum: ["low", "medium", "high"] }, badge: { type: "string", enum: ["green", "yellow", "red"] }, reasons: { type: "array", items: { "$ref": "#/components/schemas/RiskReason" } }, checkedAt: { type: "string", format: "date-time" }, cacheTtlSeconds: { type: "integer", minimum: 0 }, requestId: { type: "string" } } },
      ReportRequest: { type: "object", required: ["url", "reason"], properties: { url: { type: "string", maxLength: 2048 }, reason: { type: "string", minLength: 10, maxLength: 2000 }, contactEmail: { type: "string", format: "email" } } },
      FeedbackRequest: { type: "object", required: ["domain", "accurate"], properties: { domain: { type: "string", maxLength: 253 }, accurate: { type: "boolean" }, note: { type: "string", maxLength: 1000 } } }
    }
  }
} as const;
