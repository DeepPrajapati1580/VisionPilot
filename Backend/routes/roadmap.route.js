// Backend/routes/roadmap.route.js
import express from "express";
import Roadmap from "../models/roadmap.model.js";
import { requireAuth } from "../middlewares/requireAuth.middleware.js";
import { checkRole, isEditorOrAdmin, isAdmin, isAnyRole } from "../middlewares/checkRole.middleware.js";

const router = express.Router();

// CREATE roadmap (any authenticated user can create)
router.post("/", requireAuth, async (req, res) => {
  try {
    console.log("📝 Creating new roadmap...");
    console.log("User ID:", req.auth.userId);
    console.log("Request body:", req.body);

    const roadmapData = {
      ...req.body,
      createdBy: req.auth.userId
    };

    // Validate required fields
    if (!roadmapData.title || !roadmapData.category) {
      return res.status(400).json({ 
        error: "Title and category are required" 
      });
    }

    // Validate steps
    if (!roadmapData.steps || roadmapData.steps.length === 0) {
      return res.status(400).json({ 
        error: "At least one step is required" 
      });
    }

    // Check if all steps have titles
    const invalidSteps = roadmapData.steps.some(step => !step.title || !step.title.trim());
    if (invalidSteps) {
      return res.status(400).json({ 
        error: "All steps must have a title" 
      });
    }

    const roadmap = new Roadmap(roadmapData);
    await roadmap.save();
    
    console.log(`✅ Roadmap created successfully: ${roadmap.title}`);
    res.status(201).json(roadmap);
  } catch (err) {
    console.error("❌ Error creating roadmap:", err);
    
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        error: "Validation failed", 
        details: err.message 
      });
    }
    
    res.status(500).json({ error: err.message });
  }
});

// GET all roadmaps (public only)
router.get("/", async (req, res) => {
  try {
    console.log("📋 Fetching all public roadmaps...");
    
    const roadmaps = await Roadmap.find({ 
      isActive: true, 
      visibility: 'public' 
    }).sort({ createdAt: -1 });
    console.log(`✅ Found ${roadmaps.length} public roadmaps`);
    
    res.json(roadmaps);
  } catch (err) {
    console.error("❌ Error fetching roadmaps:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET single roadmap by ID (public or private if owner)
router.get("/:id", async (req, res) => {
  try {
    console.log(`📋 Fetching roadmap with ID: ${req.params.id}`);
    
    const roadmap = await Roadmap.findById(req.params.id);
    if (!roadmap) {
      console.log("❌ Roadmap not found");
      return res.status(404).json({ error: "Roadmap not found" });
    }

    // Check if roadmap is private and user is not the creator
    if (roadmap.visibility === 'private' && roadmap.createdBy !== req.auth?.userId) {
      console.log("❌ Access denied to private roadmap");
      return res.status(403).json({ error: "Access denied. This roadmap is private." });
    }
    
    console.log(`✅ Found roadmap: ${roadmap.title}`);
    res.json(roadmap);
  } catch (err) {
    console.error("❌ Error fetching roadmap:", err);
    if (err.name === 'CastError') {
      return res.status(400).json({ error: "Invalid roadmap ID format" });
    }
    res.status(500).json({ error: err.message });
  }
});

// UPDATE roadmap (owner or admins only)
router.put("/:id", requireAuth, async (req, res) => {
  try {
    console.log(`📝 Updating roadmap with ID: ${req.params.id}`);
    console.log("User ID:", req.auth.userId);
    
    const roadmap = await Roadmap.findById(req.params.id);
    if (!roadmap) {
      return res.status(404).json({ error: "Roadmap not found" });
    }

    // Check if user is the creator or admin
    const isCreator = roadmap.createdBy === req.auth.userId;
    
    // For admin check, we need to get user info from database
    let isAdmin = false;
    if (!isCreator) {
      try {
        const User = (await import("../models/users.model.js")).default;
        const user = await User.findOne({ clerkId: req.auth.userId });
        isAdmin = user && user.role === 'admin';
      } catch (userErr) {
        console.warn("Could not verify admin status:", userErr);
        // If we can't verify admin status, only allow creator
      }
    }

    if (!isCreator && !isAdmin) {
      return res.status(403).json({ 
        error: "Not authorized to update this roadmap",
        message: "Only the creator or admins can update roadmaps"
      });
    }

    // Validate required fields
    if (!req.body.title || !req.body.category) {
      return res.status(400).json({ 
        error: "Title and category are required" 
      });
    }

    // Validate steps
    if (!req.body.steps || req.body.steps.length === 0) {
      return res.status(400).json({ 
        error: "At least one step is required" 
      });
    }

    // Check if all steps have titles
    const invalidSteps = req.body.steps.some(step => !step.title || !step.title.trim());
    if (invalidSteps) {
      return res.status(400).json({ 
        error: "All steps must have a title" 
      });
    }

    const updatedRoadmap = await Roadmap.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    console.log(`✅ Roadmap updated: ${updatedRoadmap.title}`);
    res.json(updatedRoadmap);
  } catch (err) {
    console.error("❌ Error updating roadmap:", err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        error: "Validation failed", 
        details: err.message 
      });
    }
    if (err.name === 'CastError') {
      return res.status(400).json({ error: "Invalid roadmap ID format" });
    }
    res.status(500).json({ error: err.message });
  }
});

// DELETE roadmap (owner or admins only)
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    console.log(`🗑️ Deleting roadmap with ID: ${req.params.id}`);
    console.log("User ID:", req.auth.userId);
    
    const roadmap = await Roadmap.findById(req.params.id);
    if (!roadmap) {
      return res.status(404).json({ error: "Roadmap not found" });
    }

    // Check if user is the creator or admin
    const isCreator = roadmap.createdBy === req.auth.userId;
    
    // For admin check, we need to get user info from database
    let isAdmin = false;
    if (!isCreator) {
      try {
        const User = (await import("../models/users.model.js")).default;
        const user = await User.findOne({ clerkId: req.auth.userId });
        isAdmin = user && user.role === 'admin';
      } catch (userErr) {
        console.warn("Could not verify admin status:", userErr);
        // If we can't verify admin status, only allow creator
      }
    }

    if (!isCreator && !isAdmin) {
      return res.status(403).json({ 
        error: "Not authorized to delete this roadmap",
        message: "Only the creator or admins can delete roadmaps"
      });
    }

    // Soft delete by setting isActive to false
    await Roadmap.findByIdAndUpdate(req.params.id, { isActive: false });
    
    console.log(`✅ Roadmap soft deleted: ${roadmap.title}`);
    res.json({ 
      message: "Roadmap deleted successfully",
      roadmapId: req.params.id,
      title: roadmap.title
    });
  } catch (err) {
    console.error("❌ Error deleting roadmap:", err);
    if (err.name === 'CastError') {
      return res.status(400).json({ error: "Invalid roadmap ID format" });
    }
    res.status(500).json({ error: err.message });
  }
});

