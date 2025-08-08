import Progress from "../models/progress.model.js";

export const createProgress = async (req, res) => {
  try {
    const progress = new Progress({ ...req.body, user: req.userId });
    await progress.save();
    res.status(201).json(progress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserProgress = async (req, res) => {
  try {
    const progress = await Progress.find({ user: req.userId }).populate("roadmap", "title");
    res.json(progress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getProgressById = async (req, res) => {
  try {
    const progress = await Progress.findById(req.params.id).populate("roadmap", "title");
    if (!progress) return res.status(404).json({ message: "Progress not found" });
    res.json(progress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProgress = async (req, res) => {
  try {
    const progress = await Progress.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!progress) return res.status(404).json({ message: "Progress not found" });
    res.json(progress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteProgress = async (req, res) => {
  try {
    const progress = await Progress.findByIdAndDelete(req.params.id);
    if (!progress) return res.status(404).json({ message: "Progress not found" });
    res.json({ message: "Progress deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
