import { describe, expect, it } from "vitest";
import { calculateScore } from "./scoring.js";

describe("calculateScore", () => {
  it("marks a fresh threat-feed domain as high risk", () => {
    const result = calculateScore({
      domain: "fake-broker.test",
      domainAgeDays: 5,
      hasValidTls: true,
      listedInThreatFeed: true,
      regulatorMatches: [],
      suspiciousClaims: ["guaranteed profit"]
    });

    expect(result.riskLevel).toBe("high");
    expect(result.badge).toBe("red");
    expect(result.reasons.some((reason) => reason.code === "THREAT_FEED_MATCH")).toBe(true);
  });
});
