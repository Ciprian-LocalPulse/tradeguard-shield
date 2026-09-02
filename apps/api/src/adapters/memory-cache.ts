import type { CachePort } from "../ports/cache.js";

export class MemoryCacheAdapter<T> implements CachePort<T> {
  private readonly cache = new Map<string, { value: T; expiresAt: number }>();

  async get(key: string): Promise<T | undefined> {
    const hit = this.cache.get(key);
    if (!hit || hit.expiresAt < Date.now()) {
      this.cache.delete(key);
      return undefined;
    }
    return hit.value;
  }

  async set(key: string, value: T, ttlSeconds: number): Promise<void> {
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000
    });
  }
}
