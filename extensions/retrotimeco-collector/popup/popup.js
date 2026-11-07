// RetroTimeCo Collector — Popup Controller

(function () {
  "use strict";

  const pageStatusEl = document.getElementById("page-status");
  const queueCountEl = document.getElementById("queue-count");
  const historyCountEl = document.getElementById("history-count");
  const btnCollectCurrent = document.getElementById("btn-collect-current");
  const btnOpenSidepanel = document.getElementById("btn-open-sidepanel");
  const btnOpenInstagram = document.getElementById("btn-open-instagram");

  async function init() {
    // 1. Fetch current storage counts
    const data = await chrome.storage.local.get(["queue", "history"]);
    queueCountEl.textContent = String(data.queue?.length || 0);
    historyCountEl.textContent = String(data.history?.length || 0);

    // 2. Query active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.url) {
      pageStatusEl.textContent = "Unknown Tab";
      return;
    }

    const isInstagram = tab.url.includes("instagram.com");
    if (!isInstagram) {
      pageStatusEl.textContent = "Not Instagram";
      pageStatusEl.style.color = "#FF9800";
      return;
    }

    pageStatusEl.textContent = "Instagram Active";
    pageStatusEl.style.color = "#4CAF50";

    // 3. Check if an active post is currently open in the active tab
    try {
      chrome.tabs.sendMessage(tab.id, { type: "CHECK_ACTIVE_POST" }, (res) => {
        if (chrome.runtime.lastError) return;
        if (res && res.hasActivePost) {
          btnCollectCurrent.style.display = "flex";
          btnCollectCurrent.textContent = `+ Collect Post #${res.postId}`;
        }
      });
    } catch {}

    // Event: Collect active post
    btnCollectCurrent.addEventListener("click", async () => {
      btnCollectCurrent.disabled = true;
      btnCollectCurrent.textContent = "Collecting...";
      chrome.tabs.sendMessage(tab.id, { type: "COLLECT_CURRENT_OPEN_POST" }, async (res) => {
        if (res && res.success) {
          btnCollectCurrent.textContent = "✓ Added to Queue!";
          const updated = await chrome.storage.local.get("queue");
          queueCountEl.textContent = String(updated.queue?.length || 0);
        } else {
          btnCollectCurrent.textContent = res?.error || "Failed";
          btnCollectCurrent.disabled = false;
        }
      });
    });

    // Event: Open side panel
    btnOpenSidepanel.addEventListener("click", async () => {
      await chrome.runtime.sendMessage({
        type: "OPEN_SIDEPANEL",
        windowId: tab.windowId,
      });
      window.close(); // Close popup once side panel opens
    });

    // Event: Go to @retrotimeco.in
    btnOpenInstagram.addEventListener("click", () => {
      chrome.tabs.create({ url: "https://www.instagram.com/retrotimeco.in/" });
      window.close();
    });
  }

  init();
})();
