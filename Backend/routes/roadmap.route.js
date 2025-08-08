// Backend/routes/roadmap.route.js
import express from "express";
import Roadmap from "../models/roadmap.model.js";

const router = express.Router();

// GET all roadmaps
router.get("/", async (req, res) => {
  try {
    const roadmaps = await Roadmap.find();
    res.json(roadmaps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single roadmap
router.get("/:id", async (req, res) => {
  try {
    const roadmap = await Roadmap.findById(req.params.id);
    if (!roadmap) return res.status(404).json({ message: "Roadmap not found" });
    res.json(roadmap);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
