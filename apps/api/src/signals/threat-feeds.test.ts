import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("../config.js", () => ({ config: { GOOGLE_SAFE_BROWSING_API_KEY: "test-key" } }));

import { checkThreatFeeds } from "./threat-feeds.js";

describe("checkThreatFeeds", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it("uses Safe Browsing matches and caches the OpenPhish feed", async () => {
    const fetchMock = vi.fn().mockImplementation((input: string, init?: RequestInit) => {
      if (input.startsWith("https://safebrowsing.googleapis.com")) {
        const body = JSON.parse(String(init?.body)) as { threatInfo?: { threatEntries?: { url?: string }[] } };
        const listed = body.threatInfo?.threatEntries?.[0]?.url?.includes("safe-browsing.example") ?? false;
        return Promise.resolve(
          new Response(JSON.stringify(listed ? { matches: [{ threatType: "SOCIAL_ENGINEERING" }] } : {}), {
            status: 200
          })
        );
      }
      return Promise.resolve(new Response("https://openphish.example/login\n", { status: 200 }));
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(checkThreatFeeds("safe-browsing.example")).resolves.toEqual({ listed: true });
    await expect(checkThreatFeeds("another.example")).resolves.toEqual({ listed: false });
    expect(fetchMock.mock.calls.filter(([input]) => String(input).includes("openphish.com/feed.txt"))).toHaveLength(1);
  });

  it("returns neutral when both feeds return HTTP errors", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("error", { status: 503 })));

    await expect(checkThreatFeeds("unavailable.example")).resolves.toEqual({ listed: false });
  });

  it("returns neutral when feed requests time out", async () => {
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

    const resultPromise = checkThreatFeeds("slow.example");
    await vi.advanceTimersByTimeAsync(3000);

    await expect(resultPromise).resolves.toEqual({ listed: false });
  });
});
