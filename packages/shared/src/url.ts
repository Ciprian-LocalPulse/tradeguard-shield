export function normalizeUrl(input: string): URL {
  const trimmed = input.trim();
  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  return new URL(candidate);
}

export function extractRegistrableDomain(input: string): string {
  const url = normalizeUrl(input);
  const host = url.hostname.toLowerCase().replace(/^www\./, "");
  const labels = host.split(".");

  if (labels.length <= 2) {
    return host;
  }

  const knownSecondLevelSuffixes = new Set(["co.uk", "com.au", "com.br", "com.cy"]);
  const lastTwo = labels.slice(-2).join(".");

  if (knownSecondLevelSuffixes.has(lastTwo) && labels.length >= 3) {
    return labels.slice(-3).join(".");
  }

  return labels.slice(-2).join(".");
}
