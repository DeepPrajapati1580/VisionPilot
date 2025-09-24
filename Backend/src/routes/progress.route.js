import express from "express";
import Progress from "../models/progress.model.js";
import { requireAuth } from "../middlewares/requireAuth.middleware.js";

const router = express.Router();

// All progress routes require authentication
router.use(requireAuth);

// CREATE or UPDATE progress
router.post("/", async (req, res) => {
  try {
    const { roadmap, completedSteps } = req.body;
    const userId = req.auth.userId;

    console.log("📊 Updating progress:", { userId, roadmap, completedSteps });

    // Validate input
    if (!roadmap) {
      return res.status(400).json({ error: "Roadmap ID is required" });
    }

    if (!Array.isArray(completedSteps)) {
      return res.status(400).json({ error: "completedSteps must be an array" });
    }

    let progress = await Progress.findOne({ user: userId, roadmap });
    
    if (progress) {
      // Update existing progress
      progress.completedSteps = completedSteps;
      progress.updatedAt = new Date();
      
      // Mark as completed if all steps are done
      // Note: We'd need to fetch the roadmap to know total steps
      // For now, we'll leave completedAt as null unless explicitly set
    } else {
      // Create new progress
      progress = new Progress({
        user: userId,
        roadmap,
        completedSteps
      });
    }
    
    await progress.save();
    console.log("✅ Progress updated successfully");
    
    res.json(progress);
  } catch (err) {
    console.error("❌ Error updating progress:", err);
    res.status(400).json({ error: err.message });
  }
});

// GET all progress for current user
router.get("/", async (req, res) => {
  try {
    const userId = req.auth.userId;
    console.log(`📊 Fetching progress for user: ${userId}`);
    
    const progress = await Progress.find({ user: userId })
      .populate('roadmap', 'title category steps')
      .sort({ updatedAt: -1 });
    
    console.log(`✅ Found ${progress.length} progress records`);
    res.json(progress);
  } catch (err) {
    console.error("❌ Error fetching progress:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET progress for specific roadmap
router.get("/roadmap/:roadmapId", async (req, res) => {
  try {
    const userId = req.auth.userId;
    const roadmapId = req.params.roadmapId;
    
    console.log(`📊 Fetching progress for user ${userId} on roadmap ${roadmapId}`);
    
    const progress = await Progress.findOne({ 
      user: userId, 
      roadmap: roadmapId 
    }).populate('roadmap', 'title category steps');
    
    if (!progress) {
      console.log("📊 No progress found for this roadmap");
      return res.status(404).json({ error: "Progress not found" });
    }
    
    console.log("✅ Progress found");
    res.json(progress);
  } catch (err) {
    console.error("❌ Error fetching roadmap progress:", err);
    if (err.name === 'CastError') {
      return res.status(400).json({ error: "Invalid roadmap ID format" });
    }
    res.status(500).json({ error: err.message });
  }
});

// DELETE progress for specific roadmap
router.delete("/roadmap/:roadmapId", async (req, res) => {
  try {
    const userId = req.auth.userId;
    const roadmapId = req.params.roadmapId;
    
    console.log(`🗑️ Deleting progress for user ${userId} on roadmap ${roadmapId}`);
    
    const progress = await Progress.findOneAndDelete({ 
      user: userId, 
      roadmap: roadmapId 
    });
    
    if (!progress) {
      return res.status(404).json({ error: "Progress not found" });
    }
    
    console.log("✅ Progress deleted successfully");
    res.json({ message: "Progress deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting progress:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET progress statistics for user
router.get("/stats", async (req, res) => {
  try {
    const userId = req.auth.userId;
    console.log(`📊 Fetching progress stats for user: ${userId}`);
    
    const progressRecords = await Progress.find({ user: userId })
      .populate('roadmap', 'title category steps');
    
    const stats = {
      totalRoadmaps: progressRecords.length,
      completedRoadmaps: 0,
      inProgressRoadmaps: 0,
      totalStepsCompleted: 0,
      totalSteps: 0,
      categoriesInProgress: new Set(),
      completionPercentage: 0
    };
    
    progressRecords.forEach(progress => {
      if (progress.roadmap) {
        const totalSteps = progress.roadmap.steps?.length || 0;
        const completedSteps = progress.completedSteps?.length || 0;
        
        stats.totalSteps += totalSteps;
        stats.totalStepsCompleted += completedSteps;
        stats.categoriesInProgress.add(progress.roadmap.category);
        
        if (completedSteps === totalSteps && totalSteps > 0) {
          stats.completedRoadmaps++;
        } else if (completedSteps > 0) {
          stats.inProgressRoadmaps++;
        }
      }
    });
    
    stats.categoriesInProgress = Array.from(stats.categoriesInProgress);
    stats.completionPercentage = stats.totalSteps > 0 
      ? Math.round((stats.totalStepsCompleted / stats.totalSteps) * 100)
      : 0;
    
    console.log("✅ Progress stats calculated");
    res.json(stats);
  } catch (err) {
    console.error("❌ Error fetching progress stats:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
