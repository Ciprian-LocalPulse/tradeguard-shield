const riskyTerms = ["guaranteed profit", "risk free", "100% bonus", "instant withdrawal", "vip signal"];

export async function analyzeContentClaims(inputUrl: string): Promise<{ claims: string[] }> {
  const normalized = inputUrl.toLowerCase().replaceAll("-", " ");
  const claims = riskyTerms.filter((term) => normalized.includes(term));
  return { claims };
}
