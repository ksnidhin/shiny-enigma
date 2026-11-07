// RetroTimeCo Collector — Service Worker (Manifest V3)

// Initialize storage state on installation
chrome.runtime.onInstalled.addListener(async () => {
  const data = await chrome.storage.local.get(["queue", "history", "settings"]);
  if (!data.queue) await chrome.storage.local.set({ queue: [] });
  if (!data.history) await chrome.storage.local.set({ history: [] });
  if (!data.settings) {
    await chrome.storage.local.set({
      settings: {
        autoDetectPrice: true,
        highResImages: true,
        skipAlreadyExported: true,
      },
    });
  }
  await updateBadge();
  console.log("RetroTimeCo Collector initialized.");
});

// Update extension icon badge with queue count
async function updateBadge() {
  const { queue = [] } = await chrome.storage.local.get("queue");
  const count = queue.length;
  if (count > 0) {
    await chrome.action.setBadgeText({ text: String(count) });
    await chrome.action.setBadgeBackgroundColor({ color: "#C85A17" }); // RetroTimeCo Burnt Orange
  } else {
    await chrome.action.setBadgeText({ text: "" });
  }
}

// Listen to storage changes to update badge in real time
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.queue) {
    updateBadge();
  }
});

// Message Passing Router
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    try {
      switch (message.type) {
        case "OPEN_SIDEPANEL": {
          let windowId = message.windowId;
          if (!windowId && sender.tab?.windowId) {
            windowId = sender.tab.windowId;
          }
          if (!windowId) {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            windowId = tab?.windowId;
          }
          if (windowId && chrome.sidePanel?.open) {
            await chrome.sidePanel.open({ windowId });
            sendResponse({ success: true });
          } else {
            sendResponse({ success: false, error: "Side panel not supported or window not found" });
          }
          break;
        }

        case "GET_STATE": {
          const state = await chrome.storage.local.get(["queue", "history", "settings"]);
          sendResponse({ success: true, data: state });
          break;
        }

        case "ADD_POST": {
          const { post } = message;
          if (!post || !post.post_id) {
            sendResponse({ success: false, error: "Invalid post payload" });
            return;
          }
          const { queue = [] } = await chrome.storage.local.get("queue");
          const exists = queue.some((p) => p.post_id === post.post_id);
          if (exists) {
            sendResponse({ success: false, error: "Post already in queue" });
            return;
          }
          const updated = [...queue, { ...post, added_at: new Date().toISOString() }];
          await chrome.storage.local.set({ queue: updated });
          await updateBadge();
          sendResponse({ success: true, count: updated.length });
          break;
        }

        case "ADD_POSTS_BULK": {
          const { posts = [] } = message;
          const { queue = [] } = await chrome.storage.local.get("queue");
          const existingIds = new Set(queue.map((p) => p.post_id));
          const toAdd = posts.filter((p) => p && p.post_id && !existingIds.has(p.post_id));
          const updated = [...queue, ...toAdd.map((p) => ({ ...p, added_at: new Date().toISOString() }))];
          await chrome.storage.local.set({ queue: updated });
          await updateBadge();
          sendResponse({ success: true, added: toAdd.length, total: updated.length });
          break;
        }

        case "REMOVE_POST": {
          const { post_id } = message;
          const { queue = [] } = await chrome.storage.local.get("queue");
          const updated = queue.filter((p) => p.post_id !== post_id);
          await chrome.storage.local.set({ queue: updated });
          await updateBadge();
          sendResponse({ success: true, count: updated.length });
          break;
        }

        case "CLEAR_QUEUE": {
          await chrome.storage.local.set({ queue: [] });
          await updateBadge();
          sendResponse({ success: true });
          break;
        }

        case "MARK_EXPORTED": {
          const { post_ids } = message;
          if (Array.isArray(post_ids) && post_ids.length > 0) {
            const { history = [], queue = [] } = await chrome.storage.local.get(["history", "queue"]);
            const historySet = new Set(history.map((h) => (typeof h === "string" ? h : h.post_id)));
            const newHistoryEntries = [];
            for (const id of post_ids) {
              if (!historySet.has(id)) {
                newHistoryEntries.push({ post_id: id, exported_at: new Date().toISOString() });
              }
            }
            // Keep remaining un-exported items in queue
            const remainingQueue = queue.filter((p) => !post_ids.includes(p.post_id));
            await chrome.storage.local.set({
              history: [...history, ...newHistoryEntries],
              queue: remainingQueue,
            });
            await updateBadge();
            sendResponse({ success: true });
          } else {
            sendResponse({ success: false, error: "No post IDs provided" });
          }
          break;
        }

        default:
          sendResponse({ success: false, error: `Unknown message type: ${message.type}` });
      }
    } catch (err) {
      console.error("Service worker error:", err);
      sendResponse({ success: false, error: err.message });
    }
  })();
  return true; // Keep message channel open for async response
});
