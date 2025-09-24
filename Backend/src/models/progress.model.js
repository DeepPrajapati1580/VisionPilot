import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
  user: { 
    type: String, // Clerk user ID
    required: true 
  },
  roadmap: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Roadmap", 
    required: true 
  },
  completedSteps: [{ 
    type: Number 
  }], // Array of step indices
  completedAt: { 
    type: Date, 
    default: null 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Compound index for efficient queries
progressSchema.index({ user: 1, roadmap: 1 }, { unique: true });

export default mongoose.model("Progress", progressSchema);