// GET user's created roadmaps (protected route - both public and private)
router.get("/user/created", requireAuth, async (req, res) => {
  try {
    console.log(`📋 Fetching roadmaps created by user: ${req.auth.userId}`);
    
    const roadmaps = await Roadmap.find({ 
      createdBy: req.auth.userId,
      isActive: true
    }).sort({ createdAt: -1 });
    
    console.log(`✅ Found ${roadmaps.length} roadmaps created by user`);
    res.json(roadmaps);
  } catch (err) {
    console.error("❌ Error fetching user's roadmaps:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET all roadmaps accessible to user (public + user's private)
router.get("/user/accessible", requireAuth, async (req, res) => {
  try {
    console.log(`📋 Fetching accessible roadmaps for user: ${req.auth.userId}`);
    
    const roadmaps = await Roadmap.find({
      $or: [
        { visibility: 'public', isActive: true },
        { createdBy: req.auth.userId, isActive: true }
      ]
    }).sort({ createdAt: -1 });
    
    console.log(`✅ Found ${roadmaps.length} accessible roadmaps for user`);
    res.json(roadmaps);
  } catch (err) {
    console.error("❌ Error fetching accessible roadmaps:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET roadmaps by category (public only)
router.get("/category/:category", async (req, res) => {
  try {
    const category = req.params.category;
    console.log(`📋 Fetching public roadmaps for category: ${category}`);
    
    const roadmaps = await Roadmap.find({ 
      category: { $regex: new RegExp(category, 'i') },
      isActive: true,
      visibility: 'public'
    }).sort({ createdAt: -1 }).lean();
    
    console.log(`✅ Found ${roadmaps.length} public roadmaps in category: ${category}`);
    res.status(200).json(roadmaps);
  } catch (err) {
    console.error("❌ Error fetching roadmaps by category:", err);
    res.status(500).json({ 
      error: "Failed to fetch roadmaps by category",
      message: err.message 
    });
  }
});

// GET roadmaps with search functionality (public only)
router.get("/search/:query", async (req, res) => {
  try {
    const query = req.params.query;
    console.log(`🔍 Searching public roadmaps for: ${query}`);
    
    const roadmaps = await Roadmap.find({
      isActive: true,
      visibility: 'public',
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } },
        { category: { $regex: query, $options: 'i' } }
      ]
    }).sort({ createdAt: -1 }).lean();
    
    console.log(`✅ Found ${roadmaps.length} public roadmaps matching: ${query}`);
    res.status(200).json(roadmaps);
  } catch (err) {
    console.error("❌ Error searching roadmaps:", err);
    res.status(500).json({ 
      error: "Failed to search roadmaps",
      message: err.message 
    });
  }
});

// Admin routes
router.get("/admin/all", requireAuth, isAdmin, async (req, res) => {
  try {
    console.log("👑 Admin fetching all roadmaps (including inactive)");
    
    const roadmaps = await Roadmap.find({}).sort({ createdAt: -1 });
    console.log(`✅ Found ${roadmaps.length} total roadmaps`);
    
    res.json(roadmaps);
  } catch (err) {
    console.error("❌ Error fetching all roadmaps:", err);
    res.status(500).json({ error: err.message });
  }
});

// Test endpoint to check database connection
router.get("/test/connection", async (req, res) => {
  try {
    const count = await Roadmap.countDocuments();
    const sample = await Roadmap.findOne().lean();
    
    res.json({
      status: "Database connection OK",
      totalRoadmaps: count,
      sampleRoadmap: sample ? {
        id: sample._id,
        title: sample.title,
        category: sample.category
      } : null
    });
  } catch (err) {
    res.status(500).json({
      status: "Database connection failed",
      error: err.message
    });
  }
});

export default router;
