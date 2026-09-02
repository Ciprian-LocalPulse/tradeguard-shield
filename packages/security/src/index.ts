const blockedHosts = new Set(["localhost", "127.0.0.1", "0.0.0.0", "::1"]);
const blockedTlds = new Set(["local", "internal", "localhost"]);

export interface UrlSafetyResult {
  ok: boolean;
  reason?: string;
  url?: URL;
}

export function validatePublicHttpUrl(input: string): UrlSafetyResult {
  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(input.trim()) ? input.trim() : `https://${input.trim()}`);
  } catch {
    return { ok: false, reason: "The provided value is not a valid URL." };
  }

  if (!["http:", "https:"].includes(url.protocol)) {
    return { ok: false, reason: "Only http and https URLs are supported." };
  }

  const hostname = url.hostname.toLowerCase();
  const labels = hostname.split(".");
  const tld = labels.at(-1) ?? "";

  if (blockedHosts.has(hostname) || blockedTlds.has(tld)) {
    return { ok: false, reason: "Private, local, or internal hosts are not accepted for risk checks." };
  }

  if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
    return { ok: false, reason: "Direct IP address checks are disabled to reduce SSRF risk." };
  }

  if (hostname.length > 253 || labels.some((label) => label.length === 0 || label.length > 63)) {
    return { ok: false, reason: "Hostname is malformed." };
  }

  return { ok: true, url };
}

export const securityHeaders = {
  "content-security-policy": "default-src 'none'; frame-ancestors 'none'; base-uri 'none'",
  "cross-origin-opener-policy": "same-origin",
  "cross-origin-resource-policy": "same-origin",
  "referrer-policy": "no-referrer",
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY"
};
