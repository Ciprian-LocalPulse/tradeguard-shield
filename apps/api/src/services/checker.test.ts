import { describe, expect, it } from "vitest";
import { checkDomain } from "./checker.js";

describe("checkDomain", () => {
  it("returns an evidence-backed response", async () => {
    const response = await checkDomain("https://guaranteed-profit.test");
    expect(response.domain).toBe("guaranteed-profit.test");
    expect(response.reasons.length).toBeGreaterThan(0);
    expect(response.badge).toMatch(/red|yellow|green/);
  });

  it("rejects private URLs instead of acting as a proxy", async () => {
    await expect(checkDomain("http://localhost:8080/admin")).rejects.toThrow("Private, local, or internal hosts");
  });
});
