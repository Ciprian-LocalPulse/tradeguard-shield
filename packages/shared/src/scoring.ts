import type { BadgeColor, DomainSignals, RiskLevel, RiskReason } from "./types.js";

export interface ScoreResult {
  score: number;
  riskLevel: RiskLevel;
  badge: BadgeColor;
  reasons: RiskReason[];
}

export function riskLevelForScore(score: number): RiskLevel {
  if (score <= 30) return "high";
  if (score <= 60) return "medium";
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

  const add = (points: number, reason: RiskReason) => {
    score -= points;
    reasons.push(reason);
  };

  if (signals.domainAgeDays !== undefined && signals.domainAgeDays < 30) {
    add(30, {
      code: "DOMAIN_VERY_YOUNG",
      severity: "critical",
      detail: "Domain was registered less than 30 days ago.",
      source: "rdap"
    });
  } else if (signals.domainAgeDays !== undefined && signals.domainAgeDays < 180) {
    add(15, {
      code: "DOMAIN_YOUNG",
      severity: "warning",
      detail: "Domain age is below the configured trust threshold.",
      source: "rdap"
    });
  }

  if (signals.usesWhoisPrivacy) {
    add(8, {
      code: "WHOIS_PRIVACY",
      severity: "info",
      detail: "Registration metadata appears privacy-protected.",
      source: "rdap"
    });
  }

  if (signals.hasValidTls === false) {
    add(18, {
      code: "TLS_INVALID",
      severity: "warning",
      detail: "TLS certificate could not be validated.",
      source: "certificate-transparency"
    });
  }

  if (signals.listedInThreatFeed) {
    add(55, {
      code: "THREAT_FEED_MATCH",
      severity: "critical",
      detail: "Domain appears in a configured phishing or scam feed.",
      source: "threat-feed"
    });
  }

  if (!signals.regulatorMatches?.length) {
    add(20, {
      code: "NO_REGULATOR_MATCH",
      severity: "warning",
      detail: "No matching financial license was found in configured regulators.",
      source: "financial-registry"
    });
  }

  if (signals.suspiciousClaims?.length) {
    add(Math.min(20, signals.suspiciousClaims.length * 6), {
      code: "SUSPICIOUS_MARKETING_CLAIMS",
      severity: "warning",
      detail: `Detected risky trading claims: ${signals.suspiciousClaims.join(", ")}.`,
      source: "content-analysis"
    });
  }

  if (signals.negativeReviewRatio !== undefined && signals.negativeReviewRatio > 0.65) {
    add(12, {
      code: "NEGATIVE_REVIEW_PATTERN",
      severity: "warning",
      detail: "Negative review ratio is above the configured threshold.",
      source: "reviews"
    });
  }

  if (signals.suddenSocialSpike) {
    add(10, {
      code: "SUDDEN_SOCIAL_SPIKE",
      severity: "warning",
      detail: "Mentions increased abruptly across monitored social sources.",
      source: "social-media"
    });
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
