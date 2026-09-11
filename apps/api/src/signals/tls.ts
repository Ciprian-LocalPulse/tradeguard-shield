import https from "node:https";
import type { TLSSocket } from "node:tls";

const TLS_TIMEOUT_MS = 3000;

export async function checkTls(domain: string): Promise<{ valid: boolean }> {
  return new Promise((resolve) => {
    const request = https.request(
      { hostname: domain, method: "HEAD", port: 443, path: "/", rejectUnauthorized: true, timeout: TLS_TIMEOUT_MS },
      (response) => {
        response.resume();
        resolve({ valid: (response.socket as TLSSocket | null)?.authorized === true });
      }
    );
    request.on("timeout", () => request.destroy());
    request.on("error", () => resolve({ valid: false }));
    request.end();
  });
}
