import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  roadmap: { type: mongoose.Schema.Types.ObjectId, ref: "Roadmap", required: true },
  completedSteps: [{ type: Number }], // store step index numbers
  completedAt: Date
}, { timestamps: true });

export default mongoose.model("Progress", progressSchema);
