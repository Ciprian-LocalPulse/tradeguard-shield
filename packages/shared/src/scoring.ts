import type { BadgeColor, DomainSignals, RiskLevel, RiskReason } from "./types.js";
import { scorePolicy } from "./score-policy.js";

export interface ScoreResult {
  score: number;
  riskLevel: RiskLevel;
  badge: BadgeColor;
  reasons: RiskReason[];
}

export function riskLevelForScore(score: number): RiskLevel {
  if (score <= scorePolicy.thresholds.highMax) return "high";
  if (score <= scorePolicy.thresholds.mediumMax) return "medium";
  return "low";
}

export function badgeForRiskLevel(level: RiskLevel): BadgeColor {
  if (level === "high") return "red";
  if (level === "medium") return "yellow";
  return "green";
}

export function calculateScore(signals: DomainSignals): ScoreResult {
  let score = 100;
  const reasons: RiskReason[] = [];

  const addPolicyReason = (code: keyof typeof scorePolicy.penalties, overrides: Partial<RiskReason> = {}) => {
    const penalty = scorePolicy.penalties[code];
    score -= penalty.points;
    reasons.push({
      code,
      severity: penalty.severity,
      detail: penalty.detail,
      source: penalty.source,
      ...overrides
    });
  };

  if (signals.domainAgeDays !== undefined && signals.domainAgeDays < 30) {
    addPolicyReason("DOMAIN_VERY_YOUNG");
  } else if (signals.domainAgeDays !== undefined && signals.domainAgeDays < 180) {
    addPolicyReason("DOMAIN_YOUNG");
  }

  if (signals.usesWhoisPrivacy) {
    addPolicyReason("WHOIS_PRIVACY");
  }

  if (signals.hasValidTls === false) {
    addPolicyReason("TLS_INVALID");
  }

  if (signals.listedInThreatFeed) {
    addPolicyReason("THREAT_FEED_MATCH");
  }

  if (!signals.regulatorMatches?.length) {
    addPolicyReason("NO_REGULATOR_MATCH");
  }

  if (signals.suspiciousClaims?.length) {
    const points = Math.min(20, signals.suspiciousClaims.length * 6);
    score -= points;
    reasons.push({
      code: "SUSPICIOUS_MARKETING_CLAIMS",
      severity: "warning",
      detail: `Detected risky trading claims: ${signals.suspiciousClaims.join(", ")}.`,
      source: "content-analysis"
    });
  }

  if (signals.negativeReviewRatio !== undefined && signals.negativeReviewRatio > 0.65) {
    addPolicyReason("NEGATIVE_REVIEW_PATTERN");
  }

  if (signals.suddenSocialSpike) {
    addPolicyReason("SUDDEN_SOCIAL_SPIKE");
  }

  score = Math.max(0, Math.min(100, score));
  const riskLevel = riskLevelForScore(score);

  return {
    score,
    riskLevel,
    badge: badgeForRiskLevel(riskLevel),
    reasons
  };
}
