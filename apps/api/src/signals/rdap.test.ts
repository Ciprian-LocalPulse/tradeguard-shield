import { afterEach, describe, expect, it, vi } from "vitest";
import { lookupRdap } from "./rdap.js";

describe("lookupRdap", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("extracts registration age and known privacy proxy from RDAP", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            events: [{ eventAction: "registration", eventDate: "2020-01-01T00:00:00Z" }],
            entities: [{ roles: ["registrant"], vcardArray: ["vcard", [["fn", {}, "text", "Domains By Proxy, LLC"]]] }]
          }),
          { status: 200, headers: { "content-type": "application/rdap+json" } }
        )
      )
    );

    const result = await lookupRdap("example.com");

    expect(result.domainAgeDays).toBeGreaterThan(2000);
    expect(result.usesWhoisPrivacy).toBe(true);
  });

  it("returns a neutral signal on HTTP errors and domains without history", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("not found", { status: 404 })));

    await expect(lookupRdap("unknown.invalid")).resolves.toEqual({
      domainAgeDays: undefined,
      usesWhoisPrivacy: false
    });
  });

  it("returns a neutral signal when RDAP times out", async () => {
    vi.useFakeTimers();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(
        (_input: string, init: RequestInit) =>
          new Promise((_resolve, reject) => {
            init.signal?.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")));
          })
      )
    );

    const resultPromise = lookupRdap("slow.example");
    await vi.advanceTimersByTimeAsync(3000);

    await expect(resultPromise).resolves.toEqual({ domainAgeDays: undefined, usesWhoisPrivacy: false });
    vi.useRealTimers();
  });
});
