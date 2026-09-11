import type { CheckResponse, DomainSignals, UserReport } from "@tradeguard/shared";

export interface AuditEvent {
  action: string;
  subject: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export interface DomainFeedback {
  domain: string;
  accurate: boolean;
  note?: string;
}

export interface DashboardStats {
  checks24h: number;
  reports24h: number;
  highRiskDomains: number;
}

export interface DomainSummary {
  domain: string;
  score: number;
  riskLevel: "low" | "medium" | "high";
  checkedAt: string;
}

export interface PersistencePort {
  saveCheck(response: CheckResponse, signals: DomainSignals): Promise<void>;
  saveReport(report: UserReport): Promise<{ id: string; createdAt: string; status: "new" | "reviewing" | "closed" }>;
  saveFeedback(feedback: DomainFeedback): Promise<{ id: string; createdAt: string }>;
  saveAuditEvent(event: AuditEvent): Promise<void>;
  countReports(): Promise<number>;
  getStats(): Promise<DashboardStats>;
  searchDomains(query: string): Promise<DomainSummary[]>;
}
