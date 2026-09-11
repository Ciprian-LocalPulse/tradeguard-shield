import { describe, expect, it, vi } from "vitest";
import { PostgresPersistenceAdapter } from "./postgres-persistence.js";

describe("PostgresPersistenceAdapter", () => {
  it("persists reports, feedback, and report counts through the pool", async () => {
    const pool = {
      query: vi.fn()
    };
    pool.query
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({ rows: [{ count: "3" }] });
    const adapter = new PostgresPersistenceAdapter("postgres://test", pool as never);

    const report = await adapter.saveReport({ url: "https://example.com", reason: "The score needs review." });
    const feedback = await adapter.saveFeedback({ domain: "example.com", accurate: false, note: "Please review." });
    const count = await adapter.countReports();

    expect(report.status).toBe("new");
    expect(report.id).toEqual(expect.any(String));
    expect(feedback.id).toEqual(expect.any(String));
    expect(count).toBe(3);
    expect(pool.query).toHaveBeenCalledTimes(3);
  });

  it("commits a check transaction and releases the client", async () => {
    const client = {
      query: vi
        .fn()
        .mockImplementation((sql: string) =>
          sql.startsWith("SELECT") ? Promise.resolve({ rows: [{ id: "domain-id" }] }) : Promise.resolve({})
        ),
      release: vi.fn()
    };
    const pool = { connect: vi.fn().mockResolvedValue(client) };
    const adapter = new PostgresPersistenceAdapter("postgres://test", pool as never);

    await adapter.saveCheck(
      {
        domain: "example.com",
        score: 80,
        riskLevel: "low",
        badge: "green",
        reasons: [],
        checkedAt: new Date().toISOString(),
        cacheTtlSeconds: 3600
      },
      { domain: "example.com" }
    );

    expect(client.query).toHaveBeenCalledWith("BEGIN");
    expect(client.query).toHaveBeenCalledWith("COMMIT");
    expect(client.release).toHaveBeenCalledOnce();
  });
});
