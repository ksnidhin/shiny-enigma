import { Router, Request, Response } from "express"
import fs from "fs"
import path from "path"

const router = Router()
const DATA_FILE = path.join(__dirname, "../../data/collections.json")

const DEFAULT_COLLECTIONS = [
  {
    id: "casio",
    title: "Casio Watches",
    subtitle: "New & Retro Models",
    image: "/watch_casio_edifice_1785170834699.jpg",
    href: "/collections/casio",
    badge: "Official & Authenticated"
  },
  {
    id: "japanese-vintage",
    title: "Japanese Vintage",
    subtitle: "Seiko, Citizen & Orient",
    image: "/watch_seiko_vintage_1785170846705.jpg",
    href: "/collections/japanese-vintage",
    badge: "Rare Finds"
  },
  {
    id: "swiss-vintage",
    title: "Swiss Vintage",
    subtitle: "Maison Horlogère",
    image: "/watch_swiss_vintage_1785170866472.jpg",
    href: "/collections/swiss-vintage",
    badge: "Collector Grade"
  },
  {
    id: "hmt-watches",
    title: "HMT Watches",
    subtitle: "Heritage Indian Timepieces",
    image: "/hmt_vintage_watch_1785257285844.jpg",
    href: "/collections/hmt-watches",
    badge: "Bestseller"
  },
  {
    id: "straps-accessories",
    title: "Straps & Clasps",
    subtitle: "Premium Leather & NATO",
    image: "/watch_accessories_1785170889478.jpg",
    href: "/collections/straps-accessories",
    badge: "From Rs. 349"
  },
  {
    id: "storage",
    title: "Watch Boxes & Storage",
    subtitle: "Solid Wood & Travel Cases",
    image: "/watch_accessories_1785170889478.jpg",
    href: "/collections/storage",
    badge: "Coming Soon"
  }
]

router.get("/collections", (req: Request, res: Response) => {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      res.json({ success: true, data: DEFAULT_COLLECTIONS })
      return
    }
    const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"))
    res.json({ success: true, data })
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to read collections data" })
  }
})

router.post("/collections", (req: Request, res: Response) => {
  try {
    const { collections } = req.body
    fs.writeFileSync(DATA_FILE, JSON.stringify(collections, null, 2))
    res.json({ success: true, message: "Collections saved successfully" })
  } catch (err) {
    console.error("Collections save error:", err);
    res.status(500).json({ success: false, message: "Failed to save collections data" })
  }
})

export default router
