import { config } from "../config.js";

const FEED_TIMEOUT_MS = 3000;
const OPENPHISH_FEED_URL = "https://openphish.com/feed.txt";
const GOOGLE_SAFE_BROWSING_URL = "https://safebrowsing.googleapis.com/v4/threatMatches:find";
const OPENPHISH_CACHE_TTL_MS = 15 * 60 * 1000;

let openPhishCache: { expiresAt: number; urls?: Set<string> } | undefined;
let openPhishFetch: Promise<Set<string> | undefined> | undefined;

function normalizedDomain(domain: string): string {
  return domain.trim().toLowerCase().replace(/\.$/, "");
}

function feedEntryMatchesDomain(entry: string, domain: string): boolean {
  const normalized = entry.trim().toLowerCase();
  if (!normalized) return false;
  try {
    return normalizedDomain(new URL(normalized).hostname) === domain;
  } catch {
    return normalizedDomain(normalized) === domain;
  }
}

async function fetchOpenPhish(): Promise<Set<string> | undefined> {
  const now = Date.now();
  if (openPhishCache && openPhishCache.expiresAt > now) return openPhishCache.urls;
  if (openPhishFetch) return openPhishFetch;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FEED_TIMEOUT_MS);
  openPhishFetch = (async () => {
    try {
      const response = await fetch(OPENPHISH_FEED_URL, { signal: controller.signal });
      if (!response.ok) {
        openPhishCache = { expiresAt: Date.now() + OPENPHISH_CACHE_TTL_MS };
        return undefined;
      }
      const urls = new Set(
        (await response.text())
          .split(/\r?\n/)
          .map((entry) => entry.trim().toLowerCase())
          .filter(Boolean)
      );
      openPhishCache = { expiresAt: Date.now() + OPENPHISH_CACHE_TTL_MS, urls };
      return urls;
    } catch {
      openPhishCache = { expiresAt: Date.now() + OPENPHISH_CACHE_TTL_MS };
      return undefined;
    } finally {
      clearTimeout(timeout);
      openPhishFetch = undefined;
    }
  })();

  return openPhishFetch;
}

async function checkGoogleSafeBrowsing(domain: string): Promise<boolean | undefined> {
  const apiKey = config.GOOGLE_SAFE_BROWSING_API_KEY;
  if (!apiKey) return undefined;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FEED_TIMEOUT_MS);
  try {
    const response = await fetch(`${GOOGLE_SAFE_BROWSING_URL}?key=${encodeURIComponent(apiKey)}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        client: { clientId: "tradeguard-shield", clientVersion: "0.1.0" },
        threatInfo: {
          threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
          platformTypes: ["ANY_PLATFORM"],
          threatEntryTypes: ["URL"],
          threatEntries: [{ url: `https://${domain}/` }]
        }
      }),
      signal: controller.signal
    });
    if (!response.ok) return undefined;
    const payload: unknown = await response.json();
    return Boolean(
      payload &&
      typeof payload === "object" &&
      Array.isArray((payload as { matches?: unknown }).matches) &&
      (payload as { matches: unknown[] }).matches.length
    );
  } catch {
    return undefined;
  } finally {
    clearTimeout(timeout);
  }
}

export async function checkThreatFeeds(domain: string): Promise<{ listed: boolean }> {
  const normalized = normalizedDomain(domain);
  const [safeBrowsing, openPhish] = await Promise.all([checkGoogleSafeBrowsing(normalized), fetchOpenPhish()]);
  const listedInOpenPhish = openPhish
    ? Array.from(openPhish).some((entry) => feedEntryMatchesDomain(entry, normalized))
    : false;
  return { listed: safeBrowsing === true || listedInOpenPhish };
}
