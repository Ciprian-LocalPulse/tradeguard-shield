function renderBanner(result: any) {
  const existing = document.getElementById("tradeguard-shield-banner");
  existing?.remove();

  if (!result || result.riskLevel !== "high") return;

  const banner = document.createElement("div");
  banner.id = "tradeguard-shield-banner";
  banner.textContent = `TradeGuard Shield: high-risk trading site. ${result.reasons?.[0]?.detail ?? "Review before depositing funds."}`;
  banner.style.cssText = [
    "position:fixed",
    "z-index:2147483647",
    "top:0",
    "left:0",
    "right:0",
    "padding:12px 16px",
    "background:#b42318",
    "color:white",
    "font:14px system-ui,sans-serif",
    "box-shadow:0 2px 10px rgba(0,0,0,.25)"
  ].join(";");
  document.documentElement.appendChild(banner);
}

chrome.runtime.onMessage.addListener((message: any) => {
  if (message?.type === "TRADEGUARD_RESULT") {
    renderBanner(message.result);
  }
});
