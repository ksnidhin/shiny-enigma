import { Router, Request, Response } from "express"
import { WatchStorage, WatchProduct } from "../db/storage"
import multer from "multer"


const upload = multer({ storage: multer.memoryStorage() })

const router = Router()

// GET /api/watches — Filtered & Sorted Catalog
router.get("/watches", async (req: Request, res: Response): Promise<void> => {
  try {
    const { collection, brand, condition, min_price, max_price, sort, search, in_stock, featured, page, limit } = req.query as Record<string, string | undefined>
    let all = await WatchStorage.getAll()

    if (collection && collection !== "all") {
      all = all.filter(w => w.collection.toLowerCase() === collection.toLowerCase())
    }
    if (brand && brand !== "all") {
      all = all.filter(w => w.brand.toLowerCase() === brand.toLowerCase())
    }
    if (condition && condition !== "all") {
      all = all.filter(w => w.condition_grade.toLowerCase() === condition.toLowerCase())
    }
    if (min_price) {
      const min = parseFloat(min_price)
      if (!isNaN(min)) all = all.filter(w => w.price >= min)
    }
    if (max_price) {
      const max = parseFloat(max_price)
      if (!isNaN(max)) all = all.filter(w => w.price <= max)
    }
    if (in_stock === "true") {
      all = all.filter(w => w.in_stock)
    }
    if (featured === "true") {
      all = all.filter(w => w.featured)
    }
    if (search && search.trim() !== "") {
      const term = search.toLowerCase().trim()
      all = all.filter(w =>
        w.name.toLowerCase().includes(term) ||
        w.brand.toLowerCase().includes(term) ||
        w.model_name.toLowerCase().includes(term) ||
        w.reference_number.toLowerCase().includes(term) ||
        w.description.toLowerCase().includes(term)
      )
    }

    if (sort) {
      if (sort === "price_asc") all.sort((a, b) => a.price - b.price)
      else if (sort === "price_desc") all.sort((a, b) => b.price - a.price)
      else if (sort === "newest") all.sort((a, b) => b.id.localeCompare(a.id))
      else if (sort === "featured" || sort === "popular") all.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.rating - a.rating)
    }

    const allWatches = await WatchStorage.getAll()
    const available_brands = Array.from(new Set(allWatches.map(w => w.brand))).sort()
    const available_collections = Array.from(new Set(allWatches.map(w => w.collection)))

    const pageNum = parseInt(page || "1", 10) || 1
    const limitNum = parseInt(limit || "50", 10) || 50
    const start = (pageNum - 1) * limitNum
    const paginated = all.slice(start, start + limitNum)

    res.status(200).json({
      success: true,
      count: paginated.length,
      total: all.length,
      available_brands,
      available_collections,
      data: paginated,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" })
  }
})

// GET /api/stats — Admin Analytics
router.get("/stats", async (_req: Request, res: Response): Promise<void> => {
  try {
    const all = await WatchStorage.getAll()
    const total_value = all.reduce((acc, w) => acc + (w.in_stock ? w.price : 0), 0)
    const in_stock_count = all.filter(w => w.in_stock).length
    const brands_count = new Set(all.map(w => w.brand)).size
    const collections_count = new Set(all.map(w => w.collection)).size
    
    const collection_breakdown: Record<string, number> = {}
    all.forEach(w => {
      if (w.in_stock) {
        collection_breakdown[w.collection] = (collection_breakdown[w.collection] || 0) + 1
      }
    })

    res.status(200).json({
      success: true,
      data: {
        total_timepieces: all.length,
        in_stock_count,
        total_inventory_value_rs: total_value,
        brands_count,
        collections_count,
        collection_breakdown,
      }
    })
  } catch {
    res.status(500).json({ success: false, message: "Failed to load stats" })
  }
})

const getId = (param: string | string[] | undefined): string => Array.isArray(param) ? param[0] || "" : param || ""

// GET /api/watches/:id — Single Watch details
router.get("/watches/:id", async (req: Request, res: Response): Promise<void> => {
  const idStr = getId(req.params.id)
  const watch = await WatchStorage.getByIdOrSlug(idStr)
  if (!watch) {
    res.status(404).json({ success: false, message: "Timepiece not found" })
    return
  }

  const allWatches = await WatchStorage.getAll()
  const related = allWatches
    .filter(w => w.collection === watch.collection && w.id !== watch.id)
    .slice(0, 4)

  res.status(200).json({ success: true, data: watch, related })
})

// POST /api/watches — Create new watch listing
router.post("/watches", async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body as Partial<WatchProduct>
    if (!body.name || !body.brand || !body.price || !body.collection) {
      res.status(400).json({ success: false, message: "Name, brand, price, and collection are required fields" })
      return
    }

    const created = await WatchStorage.create(body as any)
    res.status(201).json({ success: true, message: "Timepiece added successfully", data: created })
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to create timepiece" })
  }
})

// PUT /api/watches/:id — Update watch details
router.put("/watches/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const idStr = getId(req.params.id)
    const updated = await WatchStorage.update(idStr, req.body)
    if (!updated) {
      res.status(404).json({ success: false, message: "Timepiece not found for update" })
      return
    }
    res.status(200).json({ success: true, message: "Timepiece updated successfully", data: updated })
  } catch {
    res.status(500).json({ success: false, message: "Failed to update timepiece" })
  }
})

