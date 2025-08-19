// src/components/RoleSelection.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Eye, CheckCircle, ArrowRight, Crown } from 'lucide-react';
import { Button } from "./UI/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./UI/card";
import { Badge } from "./UI/badge";

const roles = [
  {
    id: "viewer",
    title: "Learner",
    description: "Access learning content, track progress, and participate in community",
    icon: <Eye className="h-8 w-8" />,
    color: "from-green-500 to-green-600",
    permissions: [
      "Access all roadmaps",
      "Track learning progress",
      "Community participation",
      "Personal dashboard",
      "Achievement system"
    ],
    recommended: true
  },
  // Editor role removed; only viewer and admin roles are available
  {
    id: "admin",
    title: "Administrator",
    description: "Full access to all features, user management, and system configuration",
    icon: <Crown className="h-8 w-8" />,
    color: "from-red-500 to-red-600",
    permissions: [
      "Full system access",
      "User management and roles",
      "System configuration",
      "Analytics and reporting",
      "Content moderation"
    ],
    restricted: true
  }
];

export default function RoleSelection({ onRoleSelect, loading = false, error = null }) {
  const [selectedRole, setSelectedRole] = useState("viewer"); // Default to viewer

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
  };

  const handleConfirm = () => {
    if (selectedRole && onRoleSelect) {
      onRoleSelect(selectedRole);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Choose Your Role
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Select the role that best describes how you'll be using VisionPilot. 
            This helps us customize your experience and provide the right tools for your needs.
          </p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-900/20 border border-red-700 rounded-lg p-4 mb-6 text-center"
          >
            <p className="text-red-400">{error}</p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {roles.map((role, index) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card 
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  selectedRole === role.id 
                    ? 'ring-2 ring-blue-500 shadow-lg scale-105' 
                    : 'hover:scale-102'
                } bg-slate-800 border-slate-700 ${
                  role.restricted ? 'opacity-75' : ''
                }`}
                onClick={() => !role.restricted && handleRoleSelect(role.id)}
              >
                <CardHeader className="text-center pb-4">
                  <div className="relative">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${role.color} text-white mb-4 mx-auto`}>
                      {role.icon}
                    </div>
                    {selectedRole === role.id && (
                      <div className="absolute -top-2 -right-2">
                        <CheckCircle className="h-6 w-6 text-blue-500" />
                      </div>
                    )}
                    {role.recommended && (
                      <div className="absolute -top-2 -left-2">
                        <Badge className="bg-green-900/30 text-green-300 border-green-700 text-xs">
                          Recommended
                        </Badge>
                      </div>
                    )}
                    {role.restricted && (
                      <div className="absolute -top-2 -left-2">
                        <Badge className="bg-red-900/30 text-red-300 border-red-700 text-xs">
                          Contact Admin
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardTitle className="text-xl font-bold text-white">
                    {role.title}
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    {role.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-white text-sm mb-3">
                      What you can do:
                    </h4>
                    <ul className="space-y-2">
                      {role.permissions.map((permission, permIndex) => (
                        <li key={permIndex} className="flex items-start space-x-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-slate-400">{permission}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {role.restricted && (
                    <div className="mt-4 p-3 bg-red-900/20 rounded-lg">
                      <p className="text-xs text-red-300">
                        Admin access requires approval. Contact your system administrator.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
        >
          <Button
            onClick={handleConfirm}
            disabled={!selectedRole || loading}
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-lg px-8 py-4"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Setting up your account...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span>Continue as {roles.find(r => r.id === selectedRole)?.title}</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            )}
          </Button>
          
          <p className="text-sm text-slate-500 mt-4">
            Don't worry, you can request role changes later in your profile settings
          </p>
        </motion.div>
      </div>
    </div>
  );
}
