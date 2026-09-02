import { describe, expect, it } from "vitest";
import { createRefreshDomainJob } from "./index.js";

describe("createRefreshDomainJob", () => {
  it("creates a domain refresh job", () => {
    const job = createRefreshDomainJob("example.com");
    expect(job.type).toBe("refresh-domain");
    expect(job.payload.domain).toBe("example.com");
  });
});
