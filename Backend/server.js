import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import roadmapRoutes from "./routes/roadmap.route.js";
import categoryRoutes from "./routes/category.route.js";
import progressRoutes from "./routes/progress.route.js";
import authRoutes from "./routes/auth.route.js";
import { seedRoadmaps } from "./seed/roadmap.seed.js";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ["https://your-frontend-domain.vercel.app", "https://visionpilot.vercel.app"]
    : ["http://localhost:5173", "http://127.0.0.1:5173"],
  credentials: true
}));

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ 
    message: "VisionPilot API is running!",
    status: "healthy",
    timestamp: new Date().toISOString()
  });
});

app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK", 
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use("/api/roadmaps", roadmapRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/auth", authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ 
    error: "Internal server error",
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use("*", (req, res) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: "Route not found" });
});

// MongoDB Connection + Seeding
const connectDB = async () => {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("✅ MongoDB connected successfully");
    
    // Check if roadmaps exist
    const count = await mongoose.connection.db.collection('roadmaps').countDocuments();
    console.log(`📊 Current roadmaps in database: ${count}`);
    
    // Run roadmap seed
    await seedRoadmaps();
    
    // Check count again after seeding
    const newCount = await mongoose.connection.db.collection('roadmaps').countDocuments();
    console.log(`📊 Roadmaps after seeding: ${newCount}`);
    
  } catch (error) {
    console.error("❌ DB connection error:", error);
    process.exit(1);
  }
};

connectDB();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📋 Roadmaps API: http://localhost:${PORT}/api/roadmaps`);
});

export default app;
