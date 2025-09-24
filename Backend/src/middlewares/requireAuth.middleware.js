// middlewares/requireAuth.middleware.js
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import dotenv from "dotenv";
dotenv.config();

// Dev-only auth bypass to simplify local testing without Clerk
export const requireAuth = (req, res, next) => {
  if (process.env.DEV_AUTH_BYPASS === 'true') {
    req.auth = {
      userId: process.env.DEV_USER_ID || 'dev_user_1'
    };
    return next();
  }

  return ClerkExpressRequireAuth({
    secretKey: process.env.CLERK_SECRET_KEY
  })(req, res, next);
};
