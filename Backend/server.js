import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
import roadmapRoutes from "./src/routes/roadmap.route.js";
import progressRoutes from "./src/routes/progress.route.js";
import authRoutes from "./src/routes/auth.route.js";
import geminiRoadmap from "./src/routes/geminiRoadmap.js"; 

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://vision-pilot.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Request logging middleware (before routes)
app.use((req, res, next) => {
  console.log(`📝 ${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ 
    message: "VisionPilot API is running!",
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

app.get("/api/health", async (req, res) => {
  try {
    const roadmapCount = await mongoose.connection.db.collection('roadmaps').countDocuments();
    res.json({ 
      status: "OK", 
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
      database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      roadmapCount: roadmapCount
    });
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      database: "error",
      error: error.message
    });
  }
});

// API Routes - All routes are essential for functionality
app.use(ClerkExpressWithAuth());
app.use("/api/roadmaps", roadmapRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/gemini", geminiRoadmap);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("🚨 Server error:", err);
  
  // CORS error
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ 
      error: "CORS policy violation",
      message: "Origin not allowed"
    });
  }
  
  // MongoDB errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: "Validation Error",
      message: err.message
    });
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({
      error: "Invalid ID format",
      message: "The provided ID is not valid"
    });
  }
  
  // Default error
  res.status(500).json({ 
    error: "Internal server error",
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    error: "Route not found",
    path: req.originalUrl,
    method: req.method
  });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📋 Roadmaps API: http://localhost:${PORT}/api/roadmaps`);
});


// MongoDB Connection 
const connectDB = async () => {
  try {
    console.log("🔌 Connecting to MongoDB...");
    console.log("🔗 MongoDB URI:", process.env.MONGO_URI ? "✅ Set" : "❌ Not set");
    
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI environment variable is not set");
    }
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully");
    
    // Wait a moment for connection to stabilize
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if roadmaps exist
    const count = await mongoose.connection.db.collection('roadmaps').countDocuments();
    console.log(`📊 Current roadmaps in database: ${count}`);
    
  } catch (error) {
    console.error("❌ DB connection error:", error);
    process.exit(1);
  }
};

// Handle MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('✅ Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ Mongoose disconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Received SIGINT. Graceful shutdown...');
  await mongoose.connection.close();
  process.exit(0);
});

// Initialize database connection
connectDB();