// RetroTimeCo Collector — Content Script
// Runs on https://www.instagram.com/*

(function () {
  "use strict";

  // Prevent multiple script initializations
  if (window.__RTC_COLLECTOR_LOADED__) return;
  window.__RTC_COLLECTOR_LOADED__ = true;

  console.log("RetroTimeCo Collector content script loaded.");

  // Local state cache
  let queueState = [];
  let historyState = [];

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

  // Helper: Parse active post details from an article or dialog element
  function parsePostElement(articleEl) {
    if (!articleEl) return null;

    // 1. Post ID and URL
    let postId = null;
    const postLink = articleEl.querySelector('a[href*="/p/"], a[href*="/reel/"]');
    if (postLink) {
      postId = extractPostId(postLink.getAttribute("href"));
    }
    if (!postId) {
      postId = extractPostId(window.location.pathname);
    }
    if (!postId) return null;

    const postUrl = `https://www.instagram.com/p/${postId}/`;

    // 2. Caption
    let caption = "";
    // Instagram typically houses the author caption inside an h1 or the first comment element
    const captionEl =
      articleEl.querySelector("h1") ||
      articleEl.querySelector('span[class*="_ap3a"]') ||
      articleEl.querySelector('div[data-testid="post-comment-root"] span');

    if (captionEl) {
      caption = captionEl.innerText || captionEl.textContent || "";
    } else {
      // Fallback: look through comment spans
      const spans = articleEl.querySelectorAll("article span");
      for (const s of spans) {
        if (s.innerText && s.innerText.length > 30) {
          caption = s.innerText;
          break;
        }
      }
    }

    // 3. Posting Date
    let postedAt = null;
    const timeEl = articleEl.querySelector("time[datetime]");
    if (timeEl) {
      postedAt = timeEl.getAttribute("datetime");
    }

    // 4. Images Extraction (including carousels)
    const images = [];
    const seenUrls = new Set();

    // Look for all post images (ignore avatars, emojis)
    const imgEls = articleEl.querySelectorAll('img[style*="object-fit"], div[role="button"] img, ul li img, img');
    imgEls.forEach((img) => {
      // Filter out small avatars / icons
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

    // 5. Price & Status
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

  // Toast notification in page
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
      chrome.runtime.sendMessage({ type: "GET_STATE" }, (res) => {
        if (res && res.success && res.data) {
          queueState = res.data.queue || [];
          historyState = res.data.history || [];
          updateDockCount();
          updateGridBadges();
          updateActiveBanner();
        }
        resolve();
      });
    });
  }

  // Check status of a post ID
  function getPostStatus(postId) {
    if (!postId) return "uncollected";
    const inQueue = queueState.some((p) => p.post_id === postId);
    if (inQueue) return "queued";
    const inHistory = historyState.some((h) => (typeof h === "string" ? h : h.post_id) === postId);
    if (inHistory) return "exported";
    return "uncollected";
  }

  // 1. Floating Bottom Dock UI
  function renderDock() {
    if (document.getElementById("rtc-collector-dock")) return;

    const dock = document.createElement("div");
    dock.id = "rtc-collector-dock";
    dock.innerHTML = `
      <div class="rtc-dock-brand">
        <div class="rtc-dock-logo"></div>
        <span>RetroTimeCo</span>
        <span class="rtc-dock-counter" id="rtc-dock-count">0</span>
      </div>
      <div class="rtc-dock-actions">
        <button class="rtc-dock-btn" id="rtc-dock-collect-page" title="Collect all visible posts on this page">
          + Collect Visible
        </button>
        <button class="rtc-dock-btn rtc-dock-btn-primary" id="rtc-dock-open-sidepanel" title="Open Collector Dashboard">
          Dashboard ↗
        </button>
      </div>
    `;

    document.body.appendChild(dock);

    document.getElementById("rtc-dock-open-sidepanel")?.addEventListener("click", () => {
      chrome.runtime.sendMessage({ type: "OPEN_SIDEPANEL" });
    });

    document.getElementById("rtc-dock-collect-page")?.addEventListener("click", () => {
      collectVisibleGridPosts();
    });
  }

  function updateDockCount() {
    const countEl = document.getElementById("rtc-dock-count");
    if (countEl) {
      countEl.textContent = String(queueState.length);
    }
  }

  // 2. In-Post Banner UI (For active opened modal or /p/ page)
  function injectPostBanner() {
    const dialogOrArticle =
      document.querySelector('div[role="dialog"] article') ||
      document.querySelector("article");

    if (!dialogOrArticle) return;
    if (dialogOrArticle.querySelector(".rtc-post-banner")) return;

    const postData = parsePostElement(dialogOrArticle);
    if (!postData) return;

    const status = getPostStatus(postData.post_id);

    const banner = document.createElement("div");
    banner.className = "rtc-post-banner";
    banner.dataset.postId = postData.post_id;

    let statusBadgeHtml = "";
    if (status === "queued") {
      statusBadgeHtml = `<span class="rtc-badge rtc-badge-status-collected">✓ In Queue</span>`;
    } else if (status === "exported") {
      statusBadgeHtml = `<span class="rtc-badge rtc-badge-status-exported">✓ Already Exported</span>`;
    }

    const priceHtml = postData.detected_price
      ? `<span class="rtc-badge rtc-badge-price">₹${postData.detected_price.toLocaleString("en-IN")}</span>`
      : "";

    const soldHtml = postData.is_sold
      ? `<span class="rtc-badge rtc-badge-sold">SOLD</span>`
      : "";

    banner.innerHTML = `
      <div class="rtc-post-banner-info">
        <span class="rtc-badge rtc-badge-id">#${postData.post_id}</span>
        <span class="rtc-badge rtc-badge-photos">📷 ${postData.image_count} photos</span>
        ${priceHtml}
        ${soldHtml}
        ${statusBadgeHtml}
      </div>
      <div style="display:flex; align-items:center; gap:8px;">
        ${postData.is_carousel ? `
          <button class="rtc-dock-btn" id="rtc-btn-scan-carousel" title="Scan through all carousel images">
            Scan Carousel
          </button>
        ` : ''}
        <button class="rtc-dock-btn rtc-dock-btn-primary" id="rtc-btn-collect-active">
          ${status === "queued" ? "✓ Queued" : "+ Collect Post"}
        </button>
      </div>
    `;

    // Prepend banner to article
    dialogOrArticle.insertBefore(banner, dialogOrArticle.firstChild);

    // Event handlers
    banner.querySelector("#rtc-btn-collect-active")?.addEventListener("click", async () => {
      const freshPost = parsePostElement(dialogOrArticle);
      if (freshPost) {
        chrome.runtime.sendMessage({ type: "ADD_POST", post: freshPost }, (res) => {
          if (res && res.success) {
            showToast(`Added #${freshPost.post_id} (${freshPost.images.length} images) to queue!`);
            syncState();
          } else {
            showToast(res?.error || "Could not add post", "error");
          }
        });
      }
    });

    banner.querySelector("#rtc-btn-scan-carousel")?.addEventListener("click", async () => {
      await autoScanCarousel(dialogOrArticle);
    });
  }

  function updateActiveBanner() {
    const banner = document.querySelector(".rtc-post-banner");
    if (!banner) return;
    const postId = banner.dataset.postId;
    const status = getPostStatus(postId);
    const btn = banner.querySelector("#rtc-btn-collect-active");
    if (btn) {
      btn.textContent = status === "queued" ? "✓ Queued" : "+ Collect Post";
    }
  }

  // Automatically steps through carousel arrows to force-load all images into DOM
  async function autoScanCarousel(articleEl) {
    showToast("Scanning carousel slides...");
    const nextBtn =
      articleEl.querySelector('button[aria-label="Next"]') ||
      articleEl.querySelector('button[aria-label="Go to next slide"]') ||
      articleEl.querySelector('button._afxw');

    if (!nextBtn) {
      showToast("All visible slides detected.");
      return;
    }

    let clicks = 0;
    while (clicks < 10) {
      const btn =
        articleEl.querySelector('button[aria-label="Next"]') ||
        articleEl.querySelector('button[aria-label="Go to next slide"]') ||
        articleEl.querySelector('button._afxw');
      if (!btn) break;
      btn.click();
      clicks++;
      await new Promise((r) => setTimeout(r, 450));
    }

    const updated = parsePostElement(articleEl);
    showToast(`Scan complete: ${updated.images.length} images found.`);
    // Update banner photo badge
    const badge = articleEl.querySelector(".rtc-badge-photos");
    if (badge) badge.textContent = `📷 ${updated.images.length} photos`;
  }

  // 3. Grid View Overlay Badges
  function updateGridBadges() {
    const postLinks = document.querySelectorAll('a[href*="/p/"], a[href*="/reel/"]');
    postLinks.forEach((link) => {
      const postId = extractPostId(link.getAttribute("href"));
      if (!postId) return;

      // Ensure link container has relative positioning
      if (link.style.position !== "relative" && getComputedStyle(link).position === "static") {
        link.style.position = "relative";
      }

      let badge = link.querySelector(".rtc-grid-item-badge");
      const status = getPostStatus(postId);

      if (!badge) {
        badge = document.createElement("div");
        badge.className = `rtc-grid-item-badge ${status}`;
        badge.title = "Click to toggle collection for RetroTimeCo";
        badge.innerHTML = status === "queued" ? "✓ Queued" : status === "exported" ? "✓ Exported" : "+ RTC";
        link.appendChild(badge);

        badge.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleGridPostCollection(postId, link);
        });
      } else {
        badge.className = `rtc-grid-item-badge ${status}`;
        badge.innerHTML = status === "queued" ? "✓ Queued" : status === "exported" ? "✓ Exported" : "+ RTC";
      }
    });
  }

  async function toggleGridPostCollection(postId, linkEl) {
    const status = getPostStatus(postId);
    if (status === "queued") {
      chrome.runtime.sendMessage({ type: "REMOVE_POST", post_id: postId }, () => {
        showToast(`Removed #${postId} from queue.`);
        syncState();
      });
    } else {
      // Gather thumbnail preview data
      const img = linkEl.querySelector("img");
      const bestImg = getBestImageUrl(img);
      const post = {
        post_id: postId,
        url: `https://www.instagram.com/p/${postId}/`,
        caption: img?.alt || "",
        hashtags: extractHashtags(img?.alt || ""),
        posted_at: new Date().toISOString(),
        images: bestImg ? [bestImg] : [],
        image_count: bestImg ? 1 : 0,
        is_carousel: false,
        ...extractPriceAndStatus(img?.alt || ""),
      };

      chrome.runtime.sendMessage({ type: "ADD_POST", post }, (res) => {
        if (res && res.success) {
          showToast(`Added #${postId} to queue!`);
          syncState();
        }
      });
    }
  }

  // Bulk collect all visible posts on page
  async function collectVisibleGridPosts() {
    const postLinks = document.querySelectorAll('a[href*="/p/"], a[href*="/reel/"]');
    const posts = [];
    const seen = new Set();

    postLinks.forEach((link) => {
      const postId = extractPostId(link.getAttribute("href"));
      if (!postId || seen.has(postId)) return;
      seen.add(postId);

      if (getPostStatus(postId) === "uncollected") {
        const img = link.querySelector("img");
        const bestImg = getBestImageUrl(img);
        posts.push({
          post_id: postId,
          url: `https://www.instagram.com/p/${postId}/`,
          caption: img?.alt || "",
          hashtags: extractHashtags(img?.alt || ""),
          posted_at: new Date().toISOString(),
          images: bestImg ? [bestImg] : [],
          image_count: bestImg ? 1 : 0,
          is_carousel: false,
          ...extractPriceAndStatus(img?.alt || ""),
        });
      }
    });

    if (posts.length === 0) {
      showToast("No new uncollected posts visible on screen.");
      return;
    }

    chrome.runtime.sendMessage({ type: "ADD_POSTS_BULK", posts }, (res) => {
      if (res && res.success) {
        showToast(`Added ${res.added} posts to collection queue!`);
        syncState();
      }
    });
  }

  // Periodic DOM Observer to react to Instagram SPA navigation & modals
  const observer = new MutationObserver(() => {
    injectPostBanner();
    updateGridBadges();
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Handle messages from popup or sidepanel
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "CHECK_ACTIVE_POST") {
      const dialogOrArticle =
        document.querySelector('div[role="dialog"] article') ||
        document.querySelector("article");
      const post = parsePostElement(dialogOrArticle);
      sendResponse({ hasActivePost: Boolean(post), postId: post?.post_id || null });
      return true;
    }

    if (message.type === "COLLECT_CURRENT_OPEN_POST") {
      const dialogOrArticle =
        document.querySelector('div[role="dialog"] article') ||
        document.querySelector("article");
      const post = parsePostElement(dialogOrArticle);
      if (post) {
        chrome.runtime.sendMessage({ type: "ADD_POST", post }, (res) => {
          syncState();
          sendResponse(res);
        });
      } else {
        sendResponse({ success: false, error: "No post currently open on screen" });
      }
      return true;
    }

    if (message.type === "COLLECT_VISIBLE_POSTS") {
      collectVisibleGridPosts().then(() => sendResponse({ success: true }));
      return true;
    }
  });

  // Initial setup
  renderDock();
  syncState();
  injectPostBanner();
  updateGridBadges();
})();
