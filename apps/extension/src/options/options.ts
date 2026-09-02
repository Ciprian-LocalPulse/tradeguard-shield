async function load() {
  const data = await chrome.storage.sync.get(["apiBaseUrl"]);
  const input = document.querySelector<HTMLInputElement>("#apiBaseUrl");
  if (input) input.value = data.apiBaseUrl || "http://localhost:8080";
}

document.querySelector("form")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const input = document.querySelector<HTMLInputElement>("#apiBaseUrl");
  await chrome.storage.sync.set({ apiBaseUrl: input?.value || "http://localhost:8080" });
});

void load();
