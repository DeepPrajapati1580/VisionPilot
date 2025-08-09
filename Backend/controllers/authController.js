// controllers/auth.controller.js
import { clerkClient } from "@clerk/clerk-sdk-node"
import User from "../models/users.model.js"

export const registerUser = async (req, res) => {
  try {
    const userId = req.auth.userId;

    // Get Clerk user
    const clerkUser = await clerkClient.users.getUser(userId);
    const email = clerkUser.emailAddresses[0]?.emailAddress;
    const name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim();
    const { role } = req.body;
    
    console.log("📝 Registering user:", { userId, email, name, role });

    // Validate role
    const validRoles = ['viewer', 'editor', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        error: "Invalid role specified",
        validRoles: validRoles
      });
    }

    // Check if user already exists in DB
    const existingUser = await User.findOne({ clerkId: userId });
    console.log("🔍 Existing user found:", existingUser);

    if (existingUser) {
      if (existingUser.role !== role) {
        console.error("❌ User already registered with a different role:", existingUser.role);
        return res.status(403).json({
          error: `User already registered with role '${existingUser.role}'. Cannot re-register as '${role}'.`,
        });
      }
      
      // User exists with same role, return existing user
      console.log("✅ User already registered with same role, returning existing user");
      return res.status(200).json({
        message: "User already registered",
        user: {
          id: existingUser._id,
          name: existingUser.name,
          email: existingUser.email,
          role: existingUser.role,
        },
      });
    }

    // Create new user entry
    const newUser = new User({
      clerkId: userId,
      name,
      email,
      role,
      lastLogin: Date.now(),
    });

    await newUser.save();
    console.log("✅ New user created successfully");

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });

  } catch (err) {
    console.error("❌ Registration error:", err);
    return res.status(500).json({ 
      error: "Internal server error during registration.",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.auth.userId;
    console.log("👤 Fetching profile for user:", userId);
    
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      console.log("❌ User not found in database");
      return res.status(404).json({ error: "User not found in database" });
    }

    console.log("✅ Profile found:", { id: user._id, role: user.role, email: user.email });

    res.status(200).json({
      id: user._id,
      clerkId: user.clerkId,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (err) {
    console.error("❌ Profile fetch error:", err);
    res.status(500).json({ 
      error: "Internal server error",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const updates = req.body;
    
    console.log("📝 Updating profile for user:", userId, "with:", updates);

    // Don't allow role changes through this endpoint
    if (updates.role) {
      return res.status(403).json({
        error: "Role changes must be requested through proper channels"
      });
    }

    const user = await User.findOneAndUpdate(
      { clerkId: userId },
      { ...updates, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log("✅ Profile updated successfully");

    res.status(200).json({
      id: user._id,
      clerkId: user.clerkId,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (err) {
    console.error("❌ Profile update error:", err);
    res.status(500).json({ 
      error: "Internal server error",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};
