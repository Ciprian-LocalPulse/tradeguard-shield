import { describe, expect, it } from "vitest";
import { validatePublicHttpUrl } from "./index.js";

describe("validatePublicHttpUrl", () => {
  it("accepts public http URLs", () => {
    expect(validatePublicHttpUrl("https://example-broker.com").ok).toBe(true);
  });

  it("blocks local hosts and direct IPs", () => {
    expect(validatePublicHttpUrl("http://localhost:8080").ok).toBe(false);
    expect(validatePublicHttpUrl("http://127.0.0.1").ok).toBe(false);
  });

  it("rejects non-http protocols", () => {
    expect(validatePublicHttpUrl("file:///etc/passwd").ok).toBe(false);
  });
});
