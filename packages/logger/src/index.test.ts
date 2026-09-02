import { describe, expect, it } from "vitest";
import { redactSensitive } from "./index.js";

describe("redactSensitive", () => {
  it("redacts nested secrets", () => {
    expect(redactSensitive({ apiKey: "abc", nested: { token: "def", ok: true } })).toEqual({
      apiKey: "[REDACTED]",
      nested: { token: "[REDACTED]", ok: true }
    });
  });
});