// DELETE /api/watches/:id — Delete watch listing
router.delete("/watches/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const idStr = getId(req.params.id)
    const deleted = await WatchStorage.delete(idStr)
    if (!deleted) {
      res.status(404).json({ success: false, message: "Timepiece not found for deletion" })
      return
    }
    res.status(200).json({ success: true, message: "Timepiece deleted permanently" })
  } catch {
    res.status(500).json({ success: false, message: "Failed to delete timepiece" })
  }
})

import fs from "fs"
import path from "path"

// POST /api/upload — Upload image to local disk with compression
router.post("/upload", upload.single("image"), async (req: Request, res: Response): Promise<void> => {
  try {
    const file = req.file
    if (!file) {
      res.status(400).json({ success: false, message: "No image file provided" })
      return
    }

    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.webp`
    const uploadDir = path.join(__dirname, "../../../storefront/public/uploads")
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    const filePath = path.join(uploadDir, fileName)

    try {
      // Try to compress with sharp
      const sharp = require("sharp")
      await sharp(file.buffer)
        .resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(filePath)
    } catch (sharpErr) {
      // Fallback if sharp fails to install/run
      console.warn("Sharp compression failed, falling back to original file:", sharpErr)
      fs.writeFileSync(filePath, file.buffer)
    }

    // Return the local URL
    res.status(200).json({ success: true, url: `/uploads/${fileName}` })
  } catch (err) {
    console.error("Upload error:", err)
    res.status(500).json({ success: false, message: "Server error during upload" })
  }
})

// POST /api/watches/ai-generate — Gemini auto-fill
router.post("/watches/ai-generate", async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, year } = req.body
    if (!name) {
      res.status(400).json({ success: false, message: "Watch name is required" })
      return
    }

    const prompt = `You are a master horologist. Generate a detailed watch specification for "${name}" (circa ${year || "unknown"}).
Return ONLY a valid JSON object matching this exact structure:
{
  "brand": "string",
  "model_name": "string",
  "reference_number": "string",
  "era_label": "e.g., 1960s Golden Era",
  "collection": "casio or japanese-vintage or swiss-vintage or s23-tank or straps-accessories or hmt-watches",
  "collection_title": "string",
  "description": "A compelling 2-3 sentence marketing description for a vintage watch collector.",
  "specs": {
    "movement_caliber": "string",
    "case_material": "string",
    "case_size_mm": number,
    "lug_width_mm": number,
    "crystal_type": "sapphire or mineral or acrylic",
    "measured_accuracy_sec_per_day": "e.g., +/- 10",
    "strap_original": boolean,
    "water_resistance": "string"
  }
}
Do not include markdown blocks, just the raw JSON.`

    const apiKey = process.env.OPENROUTER_API_KEY
    const models = [
      "openrouter/free",
      "qwen/qwen3-30b-a3b:free",
      "google/gemma-3-27b-it:free",
      "meta-llama/llama-3.3-70b-instruct:free"
    ]
    
    let lastError = null
    let parsedData = null

    for (const model of models) {
      if (parsedData) break;
      
      let retries = 3
      while (retries > 0) {
        try {
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 15000) // 15s timeout
          
          const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${apiKey}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              model,
              messages: [{ role: "user", content: prompt }],
              response_format: { type: "json_object" }
            }),
            signal: controller.signal
          })
          
          clearTimeout(timeoutId)
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${await response.text()}`)
          }
          
          const data = (await response.json()) as any
          const text = data.choices?.[0]?.message?.content
          if (!text) throw new Error("Empty response from OpenRouter")
          
          // Clean markdown blocks
          const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim()
          parsedData = JSON.parse(cleanedText)
          break; // success, break retry loop
        } catch (err: any) {
          lastError = err
          retries--
          if (retries === 0) {
            console.warn(`Model ${model} failed after 3 attempts.`)
          } else {
            await new Promise(r => setTimeout(r, 1000)) // 1s wait before retry
          }
        }
      }
    }

    if (!parsedData) {
      throw new Error(`All models failed. Last error: ${lastError?.message || lastError}`)
    }
    
    res.status(200).json({ success: true, data: parsedData })
  } catch (err: any) {
    console.error("AI Generation Error:", err?.message || err)
    res.status(500).json({ success: false, message: err?.message || "Failed to generate details" })
  }
})

// POST /api/watches/bulk - Bulk CSV import
router.post("/watches/bulk", async (req: Request, res: Response): Promise<void> => {
  try {
    const { watches } = req.body
    if (!watches || !Array.isArray(watches)) {
      res.status(400).json({ success: false, message: "Invalid payload, expected array of watches" })
      return
    }

    const currentWatches = await WatchStorage.getAll()
    const newWatches = watches.map(w => {
      const slug = w.slug || w.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || `watch-${Date.now()}`
      return {
        ...w,
        id: w.id || `rtc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        slug,
        gallery_images: w.gallery_images?.length ? w.gallery_images : (w.image ? [w.image] : []),
        in_stock: w.in_stock ?? true,
        featured: w.featured ?? false,
        rating: w.rating || 5.0,
        reviews_count: w.reviews_count || 1,
        authenticity_guarantee: w.authenticity_guarantee ?? true,
      }
    }) as WatchProduct[]
    await WatchStorage.saveAll([...currentWatches, ...newWatches])

    res.status(200).json({ success: true, message: `Successfully imported ${watches.length} timepieces` })
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error during bulk import" })
  }
})

export default router
