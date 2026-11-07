# RetroTimeCo Collector (Chrome Extension)

A lightweight, authorized Chrome extension built to collect and export vintage watch posts, carousel photographs, captions, and pricing directly from your Instagram account (`@retrotimeco.in`) into a structured ZIP package for catalog migration.

---

## Features

- **Authorized In-Session Data Access**: Operates seamlessly within your active, authenticated Chrome Instagram session. Never requires passwords, API tokens, or undocumented private endpoints.
- **Full Carousel Preservation**: Extracts all high-resolution carousel photographs in their original order (`01.jpg`, `02.jpg`, etc.).
- **Smart Price & Status Detection**: Automatically detects Indian Rupee pricing (e.g. `₹4,500`, `Rs. 4,500`, `4500/-`) and `SOLD` / `RESERVED` statuses directly from your post captions.
- **Duplicate Prevention & History**: Remembers previously exported posts in local storage so you never duplicate work or export the same timepiece twice.
- **Side Panel Dashboard**: View your collection queue, inspect thumbnails and photo counts, select all or specific posts, and monitor export progress with real-time download status.
- **Fail-Safe Retries**: Automatically retries any image download hiccups with exponential backoff before packaging.
- **100% Local & Private**: All data processing and ZIP compression happen directly on your machine. Nothing is transmitted to external servers.

---

## Installation (Takes 30 seconds)

1. Open Google Chrome.
2. In the URL bar, go to:
   ```text
   chrome://extensions/
   ```
3. Enable **Developer mode** using the toggle in the top-right corner.
4. Click the **Load unpacked** button in the top-left corner.
5. Select this extension directory:
   ```text
   C:\Users\PC\.gemini\antigravity\scratch\rtc\extensions\retrotimeco-collector
   ```
6. The **RetroTimeCo Collector** icon (vintage watch dial) will appear in your Chrome toolbar. Pin it for quick access!

---

## How to Use

### 1. Open Instagram
- Navigate to [https://www.instagram.com/retrotimeco.in/](https://www.instagram.com/retrotimeco.in/) in Chrome.

### 2. Collect Posts
You can collect posts in three convenient ways:
- **From Profile Grid**: Each watch thumbnail displays a `[+ RTC]` badge in the top-right corner. Click it to toggle the post into your collection queue.
- **From Floating Dock**: A discreet RetroTimeCo dock sits in the bottom-right corner of Instagram. Click **`+ Collect Visible`** to queue all visible watches on screen at once.
- **Inside Opened Posts / Modals**: When viewing any watch post, an archive toolbar appears with detected prices, photo count, and a **`[+ Collect Post]`** button. For carousel posts with multiple angles, click **`[Scan Carousel]`** to ensure every angle is captured.

### 3. Open the Dashboard & Export
1. Click **`Dashboard ↗`** in the floating dock or open the extension from your Chrome toolbar.
2. The Side Panel will open displaying all queued timepieces with previews, captions, and detected prices.
3. Choose **Select All** or check individual posts you wish to export.
4. Click **`EXPORT RETROTIMECO-EXPORT.ZIP`**.
5. Watch the real-time progress bar as it downloads the original photos and builds the archive.
6. The ZIP file will be automatically saved to your Downloads folder!

---

## Exported ZIP Format

```text
retrotimeco-export.zip
│
├── export.json
├── manifest.json
│
└── images/
    ├── post_001/
    │   ├── 01.jpg
    │   └── 02.jpg
    ├── post_002/
    │   ├── 01.jpg
    │   └── 02.jpg
    └── post_003/
        └── 01.jpg
```

### Structured Data (`export.json` sample):
```json
[
  {
    "folder_name": "post_001",
    "post_id": "C_xyz123",
    "url": "https://www.instagram.com/p/C_xyz123/",
    "caption": "Vintage Seiko 5 Automatic 1970s champagne dial. Serviced and running accurately. Price: ₹4,500. DM or WhatsApp to purchase.",
    "hashtags": ["seiko", "vintageseiko", "seiko5", "horology"],
    "posted_at": "2024-05-12T10:30:00.000Z",
    "detected_price": 4500,
    "currency": "INR",
    "is_sold": false,
    "image_count": 2,
    "images": [
      {
        "filename": "01.jpg",
        "source_url": "https://scontent..."
      },
      {
        "filename": "02.jpg",
        "source_url": "https://scontent..."
      }
    ]
  }
]
```

---

## Next Step: AI Catalog Ingestion

Once you have exported the ZIP file:
1. Provide the ZIP or let Antigravity access it.
2. Antigravity will extract the photos, parse model calibers and conditions, detect existing duplicates, format high-resolution product photography, and create ready-to-publish drafts in your RetroTimeCo admin panel!
