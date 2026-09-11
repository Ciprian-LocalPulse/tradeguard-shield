import type { CheckResponse } from "@tradeguard/shared";
import { config } from "../config.js";
import { MemoryCacheAdapter } from "../adapters/memory-cache.js";
import { MemoryPersistenceAdapter } from "../adapters/memory-persistence.js";
import { PostgresPersistenceAdapter } from "../adapters/postgres-persistence.js";
import { RedisCacheAdapter } from "../adapters/redis-cache.js";
import type { CachePort } from "../ports/cache.js";
import type { PersistencePort } from "../ports/persistence.js";

export interface RuntimeServices {
  checkCache: CachePort<CheckResponse>;
  persistence: PersistencePort;
}

export const runtime: RuntimeServices = {
  checkCache: config.REDIS_URL
    ? new RedisCacheAdapter<CheckResponse>(config.REDIS_URL)
    : new MemoryCacheAdapter<CheckResponse>(),
  persistence: config.DATABASE_URL
    ? new PostgresPersistenceAdapter(config.DATABASE_URL)
    : new MemoryPersistenceAdapter()
};

export function runtimeReadiness() {
  return {
    cache: config.REDIS_URL ? "redis" : "memory",
    persistence: config.DATABASE_URL ? "postgres" : "memory"
  };
}
