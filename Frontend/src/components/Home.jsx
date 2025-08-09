import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { ArrowRight, Code, Database, Cloud, BookOpen, Cpu, Smartphone, Shield, Gamepad2, Users, Star, TrendingUp, Play, Plus } from 'lucide-react';
import { Button } from "./UI/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./UI/card";
import { Badge } from "./UI/badge";
import Header from "./Header";
import Footer from "./Footer";
import api from "../api";
import PublicHome from "./PublicHome";
import AuthenticatedHome from "./AuthenticatedHome";

// Roadmap Card Component
function RoadmapCard({ roadmap, index }) {
  const navigate = useNavigate();
  
  const getCategoryIcon = (category) => {
    const icons = {
      'Frontend': <Code className="h-5 w-5" />,
      'Backend': <Database className="h-5 w-5" />,
      'DevOps': <Cloud className="h-5 w-5" />,
      'Data': <BookOpen className="h-5 w-5" />,
      'AI/ML': <Cpu className="h-5 w-5" />,
      'AI/LLM': <Cpu className="h-5 w-5" />,
      'Mobile': <Smartphone className="h-5 w-5" />,
      'Security': <Shield className="h-5 w-5" />,
      'Blockchain': <Code className="h-5 w-5" />,
      'GameDev': <Gamepad2 className="h-5 w-5" />,
      'Cloud': <Cloud className="h-5 w-5" />
    };
    return icons[category] || <Code className="h-5 w-5" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <Card 
        className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 bg-slate-800/50 border-slate-700 hover:border-slate-600 h-full"
        onClick={() => navigate(`/roadmap/${roadmap._id}`)}
      >
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-lg bg-slate-700 text-slate-300 group-hover:bg-slate-600 transition-colors">
              {getCategoryIcon(roadmap.category)}
            </div>
            <Badge variant="secondary" className="bg-slate-700 text-slate-300 text-xs">
              {roadmap.category}
            </Badge>
          </div>
          <CardTitle className="text-white text-lg group-hover:text-blue-400 transition-colors">
            {roadmap.title}
          </CardTitle>
          <CardDescription className="text-slate-400 text-sm line-clamp-2">
            {roadmap.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-slate-400 text-sm">
            <div className="flex items-center">
              <BookOpen className="h-4 w-4 mr-1" />
              {roadmap.steps?.length || 0} steps
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              {Math.floor(Math.random() * 1000) + 100}+
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Create Roadmap Card
function CreateRoadmapCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="group"
    >
      <Card className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 bg-slate-800/30 border-slate-700 border-dashed hover:border-slate-600 h-full flex items-center justify-center min-h-[200px]">
        <CardContent className="text-center">
          <div className="p-4 rounded-full bg-slate-700 text-slate-400 group-hover:bg-slate-600 group-hover:text-slate-300 transition-colors mb-4 inline-block">
            <Plus className="h-8 w-8" />
          </div>
          <h3 className="text-white font-semibold mb-2">Create your own Roadmap</h3>
          <p className="text-slate-400 text-sm">Build a custom learning path</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();

  // Show loading state while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Route to appropriate home page based on authentication status
  return isSignedIn ? <AuthenticatedHome /> : <PublicHome />;
}
