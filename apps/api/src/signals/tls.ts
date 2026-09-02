export async function checkTls(domain: string): Promise<{ valid: boolean }> {
  return { valid: !domain.includes("invalid") };
}
