const localBlocklist = new Set(["fake-broker.test", "clone-trading.test", "guaranteed-profit.test"]);

export async function checkThreatFeeds(domain: string): Promise<{ listed: boolean }> {
  return { listed: localBlocklist.has(domain) || domain.includes("phish") };
}
