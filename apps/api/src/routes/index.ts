import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { badRequest, PublicApiError } from "../errors.js";
import { checkDomain } from "../services/checker.js";
import { runtime, runtimeReadiness } from "../services/runtime.js";
import { config } from "../config.js";
import { openApiDocument } from "./openapi.js";

const checkQuerySchema = z.object({ url: z.string().min(3).max(2048) });
const reportSchema = z.object({
  url: z.string().min(3).max(2048),
  reason: z.string().min(10).max(2000),
  contactEmail: z.string().email().optional()
});
const feedbackSchema = z.object({
  domain: z.string().min(3).max(253),
  accurate: z.boolean(),
  note: z.string().max(1000).optional()
});

function requireDashboardAccess(request: { headers: Record<string, string | string[] | undefined> }) {
  if (!config.DASHBOARD_API_KEY) {
    if (config.NODE_ENV === "production") {
      throw new PublicApiError(503, "DASHBOARD_AUTH_NOT_CONFIGURED", "Dashboard authentication is not configured.");
    }
    return;
  }
  const authorization = request.headers.authorization;
  const presented =
    typeof authorization === "string" && authorization.startsWith("Bearer ")
      ? authorization.slice("Bearer ".length)
      : request.headers["x-dashboard-api-key"];
  if (presented !== config.DASHBOARD_API_KEY) {
    throw new PublicApiError(401, "UNAUTHORIZED_DASHBOARD", "Dashboard authentication is required.");
  }
}

export function registerRoutes(app: FastifyInstance) {
  app.get("/api/v1/openapi.json", async (_request, reply) => reply.type("application/json").send(openApiDocument));

  app.get("/api/v1/health", async () => ({
    ok: true,
    service: "tradeguard-api"
  }));

  app.get("/api/v1/health/live", async () => ({
    ok: true,
    check: "live"
  }));

  app.get("/api/v1/health/ready", async () => ({
    ok: true,
    check: "ready",
    dependencies: runtimeReadiness()
  }));

  app.get("/api/v1/metrics", async (request, reply) => {
    requireDashboardAccess(request);
    reply.type("text/plain; version=0.0.4");
    return [
      "# HELP tradeguard_reports_total User reports accepted",
      "# TYPE tradeguard_reports_total counter",
      `tradeguard_reports_total ${await runtime.persistence.countReports()}`
    ].join("\n");
  });

  app.get<{ Querystring: { url: string } }>("/api/v1/check", async (request, reply) => {
    const parsed = checkQuerySchema.safeParse(request.query);
    if (!parsed.success) throw badRequest("INVALID_CHECK_QUERY", "A valid url query parameter is required.");

    const result = await checkDomain(parsed.data.url);
    return reply
      .header("cache-control", `private, max-age=${result.cacheTtlSeconds}`)
      .send({ ...result, requestId: request.id });
  });

  app.post<{ Body: { url: string; reason: string; contactEmail?: string } }>(
    "/api/v1/report",
    async (request, reply) => {
      const parsed = reportSchema.safeParse(request.body);
      if (!parsed.success) throw badRequest("INVALID_REPORT", "url, reason, and optional contactEmail must be valid.");

      const report = await runtime.persistence.saveReport(parsed.data);
      return reply.code(201).send(report);
    }
  );

  app.post<{ Body: { domain: string; accurate: boolean; note?: string } }>(
    "/api/v1/feedback",
    async (request, reply) => {
      const parsed = feedbackSchema.safeParse(request.body);
      if (!parsed.success) throw badRequest("INVALID_FEEDBACK", "domain, accurate, and optional note must be valid.");

      const feedback = await runtime.persistence.saveFeedback(parsed.data);
      return reply.code(202).send({ accepted: true, ...feedback });
    }
  );

  app.get<{ Querystring: { q?: string } }>("/api/v1/domains", async (request) => {
    requireDashboardAccess(request);
    return {
      query: request.query.q ?? "",
      domains: await runtime.persistence.searchDomains(request.query.q ?? "")
    };
  });

  app.get("/api/v1/stats", async (request) => {
    requireDashboardAccess(request);
    return runtime.persistence.getStats();
  });
}
