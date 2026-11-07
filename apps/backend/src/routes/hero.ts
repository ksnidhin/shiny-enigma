import { Router, Request, Response } from "express"
import fs from "fs/promises"
import path from "path"

const router = Router()
const dataPath = path.resolve(__dirname, "../../data/hero.json")

export interface HeroSlide {
  id: string
  imageUrl: string
  title: string
  subtitle: string
  linkText: string
  linkUrl: string
  categoryTag?: string
}

export const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    id: "vintage-archive-01",
    imageUrl: "/watch_seiko_vintage_1785170846705.jpg",
    categoryTag: "VINTAGE WATCHES",
    title: "REAL VINTAGE WATCHES.",
    subtitle: "Authentic mechanical watches, tested and ready for daily wear.",
    linkText: "EXPLORE VINTAGE ↗",
    linkUrl: "/collections/all"
  },
  {
    id: "swiss-japanese-02",
    imageUrl: "/watch_swiss_vintage_1785170866472.jpg",
    categoryTag: "SWISS & JAPANESE",
    title: "TIMELESS CLASSICS.",
    subtitle: "Hand-wound and automatic watches with original character and history.",
    linkText: "VIEW COLLECTION ↗",
    linkUrl: "/collections/swiss-vintage"
  },
  {
    id: "hmt-heritage-03",
    imageUrl: "/hmt_vintage_watch_1785257285844.jpg",
    categoryTag: "INDIAN HERITAGE",
    title: "AUTHENTIC HMT.",
    subtitle: "Classic hand-wound watches made in India. Serviced and running smoothly.",
    linkText: "BROWSE HMT ↗",
    linkUrl: "/collections/hmt-watches"
  },
  {
    id: "casio-classics-04",
    imageUrl: "/watch_casio_edifice_1785170834699.jpg",
    categoryTag: "CASIO RELEASES",
    title: "EVERYDAY RELIABILITY.",
    subtitle: "Original Casio digital and quartz watches. Simple, tough, and genuine.",
    linkText: "SHOP CASIO ↗",
    linkUrl: "/collections/casio"
  }
]

const getHeroData = async (): Promise<HeroSlide[]> => {
  try {
    const data = await fs.readFile(dataPath, "utf-8")
    const parsed = JSON.parse(data)
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed
    }
  } catch {}
  return DEFAULT_HERO_SLIDES
}

const saveHeroData = async (data: HeroSlide[]) => {
  await fs.mkdir(path.dirname(dataPath), { recursive: true })
  await fs.writeFile(dataPath, JSON.stringify(data, null, 2))
}

router.get("/hero", async (req, res) => {
  const data = await getHeroData()
  res.json({ success: true, data })
})

router.post("/hero", async (req, res) => {
  try {
    const { slides } = req.body
    await saveHeroData(slides)
    res.json({ success: true, data: slides })
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message })
  }
})

export { router as heroRouter }
