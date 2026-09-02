import type { FastifyInstance } from "fastify";
import { checkDomain } from "../services/checker.js";
import { reportStore } from "../stores/report-store.js";

export function registerRoutes(app: FastifyInstance) {
  app.get("/api/v1/health", async () => ({
    ok: true,
    service: "tradeguard-api"
  }));

  app.get<{ Querystring: { url: string } }>("/api/v1/check", async (request, reply) => {
    if (!request.query.url) {
      return reply.code(400).send({ error: "url is required" });
    }

    return checkDomain(request.query.url);
  });

  app.post<{ Body: { url: string; reason: string; contactEmail?: string } }>("/api/v1/report", async (request, reply) => {
    const body = request.body;
    if (!body?.url || !body?.reason) {
      return reply.code(400).send({ error: "url and reason are required" });
    }

    const report = reportStore.add(body);
    return reply.code(201).send(report);
  });

  app.post<{ Body: { domain: string; accurate: boolean; note?: string } }>("/api/v1/feedback", async (request, reply) => {
    if (!request.body?.domain) {
      return reply.code(400).send({ error: "domain is required" });
    }

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
    reports24h: reportStore.count(),
    highRiskDomains: 0
  }));
}
