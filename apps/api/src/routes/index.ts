import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { badRequest } from "../errors.js";
import { checkDomain } from "../services/checker.js";
import { runtime, runtimeReadiness } from "../services/runtime.js";

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

export function registerRoutes(app: FastifyInstance) {
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

  app.get("/api/v1/metrics", async (_request, reply) => {
    reply.type("text/plain; version=0.0.4");
    return ["# HELP tradeguard_reports_total User reports accepted", "# TYPE tradeguard_reports_total counter", `tradeguard_reports_total ${await runtime.persistence.countReports()}`].join("\n");
  });

  app.get<{ Querystring: { url: string } }>("/api/v1/check", async (request, reply) => {
    const parsed = checkQuerySchema.safeParse(request.query);
    if (!parsed.success) throw badRequest("INVALID_CHECK_QUERY", "A valid url query parameter is required.");

    const result = await checkDomain(parsed.data.url);
    return reply.header("cache-control", `private, max-age=${result.cacheTtlSeconds}`).send({ ...result, requestId: request.id });
  });

  app.post<{ Body: { url: string; reason: string; contactEmail?: string } }>("/api/v1/report", async (request, reply) => {
    const parsed = reportSchema.safeParse(request.body);
    if (!parsed.success) throw badRequest("INVALID_REPORT", "url, reason, and optional contactEmail must be valid.");

    const report = await runtime.persistence.saveReport(parsed.data);
    return reply.code(201).send(report);
  });

  app.post<{ Body: { domain: string; accurate: boolean; note?: string } }>("/api/v1/feedback", async (request, reply) => {
    const parsed = feedbackSchema.safeParse(request.body);
    if (!parsed.success) throw badRequest("INVALID_FEEDBACK", "domain, accurate, and optional note must be valid.");

    return reply.code(202).send({ accepted: true });
  });

  app.get<{ Querystring: { q?: string } }>("/api/v1/domains", async (request) => {
    return {
      query: request.query.q ?? "",
      domains: []
    };
  });

  app.get("/api/v1/stats", async () => ({
    checks24h: 0,
    reports24h: await runtime.persistence.countReports(),
    highRiskDomains: 0
  }));
}
