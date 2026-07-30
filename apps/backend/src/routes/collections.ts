import { Router, Request, Response } from "express"
import fs from "fs"
import path from "path"

const router = Router()
const DATA_FILE = path.join(__dirname, "../../data/collections.json")

router.get("/collections", (req: Request, res: Response) => {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      res.json({ success: true, data: [] })
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
    res.status(500).json({ success: false, message: "Failed to save collections data" })
  }
})

export default router
