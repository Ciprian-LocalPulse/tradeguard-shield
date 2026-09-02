import type { CheckResponse } from "@tradeguard/shared";
import { config } from "../config.js";
import { MemoryCacheAdapter } from "../adapters/memory-cache.js";
import { MemoryPersistenceAdapter } from "../adapters/memory-persistence.js";
import type { CachePort } from "../ports/cache.js";
import type { PersistencePort } from "../ports/persistence.js";

export interface RuntimeServices {
  checkCache: CachePort<CheckResponse>;
  persistence: PersistencePort;
}

export const runtime: RuntimeServices = {
  checkCache: new MemoryCacheAdapter<CheckResponse>(),
  persistence: new MemoryPersistenceAdapter()
};

export function runtimeReadiness() {
  return {
    cache: config.REDIS_URL ? "redis-configured-memory-fallback-active" : "memory",
    persistence: config.DATABASE_URL ? "postgres-configured-memory-fallback-active" : "memory"
  };
}
