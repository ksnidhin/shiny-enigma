import dotenv from "dotenv"
dotenv.config()
import express, { Application, Request, Response } from "express"
import cors from "cors"
import watchRoutes from "./routes/watches"

const app: Application = express()
const PORT = process.env.PORT || 9000

// Middleware
app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"] }))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

import { heroRouter } from "./routes/hero"
import reviewsRouter from "./routes/reviews"
import collectionsRouter from "./routes/collections"

// API Routes
app.use("/api", watchRoutes)
app.use("/api", heroRouter)
app.use("/api", reviewsRouter)
app.use("/api", collectionsRouter)

// Health Check endpoint
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok", service: "RetroTimeCo Horological Custom REST API", timestamp: new Date().toISOString() })
})

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 [RetroTimeCo Backend]: Custom REST API Server running on http://localhost:${PORT}`)
  console.log(`📦 [Inventory Endpoints]: http://localhost:${PORT}/api/watches`)
  console.log(`📊 [Analytics Endpoints]: http://localhost:${PORT}/api/stats`)
})

export default app
