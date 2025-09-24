import express from "express";
import { requireAuth } from "../middlewares/requireAuth.middleware.js";
import { registerUser, getProfile, updateProfile } from "../controllers/authController.js";

const router = express.Router();

// Register user (requires authentication)
router.post("/register", requireAuth, registerUser);

// Get user profile (requires authentication)
router.get("/profile", requireAuth, getProfile);

// Update user profile (requires authentication)
router.put("/profile", requireAuth, updateProfile);

// Health check for auth routes
router.get("/health", (req, res) => {
  res.json({ 
    status: "Auth routes are working",
    timestamp: new Date().toISOString()
  });
});

export default router;
