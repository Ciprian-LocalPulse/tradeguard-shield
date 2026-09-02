const DEFAULT_API_BASE_URL = "http://localhost:8080";

async function getApiBaseUrl(): Promise<string> {
  const data = await chrome.storage.sync.get(["apiBaseUrl"]);
  return data.apiBaseUrl || DEFAULT_API_BASE_URL;
}

async function checkTab(tabId: number, url?: string) {
  if (!url || !/^https?:\/\//i.test(url)) return;

  const apiBaseUrl = await getApiBaseUrl();
  const response = await fetch(`${apiBaseUrl}/api/v1/check?url=${encodeURIComponent(url)}`);
  const result = await response.json();

  await chrome.storage.local.set({ [`check:${tabId}`]: result });
  await chrome.action.setBadgeText({ tabId, text: result.badge === "green" ? "OK" : result.badge === "yellow" ? "!" : "!!" });
  await chrome.action.setBadgeBackgroundColor({ tabId, color: result.badge });
  await chrome.tabs.sendMessage(tabId, { type: "TRADEGUARD_RESULT", result }).catch(() => undefined);
}

chrome.tabs.onUpdated.addListener((tabId: number, changeInfo: { url?: string; status?: string }, tab: { url?: string }) => {
  if (changeInfo.status === "complete" || changeInfo.url) {
    void checkTab(tabId, changeInfo.url || tab.url);
  }
});

chrome.tabs.onActivated.addListener(async ({ tabId }: { tabId: number }) => {
  const tab = await chrome.tabs.get(tabId);
  void checkTab(tabId, tab.url);
});
