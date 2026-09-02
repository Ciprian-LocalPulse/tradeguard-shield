import { calculateScore, extractRegistrableDomain, type CheckResponse, type DomainSignals } from "@tradeguard/shared";
import { config } from "../config.js";
import { analyzeContentClaims } from "../signals/content-analysis.js";
import { checkRegulators } from "../signals/regulators.js";
import { checkThreatFeeds } from "../signals/threat-feeds.js";
import { checkTls } from "../signals/tls.js";
import { lookupRdap } from "../signals/rdap.js";
import { checkCache } from "../stores/check-cache.js";

export async function checkDomain(inputUrl: string): Promise<CheckResponse> {
  const domain = extractRegistrableDomain(inputUrl);
  const cached = checkCache.get(domain);

  if (cached) {
    return cached;
  }

  const [rdap, tls, threatFeed, regulators, content] = await Promise.all([
    lookupRdap(domain),
    checkTls(domain),
    checkThreatFeeds(domain),
    checkRegulators(domain),
    analyzeContentClaims(inputUrl)
  ]);

  const signals: DomainSignals = {
    domain,
    domainAgeDays: rdap.domainAgeDays,
    usesWhoisPrivacy: rdap.usesWhoisPrivacy,
    hasValidTls: tls.valid,
    listedInThreatFeed: threatFeed.listed,
    regulatorMatches: regulators.matches,
    suspiciousClaims: content.claims,
    negativeReviewRatio: undefined,
    suddenSocialSpike: false
  };

  const score = calculateScore(signals);
  const response: CheckResponse = {
    domain,
    ...score,
    checkedAt: new Date().toISOString(),
    cacheTtlSeconds: config.cacheTtlSeconds
  };

  checkCache.set(domain, response);
  return response;
}
