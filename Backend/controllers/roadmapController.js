import Roadmap from "../models/roadmap.model.js";

// CREATE
export const createRoadmap = async (req, res) => {
  try {
    const roadmap = new Roadmap({ ...req.body, createdBy: req.userId });
    await roadmap.save();
    res.status(201).json(roadmap);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ ALL
export const getRoadmaps = async (req, res) => {
  try {
    const roadmaps = await Roadmap.find().populate("createdBy", "name email");
    res.json(roadmaps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ ONE
export const getRoadmapById = async (req, res) => {
  try {
    const roadmap = await Roadmap.findById(req.params.id).populate("createdBy", "name email");
    if (!roadmap) return res.status(404).json({ message: "Roadmap not found" });
    res.json(roadmap);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
export const updateRoadmap = async (req, res) => {
  try {
    const roadmap = await Roadmap.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!roadmap) return res.status(404).json({ message: "Roadmap not found" });
    res.json(roadmap);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE
export const deleteRoadmap = async (req, res) => {
  try {
    const roadmap = await Roadmap.findByIdAndDelete(req.params.id);
    if (!roadmap) return res.status(404).json({ message: "Roadmap not found" });
    res.json({ message: "Roadmap deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
