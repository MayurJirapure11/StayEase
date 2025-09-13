import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./config/db.js";
import { clerkMiddleware } from "@clerk/express";
import clerkWebHooks from "./controllers/clerkWebHooks.js";
import userRouter from "./routes/userRoutes.js";
import hotelRouter from "./routes/hotelRoutes.js";
import connectCloudinary from "./config/cloudinary.js";
import roomRouter from "./routes/roomRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import { stripeWebHooks } from "./controllers/stripeWebhooks.js";

connectDB();
connectCloudinary();

const app = express();
app.use(cors());

// Stripe webhook needs raw body
app.post("/api/stripe", express.raw({ type: "application/json" }), stripeWebHooks);

// Middleware
app.use(express.json());
app.use(clerkMiddleware());

// API routes
app.use("/api/clerk", clerkWebHooks);
app.get("/", (req, res) => res.send("API is working 🚀"));
app.use("/api/user", userRouter);
app.use("/api/hotels", hotelRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/bookings", bookingRouter);

// ❌ Remove app.listen()
// ✅ Export app for Vercel
export default app;