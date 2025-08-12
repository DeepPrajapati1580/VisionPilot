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
  steps: [stepSchema],
  // The Clerk user ID of the creator; used for authorization checks
  createdBy: { type: String, required: true },
  // Visibility: public or private
  visibility: { 
    type: String, 
    enum: ['public', 'private'], 
    default: 'public' 
  },
  // Soft-delete flag; routes filter by isActive: true
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("Roadmap", roadmapSchema);
