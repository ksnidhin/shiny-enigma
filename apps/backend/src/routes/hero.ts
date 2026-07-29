import { Router, Request, Response } from "express"
import fs from "fs/promises"
import path from "path"

const router = Router()
const dataPath = path.join(process.cwd(), "data", "hero.json")

interface HeroSlide {
  id: string
  imageUrl: string
  title: string
  subtitle: string
  linkText: string
  linkUrl: string
}

const getHeroData = async (): Promise<HeroSlide[]> => {
  try {
    const data = await fs.readFile(dataPath, "utf-8")
    return JSON.parse(data)
  } catch {
    return []
  }
}

const saveHeroData = async (data: HeroSlide[]) => {
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
