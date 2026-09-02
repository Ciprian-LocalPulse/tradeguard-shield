import { describe, expect, it } from "vitest";
import { collectWithTimeout, type CollectorAdapter } from "./index.js";

describe("collectWithTimeout", () => {
  it("turns adapter failures into unavailable data, not fraud evidence", async () => {
    const adapter: CollectorAdapter = {
      source: "test-source",
      async collect() {
        throw new Error("upstream unavailable");
      }
    };

    const signal = await collectWithTimeout(adapter, "example.com");
    expect(signal.available).toBe(false);
    expect(signal.reasons).toEqual([]);
  });
});
