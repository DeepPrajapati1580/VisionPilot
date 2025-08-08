// Backend/models/roadmap.model.js
import mongoose from "mongoose";

const stepSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  resources: [String]
}, { _id: false });

const roadmapSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: String,
  tags: [String],
  steps: [stepSchema]
}, { timestamps: true });

export default mongoose.model("Roadmap", roadmapSchema);
