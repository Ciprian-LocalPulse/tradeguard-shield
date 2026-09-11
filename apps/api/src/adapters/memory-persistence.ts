import type { CheckResponse, DomainSignals, UserReport } from "@tradeguard/shared";
import type {
  AuditEvent,
  DashboardStats,
  DomainFeedback,
  DomainSummary,
  PersistencePort
} from "../ports/persistence.js";

export class MemoryPersistenceAdapter implements PersistencePort {
  private readonly checks: Array<{ response: CheckResponse; signals: DomainSignals }> = [];
  private readonly reports: Array<
    UserReport & { id: string; createdAt: string; status: "new" | "reviewing" | "closed" }
  > = [];
  private readonly feedback: Array<DomainFeedback & { id: string; createdAt: string }> = [];
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

  async saveFeedback(feedback: DomainFeedback) {
    const stored = {
      ...feedback,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    this.feedback.push(stored);
    return { id: stored.id, createdAt: stored.createdAt };
  }

  async saveAuditEvent(event: AuditEvent): Promise<void> {
    this.auditEvents.push(event);
  }

  async countReports(): Promise<number> {
    return this.reports.length;
  }

  async getStats(): Promise<DashboardStats> {
    const cutoff = Date.now() - 86_400_000;
    const recentChecks = this.checks.filter(({ response }) => Date.parse(response.checkedAt) >= cutoff);
    return {
      checks24h: recentChecks.length,
      reports24h: this.reports.filter((report) => Date.parse(report.createdAt) >= cutoff).length,
      highRiskDomains: new Set(
        recentChecks.filter(({ response }) => response.riskLevel === "high").map(({ response }) => response.domain)
      ).size
    };
  }

  async searchDomains(query: string): Promise<DomainSummary[]> {
    const normalizedQuery = query.trim().toLowerCase();
    return this.checks
      .map(({ response }) => ({
        domain: response.domain,
        score: response.score,
        riskLevel: response.riskLevel,
        checkedAt: response.checkedAt
      }))
      .filter(({ domain }) => !normalizedQuery || domain.includes(normalizedQuery))
      .sort((left, right) => Date.parse(right.checkedAt) - Date.parse(left.checkedAt))
      .slice(0, 50);
  }
}
