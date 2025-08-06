import express from "express"
import "dotenv/config"
import cors from "cors"
import connectDB from "./config/db.js"
import { clerkMiddleware } from '@clerk/express'
import clerkWebHooks from "./controllers/clerkWebHooks.js"

connectDB()

const app = express()
app.use(cors())


// Middleware
app.use(express.json())
app.use(clerkMiddleware())

// API for clerk webhook
app.use("/api/clerk",clerkWebHooks)

app.get('/',(req , res) => res.send("API is working"))

const PORT = process.env.PORT || 3000

app.listen(PORT , () => console.log(`Server running on Port ${PORT}`))

