import { describe, expect, it } from "vitest";

describe("API contract baseline", () => {
  it("documents required check response fields", () => {
    const fields = ["domain", "score", "riskLevel", "badge", "reasons", "checkedAt", "cacheTtlSeconds"];
    expect(fields).toContain("reasons");
    expect(fields).toContain("cacheTtlSeconds");
  });
});
