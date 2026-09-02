import type { CheckResponse, DomainSignals, UserReport } from "@tradeguard/shared";

export interface AuditEvent {
  action: string;
  subject: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export interface PersistencePort {
  saveCheck(response: CheckResponse, signals: DomainSignals): Promise<void>;
  saveReport(report: UserReport): Promise<{ id: string; createdAt: string; status: "new" | "reviewing" | "closed" }>;
  saveAuditEvent(event: AuditEvent): Promise<void>;
  countReports(): Promise<number>;
}
