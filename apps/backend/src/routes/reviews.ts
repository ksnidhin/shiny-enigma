import { Router, Request, Response } from "express"
import { ReviewStorage } from "../db/storage"

const router = Router()

// GET /api/reviews
router.get("/reviews", async (req: Request, res: Response): Promise<void> => {
  try {
    const reviews = await ReviewStorage.getAll()
    res.status(200).json({ success: true, data: reviews })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error fetching reviews" })
  }
})

// POST /api/reviews
router.post("/reviews", async (req: Request, res: Response): Promise<void> => {
  try {
    const review = await ReviewStorage.create(req.body)
    res.status(201).json({ success: true, data: review })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error creating review" })
  }
})

// DELETE /api/reviews/:id
router.delete("/reviews/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const success = await ReviewStorage.delete(req.params.id as string)
    if (success) {
      res.status(200).json({ success: true, message: "Review deleted" })
    } else {
      res.status(404).json({ success: false, message: "Review not found" })
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error deleting review" })
  }
})

export default router
