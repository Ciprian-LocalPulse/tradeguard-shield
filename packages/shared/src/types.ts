export type RiskLevel = "low" | "medium" | "high";
export type BadgeColor = "green" | "yellow" | "red";
export type SignalSeverity = "info" | "warning" | "critical";

export interface RiskReason {
  code: string;
  severity: SignalSeverity;
  detail: string;
  source: string;
  evidenceUrl?: string;
  observedAt?: string;
}

export interface DomainSignals {
  domain: string;
  domainAgeDays?: number;
  usesWhoisPrivacy?: boolean;
  hasValidTls?: boolean;
  listedInThreatFeed?: boolean;
  regulatorMatches?: string[];
  suspiciousClaims?: string[];
  negativeReviewRatio?: number;
  suddenSocialSpike?: boolean;
}

export interface CheckResponse {
  domain: string;
  score: number;
  riskLevel: RiskLevel;
  badge: BadgeColor;
  reasons: RiskReason[];
  checkedAt: string;
  cacheTtlSeconds: number;
  requestId?: string;
}

export interface UserReport {
  url: string;
  reason: string;
  contactEmail?: string;
}
