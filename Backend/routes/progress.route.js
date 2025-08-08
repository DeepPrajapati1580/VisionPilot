// Backend/routes/progress.route.js
import express from "express";
import Progress from "../models/progress.model.js";
import { requireAuth } from "../middlewares/requireAuth.middleware.js";

const router = express.Router();

// Apply auth middleware to all routes
router.use(requireAuth);

// CREATE or UPDATE progress
router.post("/", async (req, res) => {
  try {
    const { roadmap, completedSteps } = req.body;
    const userId = req.auth.userId;

    // Find existing progress or create new
    let progress = await Progress.findOne({ 
      user: userId, 
      roadmap: roadmap 
    });

    if (progress) {
      // Update existing progress
      progress.completedSteps = completedSteps;
      progress.updatedAt = new Date();
      
      // Mark as completed if all steps are done
      const roadmapDoc = await Progress.findById(roadmap).populate('roadmap');
      if (roadmapDoc && completedSteps.length === roadmapDoc.roadmap.steps.length) {
        progress.completedAt = new Date();
      } else {
        progress.completedAt = null;
      }
      
      await progress.save();
    } else {
      // Create new progress
      progress = new Progress({
        user: userId,
        roadmap: roadmap,
        completedSteps: completedSteps,
        completedAt: null
      });
      await progress.save();
    }

    res.json(progress);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET all progress for user
router.get("/", async (req, res) => {
  try {
    const userId = req.auth.userId;
    const progressList = await Progress.find({ user: userId })
      .populate('roadmap', 'title category');
    res.json(progressList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET progress for specific roadmap
router.get("/roadmap/:roadmapId", async (req, res) => {
  try {
    const userId = req.auth.userId;
    const progress = await Progress.findOne({ 
      user: userId, 
      roadmap: req.params.roadmapId 
    });
    
    if (!progress) {
      return res.status(404).json({ error: "Progress not found" });
    }
    
    res.json(progress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE progress
router.delete("/:id", async (req, res) => {
  try {
    const progress = await Progress.findByIdAndDelete(req.params.id);
    if (!progress) {
      return res.status(404).json({ error: "Progress not found" });
    }
    res.json({ message: "Progress deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
