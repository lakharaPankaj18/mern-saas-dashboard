import express from "express";
import cors from "cors";
import authRoute from "./routes/authRoute.js";
import dashboardRoute from "./routes/dashboardRoute.js";
import userRoute from "./routes/userRoute.js";
import taskRoute from "./routes/taskRoute.js";

import cookieParser from "cookie-parser";

const app = express();

// CORS Configuration
app.use(
  cors({
    origin: "https://mern-saas-dashboard-client.vercel.app",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  }),
);

// Body Parser
app.use(express.json());
app.use(cookieParser());
// Root Route
app.get("/", (req, res) => {
  res.status(200).json({ message: "API is running" });
});

// API Routes
app.use("/api/auth", authRoute);
app.use("/api/dashboard", dashboardRoute);
app.use("/api/users", userRoute);
app.use("/api/tasks", taskRoute);

// 404 Handler - IMPORTANT: Returns JSON instead of HTML
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Error:", err); // Log error for debugging

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }), // Show stack in dev
  });
});

export default app;
