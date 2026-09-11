import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

let checkRegulators: typeof import("./regulators.js").checkRegulators;

const FCA_RSS = `<?xml version="1.0"?><rss><channel><item><title>Example warning</title><description>https://warning-broker.example/login</description></item></channel></rss>`;

describe("checkRegulators", () => {
  beforeEach(async () => {
    vi.resetModules();
    ({ checkRegulators } = await import("./regulators.js"));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it("matches a domain from the FCA warning feed", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(FCA_RSS, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(checkRegulators("warning-broker.example")).resolves.toEqual({ matches: ["FCA_WARNING_LIST"] });
    await expect(checkRegulators("clean.example")).resolves.toEqual({ matches: [] });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("returns neutral on an HTTP error", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("unavailable", { status: 503 })));

    await expect(checkRegulators("unavailable.example")).resolves.toEqual({ matches: [] });
  });

  it("returns neutral when the regulator feed times out", async () => {
    vi.useFakeTimers();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation((_input: string, init?: RequestInit) =>
        new Promise((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")));
        })
      )
    );

    const resultPromise = checkRegulators("slow.example");
    await vi.advanceTimersByTimeAsync(3000);

    await expect(resultPromise).resolves.toEqual({ matches: [] });
  });
});
