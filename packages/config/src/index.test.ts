import { describe, expect, it } from "vitest";
import { loadConfig } from "./index.js";

describe("loadConfig", () => {
  it("parses defaults and CORS origins", () => {
    const config = loadConfig({});
    expect(config.API_PORT).toBe(8080);
    expect(config.allowedCorsOrigins).toContain("http://localhost:5173");
  });

  it("rejects invalid ports", () => {
    expect(() => loadConfig({ API_PORT: "99999" })).toThrow();
  });
});
