// Backend/routes/roadmap.route.js
import express from "express";
import Roadmap from "../models/roadmap.model.js";

const router = express.Router();

// GET all roadmaps
router.get("/", async (req, res) => {
  try {
    console.log("📋 Fetching all roadmaps...");
    const roadmaps = await Roadmap.find();
    console.log(`✅ Found ${roadmaps.length} roadmaps`);
    res.json(roadmaps);
  } catch (err) {
    console.error("❌ Error fetching roadmaps:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET single roadmap by ID
router.get("/:id", async (req, res) => {
  try {
    console.log(`📋 Fetching roadmap with ID: ${req.params.id}`);
    const roadmap = await Roadmap.findById(req.params.id);
    if (!roadmap) {
      console.log("❌ Roadmap not found");
      return res.status(404).json({ error: "Roadmap not found" });
    }
    console.log(`✅ Found roadmap: ${roadmap.title}`);
    res.json(roadmap);
  } catch (err) {
    console.error("❌ Error fetching roadmap:", err);
    if (err.name === 'CastError') {
      return res.status(400).json({ error: "Invalid roadmap ID" });
    }
    res.status(500).json({ error: err.message });
  }
});

// GET roadmaps by category
router.get("/category/:category", async (req, res) => {
  try {
    const roadmaps = await Roadmap.find({ 
      category: { $regex: new RegExp(req.params.category, 'i') }
    });
    res.json(roadmaps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
