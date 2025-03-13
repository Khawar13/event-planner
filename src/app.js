import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import authRoutes from "./routes/authroutes.js"
import eventRoutes from "./routes/eventroutes.js"
import categoryRoutes from "./routes/categoryRoutes.js"
import { errorHandler } from "./middleware/errorHandler.js"
import { startReminderService } from "./utils/reminderService.js"
import { connectDB } from "./config/db.js"

// Load environment variables
dotenv.config()

// Initialize express app
const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Connect to database
connectDB()

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/events", eventRoutes)
app.use("/api/categories", categoryRoutes)

// Health check route
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", message: "Server is running" })
})

// Error handling middleware
app.use(errorHandler)

// Start reminder service
startReminderService()

export default app

