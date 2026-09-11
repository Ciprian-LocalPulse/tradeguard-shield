import Fastify from "fastify";
import { afterEach, describe, expect, it } from "vitest";
import { MemoryPersistenceAdapter } from "../adapters/memory-persistence.js";
import { registerRoutes } from "./index.js";
import { runtime } from "../services/runtime.js";

describe("feedback route", () => {
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
});
