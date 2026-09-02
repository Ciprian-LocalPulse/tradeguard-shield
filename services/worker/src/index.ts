export interface WorkerJob {
  id: string;
  type: "refresh-domain" | "refresh-feed";
  payload: Record<string, unknown>;
  enqueuedAt: string;
}

export function createRefreshDomainJob(domain: string): WorkerJob {
  return {
    id: crypto.randomUUID(),
    type: "refresh-domain",
    payload: { domain },
    enqueuedAt: new Date().toISOString()
  };
}
