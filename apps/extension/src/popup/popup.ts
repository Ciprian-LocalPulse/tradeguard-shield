async function load() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const data = await chrome.storage.local.get([`check:${tab.id}`]);
  const result = data[`check:${tab.id}`];

  const status = document.querySelector<HTMLElement>("#status");
  const reasons = document.querySelector<HTMLElement>("#reasons");

  if (!status || !reasons) return;

  if (!result) {
    status.textContent = "No check result yet.";
    return;
  }

  document.body.dataset.badge = result.badge;
  status.textContent = `${result.domain}: ${result.score}/100 (${result.riskLevel} risk)`;
  reasons.innerHTML = "";

  for (const reason of result.reasons ?? []) {
    const item = document.createElement("li");
    item.textContent = reason.detail;
    reasons.appendChild(item);
  }
}

document.querySelector("#report")?.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  await chrome.tabs.create({ url: `mailto:abuse@example.com?subject=TradeGuard report&body=${encodeURIComponent(tab.url ?? "")}` });
});

void load();
