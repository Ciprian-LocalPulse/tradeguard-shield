import { describe, expect, it } from "vitest";
import { MemoryCacheAdapter } from "./memory-cache.js";

describe("MemoryCacheAdapter", () => {
  it("stores values until TTL expiry", async () => {
    const cache = new MemoryCacheAdapter<{ ok: boolean }>();
    await cache.set("key", { ok: true }, 60);
    await expect(cache.get("key")).resolves.toEqual({ ok: true });
  });
});
