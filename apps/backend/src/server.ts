import express, { Application, Request, Response } from "express"
import cors from "cors"
import watchRoutes from "./routes/watches"

const app: Application = express()
const PORT = process.env.PORT || 9000

// Middleware
app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"] }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// API Routes
app.use("/api", watchRoutes)

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
