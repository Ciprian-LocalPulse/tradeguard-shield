import type { SignalSeverity } from "./types.js";

export interface ScorePenalty {
  points: number;
  severity: SignalSeverity;
  detail: string;
  source: string;
}

export const scorePolicy = {
  thresholds: {
    highMax: 30,
    mediumMax: 60
  },
  penalties: {
    DOMAIN_VERY_YOUNG: {
      points: 30,
      severity: "critical",
      detail: "Domain was registered less than 30 days ago.",
      source: "rdap"
    },
    DOMAIN_YOUNG: {
      points: 15,
      severity: "warning",
      detail: "Domain age is below the configured trust threshold.",
      source: "rdap"
    },
    WHOIS_PRIVACY: {
      points: 8,
      severity: "info",
      detail: "Registration metadata appears privacy-protected.",
      source: "rdap"
    },
    TLS_INVALID: {
      points: 18,
      severity: "warning",
      detail: "TLS certificate could not be validated.",
      source: "certificate-transparency"
    },
    THREAT_FEED_MATCH: {
      points: 55,
      severity: "critical",
      detail: "Domain appears in a configured phishing or scam feed.",
      source: "threat-feed"
    },
    NO_REGULATOR_MATCH: {
      points: 20,
      severity: "warning",
      detail: "No matching financial license was found in configured regulators.",
      source: "financial-registry"
    },
    NEGATIVE_REVIEW_PATTERN: {
      points: 12,
      severity: "warning",
      detail: "Negative review ratio is above the configured threshold.",
      source: "reviews"
    },
    SUDDEN_SOCIAL_SPIKE: {
      points: 10,
      severity: "warning",
      detail: "Mentions increased abruptly across monitored social sources.",
      source: "social-media"
    }
  } satisfies Record<string, ScorePenalty>
};
