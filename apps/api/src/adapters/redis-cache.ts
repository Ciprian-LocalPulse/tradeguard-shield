import type { CachePort } from "../ports/cache.js";
import { createClient } from "redis";

export class RedisCacheAdapter<T> implements CachePort<T> {
  private readonly client;
  private connecting: Promise<void> | undefined;

  constructor(redisUrl: string) {
    this.client = createClient({
      url: redisUrl,
      socket: { connectTimeout: 3000 }
    });
    this.client.on("error", () => undefined);
  }

  private async ensureConnected(): Promise<void> {
    if (this.client.isOpen) return;
    this.connecting ??= this.client
      .connect()
      .then(() => undefined)
      .finally(() => {
        this.connecting = undefined;
      });
    await this.connecting;
  }

  async get(_key: string): Promise<T | undefined> {
    try {
      await this.ensureConnected();
      const value = await this.client.get(_key);
      return value === null ? undefined : (JSON.parse(value) as T);
    } catch {
      return undefined;
    }
  }

  async set(key: string, value: T, ttlSeconds: number): Promise<void> {
    try {
      await this.ensureConnected();
      await this.client.set(key, JSON.stringify(value), { EX: ttlSeconds });
    } catch {
      // Cache failures are non-fatal; callers continue with an uncached request.
    }
  }

  async close(): Promise<void> {
    if (this.client.isOpen) {
      await this.client.quit();
    }
  }
}
