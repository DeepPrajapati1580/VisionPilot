import User from "../models/users.model.js";
import { clerkClient } from "@clerk/clerk-sdk-node";

export const checkRole = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const userId = req.auth.userId;
      
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }

      // Get or create user from database
      let user = await User.findOne({ clerkId: userId });
      
      if (!user) {
        try {
          if (process.env.DEV_AUTH_BYPASS === 'true') {
            // No Clerk in dev; provision a placeholder viewer
            user = new User({
              clerkId: userId,
              email: `${userId}@example.com`,
              name: 'Dev User',
              role: 'viewer',
              lastLogin: Date.now(),
            });
            await user.save();
          } else {
            const clerkUser = await clerkClient.users.getUser(userId);
            const email = clerkUser.emailAddresses[0]?.emailAddress;
            const name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim();
            if (!email) {
              return res.status(400).json({ error: "Authenticated user has no email address" });
            }

            user = new User({
              clerkId: userId,
              email,
              name,
              role: "viewer",
              lastLogin: Date.now(),
            });
            await user.save();
          }
        } catch (e) {
          console.error("Auto-provisioning user failed:", e);
          return res.status(500).json({ error: "Failed to provision user" });
        }
      }

      // Check if user role is allowed
      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ 
          error: "Access denied", 
          message: `This action requires one of the following roles: ${allowedRoles.join(', ')}`,
          userRole: user.role
        });
      }

      // Add user info to request
      req.user = user;
      next();
    } catch (error) {
      console.error("Role check error:", error);
      res.status(500).json({ error: "Internal server error during role check" });
    }
  };
};

export const isAdmin = checkRole(['admin']);
export const isEditorOrAdmin = checkRole(['admin']);
export const isAnyRole = checkRole(['viewer', 'admin']);
