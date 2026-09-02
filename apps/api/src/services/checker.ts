import { validatePublicHttpUrl } from "@tradeguard/security";
import { calculateScore, extractRegistrableDomain, type CheckResponse, type DomainSignals } from "@tradeguard/shared";
import { config } from "../config.js";
import { badRequest } from "../errors.js";
import { analyzeContentClaims } from "../signals/content-analysis.js";
import { checkRegulators } from "../signals/regulators.js";
import { checkThreatFeeds } from "../signals/threat-feeds.js";
import { checkTls } from "../signals/tls.js";
import { lookupRdap } from "../signals/rdap.js";
import { runtime } from "./runtime.js";

export async function checkDomain(inputUrl: string): Promise<CheckResponse> {
  const safeUrl = validatePublicHttpUrl(inputUrl);
  if (!safeUrl.ok) {
    throw badRequest("UNSAFE_URL", safeUrl.reason ?? "URL cannot be checked safely.");
  }

  const domain = extractRegistrableDomain(inputUrl);
  const cached = await runtime.checkCache.get(domain);

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
    cacheTtlSeconds: config.CHECK_CACHE_TTL_SECONDS
  };

  await runtime.checkCache.set(domain, response, config.CHECK_CACHE_TTL_SECONDS);
  await runtime.persistence.saveCheck(response, signals);
  return response;
}
