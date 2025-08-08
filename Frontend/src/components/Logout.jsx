// src/components/Logout.jsx
import React, { useEffect } from "react";
import { useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, Code } from 'lucide-react';

export default function Logout() {
  const { signOut } = useClerk();
  const navigate = useNavigate();

  useEffect(() => {
    const handleSignOut = async () => {
      try {
        await signOut();
        // Redirect will happen automatically via Clerk
        navigate('/');
      } catch (error) {
        console.error("Sign out error:", error);
        // Fallback redirect
        navigate('/');
      }
    };

    // Add a small delay to show the logout screen
    const timer = setTimeout(handleSignOut, 1500);
    
    return () => clearTimeout(timer);
  }, [signOut, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-12 border border-gray-200 dark:border-slate-700 max-w-md mx-auto">
          {/* Logo */}
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Code className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              VisionPilot
            </h1>
          </div>

          {/* Logout Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <LogOut className="h-8 w-8 text-white" />
          </motion.div>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Signing you out...
            </h2>
            <p className="text-gray-600 dark:text-slate-400 mb-6">
              Thank you for using VisionPilot. We hope to see you again soon!
            </p>

            {/* Loading Spinner */}
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          </motion.div>
        </div>

        {/* Footer Message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-sm text-gray-500 dark:text-slate-500 mt-6"
        >
          Redirecting you to the home page...
        </motion.p>
      </motion.div>
    </div>
  );
}
