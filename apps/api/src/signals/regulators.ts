const REGULATOR_TIMEOUT_MS = 3000;
const FCA_WARNINGS_RSS_URL = "https://www.fca.org.uk/news/warnings/rss.xml";
const REGULATOR_CACHE_TTL_MS = 15 * 60 * 1000;

let fcaCache: { expiresAt: number; body?: string } | undefined;
let fcaFetch: Promise<string | undefined> | undefined;

function normalizedDomain(domain: string): string {
  return domain.trim().toLowerCase().replace(/^www\./, "").replace(/\.$/, "");
}

function xmlDecode(value: string): string {
  return value
    .replace(/<!\[CDATA\[|\]\]>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function warningEntryMatchesDomain(entry: string, domain: string): boolean {
  const normalized = normalizedDomain(domain);
  const candidates = entry.match(/(?:https?:\/\/)?(?:[a-z0-9-]+\.)+[a-z]{2,}(?::\d+)?(?:[/?#][^\s<]*)?/gi) ?? [];

  return candidates.some((candidate) => {
    try {
      const hostname = normalizedDomain(new URL(candidate.startsWith("http") ? candidate : `https://${candidate}`).hostname);
      return hostname === normalized || hostname.endsWith(`.${normalized}`) || normalized.endsWith(`.${hostname}`);
    } catch {
      return false;
    }
  });
}

function extractRssItems(body: string): string[] {
  return Array.from(body.matchAll(/<item\b[\s\S]*?<\/item>/gi), (match) => xmlDecode(match[0]));
}

async function fetchFcaWarnings(): Promise<string | undefined> {
  const now = Date.now();
  if (fcaCache && fcaCache.expiresAt > now) return fcaCache.body;
  if (fcaFetch) return fcaFetch;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REGULATOR_TIMEOUT_MS);
  fcaFetch = (async () => {
    try {
      const response = await fetch(FCA_WARNINGS_RSS_URL, {
        headers: { accept: "application/rss+xml, application/xml, text/xml" },
        signal: controller.signal
      });
      if (!response.ok) return undefined;
      const body = await response.text();
      fcaCache = { expiresAt: Date.now() + REGULATOR_CACHE_TTL_MS, body };
      return body;
    } catch {
      fcaCache = { expiresAt: Date.now() + REGULATOR_CACHE_TTL_MS };
      return undefined;
    } finally {
      clearTimeout(timeout);
      fcaFetch = undefined;
    }
  })();

  return fcaFetch;
}

export async function checkRegulators(domain: string): Promise<{ matches: string[] }> {
  const body = await fetchFcaWarnings();
  if (!body) return { matches: [] };

  const listed = extractRssItems(body).some((entry) => warningEntryMatchesDomain(entry, domain));
  return { matches: listed ? ["FCA_WARNING_LIST"] : [] };
}
