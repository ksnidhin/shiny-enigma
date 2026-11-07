// RetroTimeCo Collector — Safe Non-Intrusive Content Script
// Runs on https://www.instagram.com/*
// STRICT DESIGN RULE: 100% read-only on Instagram's DOM tree. Never append, modify, or delete
// any child elements inside Instagram's React containers (<a>, <article>, <div>, etc.).

(function () {
  "use strict";

  if (window.__RTC_COLLECTOR_LOADED__) return;
  window.__RTC_COLLECTOR_LOADED__ = true;

  console.log("RetroTimeCo Collector: Content script initialized in safe read-only mode.");

  // Local state cache
  let queueState = [];
  let historyState = [];
  let pollTimer = null;

  // Helper: Extract shortcode / post ID from URL
  function extractPostId(url) {
    if (!url) return null;
    const match = url.match(/\/(?:p|reel|tv)\/([A-Za-z0-9_-]+)/);
    return match ? match[1] : null;
  }

  // Helper: Extract highest-resolution image from srcset or src
  function getBestImageUrl(imgEl) {
    if (!imgEl) return null;
    const srcset = imgEl.getAttribute("srcset");
    if (srcset) {
      const candidates = srcset
        .split(",")
        .map((entry) => {
          const parts = entry.trim().split(/\s+/);
          const url = parts[0];
          const widthMatch = parts[1]?.match(/(\d+)w/);
          const width = widthMatch ? parseInt(widthMatch[1], 10) : 0;
          return { url, width };
        })
        .filter((c) => c.url && !c.url.includes("data:"));

      if (candidates.length > 0) {
        candidates.sort((a, b) => b.width - a.width);
        return candidates[0].url;
      }
    }
    return imgEl.src && !imgEl.src.startsWith("data:") ? imgEl.src : null;
  }

  // Helper: Smart price and sold state extraction from caption
  function extractPriceAndStatus(caption) {
    if (!caption) return { detected_price: null, raw_price_string: null, is_sold: false };

    const isSold = /(?:sold\s*out|sold\b|booked\b|reserved\b|on\s*hold)/i.test(caption);

    // Regex for Indian currency prices: e.g. ₹4,500, ₹ 4500, Rs. 4,500, INR 4500, 4500/-
    const pricePatterns = [
      /(?:₹|rs\.?|inr)\s*([\d,]+(?:\.\d+)?)\s*(?:\/-)?/i,
      /price\s*[:\-]\s*(?:₹|rs\.?|inr)?\s*([\d,]+(?:\.\d+)?)/i,
      /(?:^|\s)([\d,]{3,7})\s*(?:\/-|inr|rs)/i,
    ];

    let detectedPrice = null;
    let rawPriceString = null;

    for (const pattern of pricePatterns) {
      const match = caption.match(pattern);
      if (match && match[1]) {
        const cleaned = match[1].replace(/,/g, "");
        const num = parseFloat(cleaned);
        if (!isNaN(num) && num >= 100 && num <= 10000000) {
          detectedPrice = num;
          rawPriceString = match[0].trim();
          break;
        }
      }
    }

    return { detected_price: detectedPrice, raw_price_string: rawPriceString, is_sold: isSold };
  }

  // Helper: Extract hashtags from caption text
  function extractHashtags(text) {
    if (!text) return [];
    const matches = text.match(/#([\w\u0080-\uffff]+)/g);
    return matches ? Array.from(new Set(matches.map((h) => h.toLowerCase()))) : [];
  }

  // Helper: Read-only parse of active open post
  function parseCurrentPost() {
    const dialogOrArticle =
      document.querySelector('div[role="dialog"] article') ||
      document.querySelector("article");

    let postId = null;
    if (dialogOrArticle) {
      const postLink = dialogOrArticle.querySelector('a[href*="/p/"], a[href*="/reel/"]');
      if (postLink) {
        postId = extractPostId(postLink.getAttribute("href"));
      }
    }
    if (!postId) {
      postId = extractPostId(window.location.pathname);
    }
    if (!postId) return null;

    const postUrl = `https://www.instagram.com/p/${postId}/`;

    // Extract caption
    let caption = "";
    if (dialogOrArticle) {
      const captionEl =
        dialogOrArticle.querySelector("h1") ||
        dialogOrArticle.querySelector('span[class*="_ap3a"]') ||
        dialogOrArticle.querySelector('div[data-testid="post-comment-root"] span');

      if (captionEl) {
        caption = captionEl.innerText || captionEl.textContent || "";
      } else {
        const spans = dialogOrArticle.querySelectorAll("span");
        for (const s of spans) {
          if (s.innerText && s.innerText.length > 30) {
            caption = s.innerText;
            break;
          }
        }
      }
    }

    // Extract timestamp
    let postedAt = null;
    if (dialogOrArticle) {
      const timeEl = dialogOrArticle.querySelector("time[datetime]");
      if (timeEl) postedAt = timeEl.getAttribute("datetime");
    }

    // Extract images
    const images = [];
    const seenUrls = new Set();
    const targetRoot = dialogOrArticle || document;
    const imgEls = targetRoot.querySelectorAll('img[style*="object-fit"], div[role="button"] img, ul li img, img');

    imgEls.forEach((img) => {
      const rect = img.getBoundingClientRect();
      const isAvatar =
        (rect.width > 0 && rect.width < 120) ||
        (rect.height > 0 && rect.height < 120) ||
        img.src.includes("/s150x150/") ||
        img.alt.includes("profile picture");

      if (!isAvatar) {
        const bestUrl = getBestImageUrl(img);
        if (bestUrl && !seenUrls.has(bestUrl)) {
          seenUrls.add(bestUrl);
          images.push(bestUrl);
        }
      }
    });

    const { detected_price, raw_price_string, is_sold } = extractPriceAndStatus(caption);
    const hashtags = extractHashtags(caption);

    return {
      post_id: postId,
      url: postUrl,
      caption: caption.trim(),
      hashtags,
      posted_at: postedAt || new Date().toISOString(),
      detected_price,
      raw_price_string,
      is_sold,
      images,
      image_count: images.length,
      is_carousel: images.length > 1,
    };
  }

  // Helper: Read-only parse of visible posts in the feed / grid
  function parseVisibleGridPosts() {
    const postLinks = document.querySelectorAll('a[href*="/p/"], a[href*="/reel/"]');
    const posts = [];
    const seen = new Set();

    postLinks.forEach((link) => {
      const postId = extractPostId(link.getAttribute("href"));
      if (!postId || seen.has(postId)) return;
      seen.add(postId);

      const inQueue = queueState.some((p) => p.post_id === postId);
      const inHistory = historyState.some((h) => (typeof h === "string" ? h : h.post_id) === postId);

      const img = link.querySelector("img");
      const bestImg = getBestImageUrl(img);
      const altText = img?.alt || "";
      const { detected_price, is_sold } = extractPriceAndStatus(altText);

      posts.push({
        post_id: postId,
        url: `https://www.instagram.com/p/${postId}/`,
        caption: altText,
        hashtags: extractHashtags(altText),
        posted_at: new Date().toISOString(),
        images: bestImg ? [bestImg] : [],
        image_count: bestImg ? 1 : 0,
        is_carousel: false,
        detected_price,
        is_sold,
        status: inQueue ? "queued" : inHistory ? "exported" : "uncollected",
      });
    });

    return posts;
  }

  // Safely auto-step through carousel arrows to load all images into memory
  async function autoScanCarousel() {
    showToast("Scanning carousel slides...");
    const dialogOrArticle =
      document.querySelector('div[role="dialog"] article') ||
      document.querySelector("article");

    if (!dialogOrArticle) {
      showToast("No active post dialog found.", "error");
      return null;
    }

    let clicks = 0;
    while (clicks < 10) {
      const nextBtn =
        dialogOrArticle.querySelector('button[aria-label="Next"]') ||
        dialogOrArticle.querySelector('button[aria-label="Go to next slide"]') ||
        dialogOrArticle.querySelector('button._afxw');
      if (!nextBtn) break;
      nextBtn.click();
      clicks++;
      await new Promise((r) => setTimeout(r, 400));
    }

    const updated = parseCurrentPost();
    if (updated) {
      showToast(`Scan complete: ${updated.images.length} photos ready!`);
      updateDockState();
      return updated;
    }
    return null;
  }

  // Toast notification (appended only to body, completely isolated)
  function showToast(text, type = "info") {
    const existing = document.getElementById("rtc-toast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.id = "rtc-toast";
    toast.className = "rtc-toast";
    toast.innerHTML = `
      <span style="color:#C85A17;">✦</span>
      <span>${text}</span>
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.transition = "opacity 0.3s";
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // Sync state from background storage
  async function syncState() {
    return new Promise((resolve) => {
      if (!chrome.runtime?.id) return resolve();
      chrome.runtime.sendMessage({ type: "GET_STATE" }, (res) => {
        if (chrome.runtime.lastError) return resolve();
        if (res && res.success && res.data) {
          queueState = res.data.queue || [];
          historyState = res.data.history || [];
          updateDockState();
        }
        resolve();
      });
    });
  }

  // Create isolated Floating Dock (appended once to document.body, does NOT touch Instagram React tree)
  function createFloatingDock() {
    if (document.getElementById("rtc-collector-dock")) return;

    const dock = document.createElement("div");
    dock.id = "rtc-collector-dock";
    dock.innerHTML = `
      <div class="rtc-dock-brand">
        <div class="rtc-dock-logo"></div>
        <span>RetroTimeCo</span>
        <span class="rtc-dock-counter" id="rtc-dock-count">0</span>
      </div>
      <div class="rtc-dock-context" id="rtc-dock-context-text">Ready</div>
      <div class="rtc-dock-actions" id="rtc-dock-actions">
        <!-- Dynamic contextual buttons populated by updateDockState -->
      </div>
    `;

    document.body.appendChild(dock);
    updateDockState();
  }

  // Update floating dock content based on current page state
  function updateDockState() {
    const dock = document.getElementById("rtc-collector-dock");
    if (!dock) return;

    const countEl = document.getElementById("rtc-dock-count");
    if (countEl) countEl.textContent = String(queueState.length);

    const contextEl = document.getElementById("rtc-dock-context-text");
    const actionsEl = document.getElementById("rtc-dock-actions");
    if (!contextEl || !actionsEl) return;

    const currentPost = parseCurrentPost();

    if (currentPost) {
      const inQueue = queueState.some((p) => p.post_id === currentPost.post_id);
      const inHistory = historyState.some((h) => (typeof h === "string" ? h : h.post_id) === currentPost.post_id);

      const priceStr = currentPost.detected_price
        ? `₹${currentPost.detected_price.toLocaleString("en-IN")}`
        : "";
      const statusBadge = inQueue
        ? '<span class="rtc-status-tag queued">Queued</span>'
        : inHistory
        ? '<span class="rtc-status-tag exported">Exported</span>'
        : "";

      contextEl.innerHTML = `
        <span class="rtc-dock-post-id">#${currentPost.post_id}</span>
        ${priceStr ? `<span class="rtc-dock-price">${priceStr}</span>` : ""}
        <span class="rtc-dock-photos">📷 ${currentPost.image_count}</span>
        ${statusBadge}
      `;

      actionsEl.innerHTML = `
        ${
          currentPost.is_carousel
            ? `<button class="rtc-dock-btn" id="rtc-dock-scan-carousel" title="Scan all carousel slides">Scan Carousel</button>`
            : ""
        }
        <button class="rtc-dock-btn ${inQueue ? "" : "rtc-dock-btn-primary"}" id="rtc-dock-collect-post">
          ${inQueue ? "✓ In Queue" : "+ Add Post"}
        </button>
        <button class="rtc-dock-btn" id="rtc-dock-open-sidepanel" title="Open Collector Dashboard">
          Dashboard ↗
        </button>
      `;

      // Event handlers
      document.getElementById("rtc-dock-scan-carousel")?.addEventListener("click", async () => {
        await autoScanCarousel();
      });

      document.getElementById("rtc-dock-collect-post")?.addEventListener("click", () => {
        const fresh = parseCurrentPost();
        if (fresh) {
          chrome.runtime.sendMessage({ type: "ADD_POST", post: fresh }, (res) => {
            if (res && res.success) {
              showToast(`Added #${fresh.post_id} (${fresh.images.length} photos) to queue!`);
              syncState();
            } else {
              showToast(res?.error || "Already in queue", "info");
            }
          });
        }
      });
    } else {
      // Profile or feed view
      const visible = parseVisibleGridPosts();
      const uncollectedCount = visible.filter((p) => p.status === "uncollected").length;

      contextEl.innerHTML = `<span>${visible.length} watches visible (${uncollectedCount} new)</span>`;

      actionsEl.innerHTML = `
        <button class="rtc-dock-btn ${uncollectedCount > 0 ? "rtc-dock-btn-primary" : ""}" id="rtc-dock-collect-all">
          + Collect Visible (${uncollectedCount})
        </button>
        <button class="rtc-dock-btn" id="rtc-dock-open-sidepanel" title="Open Collector Dashboard">
          Dashboard ↗
        </button>
      `;

      document.getElementById("rtc-dock-collect-all")?.addEventListener("click", () => {
        const uncollected = visible.filter((p) => p.status === "uncollected");
        if (uncollected.length === 0) {
          showToast("All visible posts on screen are already collected.");
          return;
        }

        chrome.runtime.sendMessage({ type: "ADD_POSTS_BULK", posts: uncollected }, (res) => {
          if (res && res.success) {
            showToast(`Added ${res.added} watch posts to queue!`);
            syncState();
          }
        });
      });
    }

    document.getElementById("rtc-dock-open-sidepanel")?.addEventListener("click", () => {
      chrome.runtime.sendMessage({ type: "OPEN_SIDEPANEL" });
    });
  }

  // Safe periodic polling: check URL/DOM state every 800ms (100% read-only, NO mutations)
  function startSafePolling() {
    if (pollTimer) clearInterval(pollTimer);
    pollTimer = setInterval(() => {
      updateDockState();
    }, 800);
  }

  // Handle messages from Side Panel and Popup
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {
      case "CHECK_ACTIVE_POST": {
        const currentPost = parseCurrentPost();
        sendResponse({
          hasActivePost: Boolean(currentPost),
          postId: currentPost?.post_id || null,
        });
        return true;
      }

      case "GET_ACTIVE_POST_DATA": {
        const currentPost = parseCurrentPost();
        const visiblePosts = parseVisibleGridPosts();
        sendResponse({
          currentPost,
          visibleCount: visiblePosts.length,
          uncollectedCount: visiblePosts.filter((p) => p.status === "uncollected").length,
          visiblePosts,
        });
        return true;
      }

      case "COLLECT_CURRENT_OPEN_POST": {
        const post = parseCurrentPost();
        if (post) {
          chrome.runtime.sendMessage({ type: "ADD_POST", post }, (res) => {
            syncState();
            sendResponse(res);
          });
        } else {
          sendResponse({ success: false, error: "No watch post open on screen." });
        }
        return true;
      }

      case "COLLECT_VISIBLE_POSTS": {
        const visible = parseVisibleGridPosts();
        const uncollected = visible.filter((p) => p.status === "uncollected");
        if (uncollected.length === 0) {
          sendResponse({ success: false, error: "No uncollected posts found." });
        } else {
          chrome.runtime.sendMessage({ type: "ADD_POSTS_BULK", posts: uncollected }, (res) => {
            syncState();
            sendResponse(res);
          });
        }
        return true;
      }

      case "SCAN_CAROUSEL": {
        autoScanCarousel().then((updated) => {
          sendResponse({ success: Boolean(updated), post: updated });
        });
        return true;
      }

      default:
        break;
    }
  });

  // Safe initialization
  syncState().then(() => {
    createFloatingDock();
    startSafePolling();
  });
})();
