import { Router, Request, Response } from "express"
import { WatchStorage, WatchProduct } from "../db/storage"

const router = Router()

// GET /api/watches — Filtered & Sorted Catalog
router.get("/watches", (req: Request, res: Response): void => {
  try {
    const { collection, brand, condition, min_price, max_price, sort, search, in_stock, featured, page, limit } = req.query as Record<string, string | undefined>
    let all = WatchStorage.getAll()

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

    const available_brands = Array.from(new Set(WatchStorage.getAll().map(w => w.brand))).sort()
    const available_collections = Array.from(new Set(WatchStorage.getAll().map(w => w.collection)))

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
router.get("/stats", (_req: Request, res: Response): void => {
  try {
    const all = WatchStorage.getAll()
    const total_value = all.reduce((acc, w) => acc + (w.in_stock ? w.price : 0), 0)
    const in_stock_count = all.filter(w => w.in_stock).length
    const brands_count = new Set(all.map(w => w.brand)).size
    const collections_count = new Set(all.map(w => w.collection)).size

    res.status(200).json({
      success: true,
      data: {
        total_timepieces: all.length,
        in_stock_count,
        total_inventory_value_rs: total_value,
        brands_count,
        collections_count,
      }
    })
  } catch {
    res.status(500).json({ success: false, message: "Failed to load stats" })
  }
})

const getId = (param: string | string[] | undefined): string => Array.isArray(param) ? param[0] || "" : param || ""

// GET /api/watches/:id — Single Watch details
router.get("/watches/:id", (req: Request, res: Response): void => {
  const idStr = getId(req.params.id)
  const watch = WatchStorage.getByIdOrSlug(idStr)
  if (!watch) {
    res.status(404).json({ success: false, message: "Timepiece not found" })
    return
  }

  const related = WatchStorage.getAll()
    .filter(w => w.collection === watch.collection && w.id !== watch.id)
    .slice(0, 4)

  res.status(200).json({ success: true, data: watch, related })
})

// POST /api/watches — Create new watch listing
router.post("/watches", (req: Request, res: Response): void => {
  try {
    const body = req.body as Partial<WatchProduct>
    if (!body.name || !body.brand || !body.price || !body.collection) {
      res.status(400).json({ success: false, message: "Name, brand, price, and collection are required fields" })
      return
    }

    const created = WatchStorage.create(body as any)
    res.status(201).json({ success: true, message: "Timepiece added successfully", data: created })
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to create timepiece" })
  }
})

// PUT /api/watches/:id — Update watch details
router.put("/watches/:id", (req: Request, res: Response): void => {
  try {
    const idStr = getId(req.params.id)
    const updated = WatchStorage.update(idStr, req.body)
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
router.delete("/watches/:id", (req: Request, res: Response): void => {
  try {
    const idStr = getId(req.params.id)
    const deleted = WatchStorage.delete(idStr)
    if (!deleted) {
      res.status(404).json({ success: false, message: "Timepiece not found for deletion" })
      return
    }
    res.status(200).json({ success: true, message: "Timepiece deleted permanently" })
  } catch {
    res.status(500).json({ success: false, message: "Failed to delete timepiece" })
  }
})

export default router
