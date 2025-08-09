import User from "../models/users.model.js";

export const checkRole = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const userId = req.auth.userId;
      
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }

      // Get user from database
      const user = await User.findOne({ clerkId: userId });
      
      if (!user) {
        return res.status(404).json({ error: "User not found in database" });
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
export const isEditorOrAdmin = checkRole(['editor', 'admin']);
export const isAnyRole = checkRole(['viewer', 'editor', 'admin']);
