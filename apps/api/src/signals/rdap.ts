export interface RdapSignal {
  domainAgeDays?: number;
  usesWhoisPrivacy: boolean;
}

const RDAP_TIMEOUT_MS = 3000;
const PRIVACY_MARKERS = [
  "whoisguard",
  "domains by proxy",
  "domain privacy",
  "privacyguardian",
  "perfect privacy",
  "contact privacy",
  "privacy protect",
  "redacted for privacy",
  "withheld for privacy",
  "identity protect",
  "anonymize",
  "proxy service"
];

function dateFromRegistrationEvent(payload: unknown): Date | undefined {
  if (!payload || typeof payload !== "object") return undefined;
  const events = (payload as { events?: unknown }).events;
  if (!Array.isArray(events)) return undefined;

  const registration = events.find(
    (event): event is { eventAction?: unknown; eventDate?: unknown } =>
      Boolean(event) && typeof event === "object" && (event as { eventAction?: unknown }).eventAction === "registration"
  );
  if (!registration || typeof registration.eventDate !== "string") return undefined;

  const date = new Date(registration.eventDate);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function hasKnownPrivacyProxy(payload: unknown): boolean {
  if (!payload || typeof payload !== "object") return false;
  const entities = (payload as { entities?: unknown }).entities;
  if (!Array.isArray(entities)) return false;

  const entityText = entities
    .filter((entity) => entity && typeof entity === "object")
    .map((entity) => JSON.stringify(entity).toLowerCase())
    .join(" ");

  return PRIVACY_MARKERS.some((marker) => entityText.includes(marker));
}

export async function lookupRdap(domain: string): Promise<RdapSignal> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), RDAP_TIMEOUT_MS);

  try {
    const response = await fetch(`https://rdap.org/domain/${encodeURIComponent(domain)}`, {
      headers: { accept: "application/rdap+json, application/json" },
      signal: controller.signal
    });
    if (!response.ok) return { domainAgeDays: undefined, usesWhoisPrivacy: false };

    const payload: unknown = await response.json();
    const registeredAt = dateFromRegistrationEvent(payload);
    const domainAgeDays = registeredAt
      ? Math.max(0, Math.floor((Date.now() - registeredAt.getTime()) / 86_400_000))
      : undefined;

    return { domainAgeDays, usesWhoisPrivacy: hasKnownPrivacyProxy(payload) };
  } catch {
    return { domainAgeDays: undefined, usesWhoisPrivacy: false };
  } finally {
    clearTimeout(timeout);
  }
}
