import type { CheckResponse, DomainSignals, UserReport } from "@tradeguard/shared";
import type { AuditEvent, PersistencePort } from "../ports/persistence.js";

export class MemoryPersistenceAdapter implements PersistencePort {
  private readonly checks: Array<{ response: CheckResponse; signals: DomainSignals }> = [];
  private readonly reports: Array<UserReport & { id: string; createdAt: string; status: "new" | "reviewing" | "closed" }> = [];
  private readonly auditEvents: AuditEvent[] = [];

  async saveCheck(response: CheckResponse, signals: DomainSignals): Promise<void> {
    this.checks.push({ response, signals });
  }

  async saveReport(report: UserReport) {
    const stored = {
      ...report,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      status: "new" as const
    };
    this.reports.push(stored);
    return stored;
  }

  async saveAuditEvent(event: AuditEvent): Promise<void> {
    this.auditEvents.push(event);
  }

  async countReports(): Promise<number> {
    return this.reports.length;
  }
}
