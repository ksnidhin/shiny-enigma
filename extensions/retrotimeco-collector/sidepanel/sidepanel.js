// RetroTimeCo Collector — Side Panel Dashboard Controller

(function () {
  "use strict";

  // State
  let queue = [];
  let history = [];
  let selectedIds = new Set();

  // Elements
  const tabQueueBtn = document.getElementById("tab-queue-btn");
  const tabHistoryBtn = document.getElementById("tab-history-btn");
  const viewQueue = document.getElementById("view-queue");
  const viewHistory = document.getElementById("view-history");
  const countQueueEl = document.getElementById("count-queue");
  const countHistoryEl = document.getElementById("count-history");
  const selectedSummaryEl = document.getElementById("selected-summary");
  const selectAllCheckbox = document.getElementById("select-all-checkbox");
  const btnExportZip = document.getElementById("btn-export-zip");
  const btnExportCount = document.getElementById("btn-export-count");
  const postsContainer = document.getElementById("posts-container");
  const emptyState = document.getElementById("empty-state");
  const historyContainer = document.getElementById("history-container");
  const emptyHistoryState = document.getElementById("empty-history-state");
  const btnClearQueue = document.getElementById("btn-clear-queue");
  const btnClearHistory = document.getElementById("btn-clear-history");
  const btnRefresh = document.getElementById("btn-refresh");
  const btnOpenInstagram = document.getElementById("btn-open-instagram");

  // Modal elements
  const exportModal = document.getElementById("export-modal");
  const progressStatusText = document.getElementById("progress-status-text");
  const progressBarFill = document.getElementById("progress-bar-fill");
  const progressCountText = document.getElementById("progress-count-text");
  const progressPercentText = document.getElementById("progress-percent-text");
  const progressLog = document.getElementById("progress-log");
  const modalActions = document.getElementById("modal-actions");
  const btnModalClose = document.getElementById("btn-modal-close");

  // Active bar elements
  const activeBarTag = document.getElementById("active-bar-tag");
  const activeBarTitle = document.getElementById("active-bar-title");
  const btnActiveCollectPost = document.getElementById("btn-active-collect-post");
  const btnActiveScanCarousel = document.getElementById("btn-active-scan-carousel");
  const btnActiveCollectAll = document.getElementById("btn-active-collect-all");
  const rtcTabStatus = document.getElementById("rtc-tab-status");

  let activeTabPost = null;

  // Query active tab and update collector bar
  async function pollActiveTab() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab || !tab.url || !tab.url.includes("instagram.com")) {
        if (rtcTabStatus) rtcTabStatus.textContent = "Waiting for Instagram";
        if (activeBarTag) activeBarTag.textContent = "Instagram Tab";
        if (activeBarTitle) activeBarTitle.textContent = "Open an Instagram tab to collect posts";
        if (btnActiveCollectPost) btnActiveCollectPost.style.display = "none";
        if (btnActiveScanCarousel) btnActiveScanCarousel.style.display = "none";
        if (btnActiveCollectAll) btnActiveCollectAll.style.display = "none";
        return;
      }

      if (rtcTabStatus) rtcTabStatus.textContent = "Instagram Active";

      chrome.tabs.sendMessage(tab.id, { type: "GET_ACTIVE_POST_DATA" }, (res) => {
        if (chrome.runtime.lastError || !res) {
          if (activeBarTitle) activeBarTitle.textContent = "Browsing Instagram...";
          return;
        }

        if (res.currentPost) {
          activeTabPost = res.currentPost;
          const inQueue = queue.some((p) => p.post_id === res.currentPost.post_id);
          const price = res.currentPost.detected_price ? ` (₹${res.currentPost.detected_price.toLocaleString("en-IN")})` : "";
          
          if (activeBarTag) activeBarTag.textContent = "Current Watch Post";
          if (activeBarTitle) activeBarTitle.textContent = `#${res.currentPost.post_id}${price} — ${res.currentPost.image_count} photos`;
          
          if (btnActiveCollectPost) {
            btnActiveCollectPost.style.display = "inline-flex";
            btnActiveCollectPost.textContent = inQueue ? "✓ In Queue" : "+ Add Watch";
            btnActiveCollectPost.disabled = inQueue;
          }

          if (btnActiveScanCarousel) {
            btnActiveScanCarousel.style.display = res.currentPost.is_carousel ? "inline-flex" : "none";
          }

          if (btnActiveCollectAll) btnActiveCollectAll.style.display = "none";
        } else {
          activeTabPost = null;
          if (activeBarTag) activeBarTag.textContent = "Instagram Feed / Grid";
          if (activeBarTitle) activeBarTitle.textContent = `${res.visibleCount || 0} watches visible (${res.uncollectedCount || 0} new)`;

          if (btnActiveCollectPost) btnActiveCollectPost.style.display = "none";
          if (btnActiveScanCarousel) btnActiveScanCarousel.style.display = "none";

          if (btnActiveCollectAll) {
            btnActiveCollectAll.style.display = "inline-flex";
            btnActiveCollectAll.textContent = `+ Collect Visible (${res.uncollectedCount || 0})`;
            btnActiveCollectAll.disabled = (res.uncollectedCount || 0) === 0;
          }
        }
      });
    } catch {}
  }

  // Active bar click actions
  btnActiveCollectPost?.addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) return;
    chrome.tabs.sendMessage(tab.id, { type: "COLLECT_CURRENT_OPEN_POST" }, async (res) => {
      await loadState();
      pollActiveTab();
    });
  });

  btnActiveScanCarousel?.addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) return;
    btnActiveScanCarousel.textContent = "Scanning...";
    btnActiveScanCarousel.disabled = true;
    chrome.tabs.sendMessage(tab.id, { type: "SCAN_CAROUSEL" }, async () => {
      btnActiveScanCarousel.textContent = "Scan Carousel";
      btnActiveScanCarousel.disabled = false;
      pollActiveTab();
    });
  });

  btnActiveCollectAll?.addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) return;
    chrome.tabs.sendMessage(tab.id, { type: "COLLECT_VISIBLE_POSTS" }, async (res) => {
      await loadState();
      pollActiveTab();
    });
  });

  // Load state from chrome.storage
  async function loadState() {
    const data = await chrome.storage.local.get(["queue", "history"]);
    queue = data.queue || [];
    history = data.history || [];

    // Initialize selection: default select all currently queued
    if (selectedIds.size === 0 && queue.length > 0) {
      queue.forEach((p) => selectedIds.add(p.post_id));
    } else {
      // Remove any IDs no longer in queue
      const queueIds = new Set(queue.map((p) => p.post_id));
      selectedIds.forEach((id) => {
        if (!queueIds.has(id)) selectedIds.delete(id);
      });
    }

    renderAll();
  }

  // Render everything
  function renderAll() {
    countQueueEl.textContent = String(queue.length);
    countHistoryEl.textContent = String(history.length);
    btnExportCount.textContent = String(selectedIds.size);
    selectedSummaryEl.textContent = `${selectedIds.size} of ${queue.length} selected`;

    selectAllCheckbox.checked = queue.length > 0 && selectedIds.size === queue.length;
    selectAllCheckbox.indeterminate = selectedIds.size > 0 && selectedIds.size < queue.length;

    btnExportZip.disabled = selectedIds.size === 0;

    renderQueueList();
    renderHistoryList();
  }

  // Render Queue Cards
  function renderQueueList() {
    postsContainer.innerHTML = "";
    if (queue.length === 0) {
      emptyState.style.display = "flex";
      postsContainer.style.display = "none";
      return;
    }

    emptyState.style.display = "none";
    postsContainer.style.display = "flex";

    queue.forEach((post) => {
      const card = document.createElement("div");
      card.className = "rtc-post-card";
      card.dataset.postId = post.post_id;

      const isChecked = selectedIds.has(post.post_id);
      const thumbUrl = post.images && post.images.length > 0 ? post.images[0] : "";
      const priceText = post.detected_price ? `₹${post.detected_price.toLocaleString("en-IN")}` : "";
      const dateText = post.posted_at ? new Date(post.posted_at).toLocaleDateString() : "";

      card.innerHTML = `
        <div class="rtc-card-checkbox">
          <input type="checkbox" class="post-checkbox" ${isChecked ? "checked" : ""}>
        </div>
        ${thumbUrl ? `<img src="${thumbUrl}" class="rtc-card-thumb" alt="Post thumbnail" onerror="this.style.display='none'">` : '<div class="rtc-card-thumb"></div>'}
        <div class="rtc-card-content">
          <div>
            <div class="rtc-card-header">
              <a href="${post.url}" target="_blank" class="rtc-card-id">#${post.post_id} ↗</a>
              <span class="rtc-card-date">${dateText}</span>
            </div>
            <p class="rtc-card-caption">${post.caption || "No caption available."}</p>
          </div>
          <div class="rtc-card-footer">
            <div class="rtc-card-badges">
              ${priceText ? `<span class="rtc-badge-mini rtc-badge-mini-price">${priceText}</span>` : ""}
              ${post.is_sold ? '<span class="rtc-badge-mini" style="background:#8C1D1D; color:#FFF;">SOLD</span>' : ""}
              <span class="rtc-badge-mini rtc-badge-mini-photos">📷 ${post.images?.length || 0}</span>
            </div>
            <button class="rtc-card-remove-btn" title="Remove from queue">✕</button>
          </div>
        </div>
      `;

      // Checkbox event
      const cb = card.querySelector(".post-checkbox");
      cb.addEventListener("change", (e) => {
        if (e.target.checked) {
          selectedIds.add(post.post_id);
        } else {
          selectedIds.delete(post.post_id);
        }
        renderAll();
      });

      // Remove single card event
      card.querySelector(".rtc-card-remove-btn").addEventListener("click", async () => {
        await chrome.runtime.sendMessage({ type: "REMOVE_POST", post_id: post.post_id });
        selectedIds.delete(post.post_id);
        await loadState();
      });

      postsContainer.appendChild(card);
    });
  }

  // Render History List
  function renderHistoryList() {
    historyContainer.innerHTML = "";
    if (history.length === 0) {
      emptyHistoryState.style.display = "flex";
      historyContainer.style.display = "none";
      return;
    }

    emptyHistoryState.style.display = "none";
    historyContainer.style.display = "flex";

    history.forEach((item) => {
      const postId = typeof item === "string" ? item : item.post_id;
      const date = item.exported_at ? new Date(item.exported_at).toLocaleString() : "Previously exported";

      const card = document.createElement("div");
      card.className = "rtc-post-card";
      card.innerHTML = `
        <div class="rtc-card-content">
          <div class="rtc-card-header">
            <a href="https://www.instagram.com/p/${postId}/" target="_blank" class="rtc-card-id">#${postId} ↗</a>
            <span class="rtc-card-date">${date}</span>
          </div>
          <p class="rtc-card-caption" style="color:#8E9BA8;">Exported to ZIP package.</p>
        </div>
      `;
      historyContainer.appendChild(card);
    });
  }

  // Log message to modal progress log
  function logProgress(msg) {
    const div = document.createElement("div");
    div.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
    progressLog.appendChild(div);
    progressLog.scrollTop = progressLog.scrollHeight;
  }

  // Image fetcher with exponential backoff retry mechanism
  async function fetchImageWithRetry(url, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const res = await fetch(url, { mode: "cors" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const blob = await res.blob();
        return blob;
      } catch (err) {
        if (attempt === maxRetries) {
          throw new Error(`Failed to download image after ${maxRetries} attempts: ${err.message}`);
        }
        await new Promise((r) => setTimeout(r, 800 * attempt));
      }
    }
  }

  // ZIP Exporter Engine
  async function exportSelectedZip() {
    const selectedPosts = queue.filter((p) => selectedIds.has(p.post_id));
    if (selectedPosts.length === 0) return;

    if (typeof JSZip === "undefined") {
      alert("Error: JSZip library not loaded.");
      return;
    }

    // Open Modal
    exportModal.style.display = "flex";
    modalActions.style.display = "none";
    progressLog.innerHTML = "";
    progressBarFill.style.width = "0%";
    progressPercentText.textContent = "0%";
    progressCountText.textContent = `0 of ${selectedPosts.length} posts`;
    progressStatusText.textContent = "Initializing ZIP package...";

    logProgress(`Starting export of ${selectedPosts.length} selected posts...`);

    const zip = new JSZip();
    const imagesFolder = zip.folder("images");
    const exportData = [];
    const manifestSummary = [];

    let totalImages = 0;
    let completedImages = 0;
    const postImageCounts = selectedPosts.map((p) => (p.images ? p.images.length : 0));
    const grandTotalImages = postImageCounts.reduce((a, b) => a + b, 0);

    for (let pIdx = 0; pIdx < selectedPosts.length; pIdx++) {
      const post = selectedPosts[pIdx];
      const folderNum = String(pIdx + 1).padStart(3, "0");
      const postFolderName = `post_${folderNum}`;
      const postFolder = imagesFolder.folder(postFolderName);

      progressStatusText.textContent = `Processing Post ${pIdx + 1} of ${selectedPosts.length} (#${post.post_id})...`;
      progressCountText.textContent = `Post ${pIdx + 1} of ${selectedPosts.length}`;
      logProgress(`Entering ${postFolderName}/ (#${post.post_id})...`);

      const postImagesMeta = [];

      if (Array.isArray(post.images) && post.images.length > 0) {
        for (let imgIdx = 0; imgIdx < post.images.length; imgIdx++) {
          const imgUrl = post.images[imgIdx];
          const imgNum = String(imgIdx + 1).padStart(2, "0");
          const filename = `${imgNum}.jpg`;

          try {
            logProgress(`  → Fetching ${postFolderName}/${filename}...`);
            const blob = await fetchImageWithRetry(imgUrl);
            postFolder.file(filename, blob);
            completedImages++;
            totalImages++;

            postImagesMeta.push({
              filename,
              source_url: imgUrl,
            });

            // Update percentage
            const pct = Math.round((completedImages / Math.max(1, grandTotalImages)) * 85);
            progressBarFill.style.width = `${pct}%`;
            progressPercentText.textContent = `${pct}%`;
          } catch (imgErr) {
            logProgress(`  ⚠️ Warning: Could not download ${filename} (${imgErr.message})`);
            postImagesMeta.push({
              filename,
              source_url: imgUrl,
              error: imgErr.message,
            });
          }
        }
      }

      // Add to export.json structure
      exportData.push({
        folder_name: postFolderName,
        post_id: post.post_id,
        url: post.url,
        caption: post.caption,
        hashtags: post.hashtags || [],
        posted_at: post.posted_at,
        detected_price: post.detected_price || null,
        currency: post.detected_price ? "INR" : null,
        is_sold: post.is_sold || false,
        image_count: postImagesMeta.length,
        images: postImagesMeta,
      });

      manifestSummary.push({
        folder: postFolderName,
        post_id: post.post_id,
        price: post.detected_price || null,
        images_collected: postImagesMeta.length,
      });
    }

    // Generate manifest.json
    const manifestData = {
      collector_version: "1.0.0",
      export_timestamp: new Date().toISOString(),
      source_account: "retrotimeco.in",
      total_posts: exportData.length,
      total_images: totalImages,
      posts: manifestSummary,
    };

    // Add JSON files to ZIP root
    zip.file("export.json", JSON.stringify(exportData, null, 2));
    zip.file("manifest.json", JSON.stringify(manifestData, null, 2));

    progressStatusText.textContent = "Compressing files into retrotimeco-export.zip...";
    logProgress("Generating compressed ZIP package...");

    // Generate ZIP blob
    const zipBlob = await zip.generateAsync(
      {
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: { level: 6 },
      },
      (metadata) => {
        const pct = 85 + Math.round(metadata.percent * 0.15);
        progressBarFill.style.width = `${pct}%`;
        progressPercentText.textContent = `${pct}%`;
      }
    );

    logProgress(`Compression complete! Size: ${(zipBlob.size / (1024 * 1024)).toFixed(2)} MB`);
    progressStatusText.textContent = "Download starting...";

    // Trigger download
    const dateStamp = new Date().toISOString().slice(0, 10);
    const downloadFilename = `retrotimeco-export-${dateStamp}.zip`;
    const blobUrl = URL.createObjectURL(zipBlob);

    if (chrome.downloads?.download) {
      chrome.downloads.download({
        url: blobUrl,
        filename: downloadFilename,
        saveAs: true,
      });
    } else {
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = downloadFilename;
      document.body.appendChild(a);
      a.click();
      a.remove();
    }

    // Mark exported in storage
    const exportedIds = selectedPosts.map((p) => p.post_id);
    await chrome.runtime.sendMessage({
      type: "MARK_EXPORTED",
      post_ids: exportedIds,
    });

    logProgress(`Successfully exported ${selectedPosts.length} posts to ${downloadFilename}!`);
    progressBarFill.style.width = "100%";
    progressPercentText.textContent = "100%";
    progressStatusText.textContent = "Export Complete! File saved to your downloads.";
    modalActions.style.display = "flex";

    await loadState();
  }

  // Tab switching
  tabQueueBtn.addEventListener("click", () => {
    tabQueueBtn.classList.add("active");
    tabHistoryBtn.classList.remove("active");
    viewQueue.classList.add("active");
    viewHistory.classList.remove("active");
  });

  tabHistoryBtn.addEventListener("click", () => {
    tabHistoryBtn.classList.add("active");
    tabQueueBtn.classList.remove("active");
    viewHistory.classList.add("active");
    viewQueue.classList.remove("active");
  });

  // Select all checkbox
  selectAllCheckbox.addEventListener("change", (e) => {
    if (e.target.checked) {
      queue.forEach((p) => selectedIds.add(p.post_id));
    } else {
      selectedIds.clear();
    }
    renderAll();
  });

  // Export button
  btnExportZip.addEventListener("click", () => {
    exportSelectedZip();
  });

  // Clear queue
  btnClearQueue.addEventListener("click", async () => {
    if (confirm("Are you sure you want to clear the entire collection queue?")) {
      await chrome.runtime.sendMessage({ type: "CLEAR_QUEUE" });
      selectedIds.clear();
      await loadState();
    }
  });

  // Clear history
  btnClearHistory.addEventListener("click", async () => {
    if (confirm("Clear previously exported post history?")) {
      await chrome.storage.local.set({ history: [] });
      await loadState();
    }
  });

  // Refresh
  btnRefresh.addEventListener("click", () => {
    loadState();
  });

  // Open Instagram button
  btnOpenInstagram?.addEventListener("click", () => {
    chrome.tabs.create({ url: "https://www.instagram.com/retrotimeco.in/" });
  });

  // Close modal
  btnModalClose.addEventListener("click", () => {
    exportModal.style.display = "none";
  });

  // Listen to external storage updates
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local") {
      loadState();
    }
  });

  // Initial load
  loadState();
  pollActiveTab();
  setInterval(pollActiveTab, 1500);

  // Tab change listener
  chrome.tabs.onActivated?.addListener(() => {
    pollActiveTab();
  });
})();
