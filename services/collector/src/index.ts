import type { RiskReason } from "@tradeguard/shared";

export interface CollectedSignal {
  source: string;
  domain: string;
  observedAt: string;
  available: boolean;
  reasons: RiskReason[];
  metadata: Record<string, unknown>;
}

export interface CollectorAdapter {
  readonly source: string;
  collect(domain: string, signal?: AbortSignal): Promise<CollectedSignal>;
}

export async function collectWithTimeout(adapter: CollectorAdapter, domain: string, timeoutMs = 5000): Promise<CollectedSignal> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await adapter.collect(domain, controller.signal);
  } catch (error) {
    return {
      source: adapter.source,
      domain,
      observedAt: new Date().toISOString(),
      available: false,
      reasons: [],
      metadata: {
        error: error instanceof Error ? error.message : "unknown collector failure"
      }
    };
  } finally {
    clearTimeout(timeout);
  }
}
