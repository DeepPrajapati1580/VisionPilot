import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import roadmapRoutes from "./routes/roadmap.route.js";
import progressRoutes from "./routes/progress.route.js";
import authRoutes from "./routes/auth.route.js";
// Seeding removed; DB already contains initial data

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    const allowed = [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:3000',
      'http://127.0.0.1:3000',
    ];
    if (allowed.includes(origin)) return callback(null, true);
    // In development, also allow 5174 (Vite alt) and 3001
    if (process.env.NODE_ENV !== 'production' && (/^http:\/\/localhost:(517[0-9]|3001)$/.test(origin) || /^http:\/\/127\.0\.0\.1:(517[0-9]|3001)$/.test(origin))) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  exposedHeaders: [],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
// Note: cors middleware will handle preflight; explicit app.options removed to avoid path pattern issues in Express v5

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
app.use("/api/roadmaps", roadmapRoutes);
// Categories API removed: categories are simple strings on roadmaps now
app.use("/api/progress", progressRoutes);
app.use("/api/auth", authRoutes);

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

// MongoDB Connection + Seeding
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

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📋 Roadmaps API: http://localhost:${PORT}/api/roadmaps`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
