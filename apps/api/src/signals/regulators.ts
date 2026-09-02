const regulatedDomains = new Map<string, string[]>([
  ["example-regulated-broker.com", ["FCA", "CySEC"]]
]);

export async function checkRegulators(domain: string): Promise<{ matches: string[] }> {
  return { matches: regulatedDomains.get(domain) ?? [] };
}
