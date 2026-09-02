import type { CheckResponse } from "@tradeguard/shared";
import { config } from "../config.js";

const cache = new Map<string, { value: CheckResponse; expiresAt: number }>();

export const checkCache = {
  get(domain: string): CheckResponse | undefined {
    const hit = cache.get(domain);
    if (!hit || hit.expiresAt < Date.now()) {
      cache.delete(domain);
      return undefined;
    }
    return hit.value;
  },
  set(domain: string, value: CheckResponse) {
    cache.set(domain, {
      value,
      expiresAt: Date.now() + config.cacheTtlSeconds * 1000
    });
  }
};
