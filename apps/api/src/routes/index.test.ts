import Fastify from "fastify";
import { afterEach, describe, expect, it } from "vitest";
import { MemoryPersistenceAdapter } from "../adapters/memory-persistence.js";
import { registerRoutes } from "./index.js";
import { runtime } from "../services/runtime.js";

describe("feedback route", () => {
  it("serves the public OpenAPI contract", async () => {
    const app = Fastify();
    registerRoutes(app);

    const response = await app.inject({ method: "GET", url: "/api/v1/openapi.json" });

    await app.close();
    expect(response.statusCode).toBe(200);
    expect(response.headers["content-type"]).toContain("application/json");
    expect(response.json()).toMatchObject({ openapi: "3.0.3", info: { title: "TradeGuard Shield API" } });
    expect(response.json().paths["/api/v1/check"].get.parameters[0].name).toBe("url");
  });

  it("persists valid feedback and returns a tracking id", async () => {
    const app = Fastify();
    const originalPersistence = runtime.persistence;
    runtime.persistence = new MemoryPersistenceAdapter();
    registerRoutes(app);

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/feedback",
      payload: { domain: "example.com", accurate: false, note: "The score is too high." }
    });

    runtime.persistence = originalPersistence;
    await app.close();
    expect(response.statusCode).toBe(202);
    expect(response.json()).toMatchObject({ accepted: true });
    expect(response.json().id).toEqual(expect.any(String));
    expect(response.json().createdAt).toEqual(expect.any(String));
  });

  it("rejects malformed feedback", async () => {
    const app = Fastify();
    registerRoutes(app);

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/feedback",
      payload: { domain: "", accurate: "sometimes" }
    });

    await app.close();
    expect(response.statusCode).toBe(400);
  });

  it("serves persistence-backed dashboard stats and domain search", async () => {
    const app = Fastify();
    const originalPersistence = runtime.persistence;
    const persistence = new MemoryPersistenceAdapter();
    runtime.persistence = persistence;
    await persistence.saveCheck(
      {
        domain: "risk.example",
        score: 20,
        riskLevel: "high",
        badge: "red",
        reasons: [],
        checkedAt: new Date().toISOString(),
        cacheTtlSeconds: 3600
      },
      { domain: "risk.example" }
    );
    registerRoutes(app);

    const stats = await app.inject({ method: "GET", url: "/api/v1/stats" });
    const domains = await app.inject({ method: "GET", url: "/api/v1/domains?q=risk" });

    runtime.persistence = originalPersistence;
    await app.close();
    expect(stats.statusCode).toBe(200);
    expect(stats.json()).toMatchObject({ checks24h: 1, highRiskDomains: 1 });
    expect(domains.json().domains).toHaveLength(1);
  });
});
