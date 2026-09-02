import type { CachePort } from "../ports/cache.js";

export class RedisCacheAdapter<T> implements CachePort<T> {
  constructor(private readonly redisUrl: string) {}

  async get(_key: string): Promise<T | undefined> {
    void this.redisUrl;
    return undefined;
  }

  async set(_key: string, _value: T, _ttlSeconds: number): Promise<void> {
    void this.redisUrl;
  }
}
