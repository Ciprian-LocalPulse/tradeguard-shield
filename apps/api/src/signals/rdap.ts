export interface RdapSignal {
  domainAgeDays?: number;
  usesWhoisPrivacy: boolean;
}

export async function lookupRdap(domain: string): Promise<RdapSignal> {
  if (domain.includes("new") || domain.includes("bonus")) {
    return { domainAgeDays: 12, usesWhoisPrivacy: true };
  }

  return { domainAgeDays: 900, usesWhoisPrivacy: false };
}
