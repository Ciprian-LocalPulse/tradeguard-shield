import { describe, expect, it } from "vitest";
import { extractRegistrableDomain, normalizeUrl } from "./url.js";

describe("URL helpers", () => {
  it("normalizes bare domains", () => {
    expect(normalizeUrl("example.com").href).toBe("https://example.com/");
  });

  it("extracts registrable domains", () => {
    expect(extractRegistrableDomain("https://www.example-broker.com/path")).toBe("example-broker.com");
    expect(extractRegistrableDomain("https://portal.example.co.uk")).toBe("example.co.uk");
  });
});
