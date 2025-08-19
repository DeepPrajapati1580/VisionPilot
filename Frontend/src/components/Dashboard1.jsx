import React, { useEffect, useState } from "react";
import { useUser, UserButton } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, BookOpen, Users, Code, Database, Cloud, Cpu, Smartphone, Shield, Gamepad2, Play, TrendingUp, Edit, Globe, Lock } from 'lucide-react';
import { Button } from "./UI/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./UI/card";
import { Badge } from "./UI/badge";
import { Progress } from "./UI/progress";
import api from "../api";
import Header from "./Header";

// Roadmap Card Component
function RoadmapCard({ roadmap, progress, index, isOwned = false }) {
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

  const completionPercentage = progress && roadmap.steps 
    ? Math.round((progress.completedSteps.length / roadmap.steps.length) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card 
        className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 bg-slate-800/50 border-slate-700 hover:border-slate-600 relative"
        onClick={() => navigate(`/roadmap/${roadmap._id}`)}
      >
        {isOwned && (
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            <Badge className="bg-green-900/30 text-green-300 border-green-700 text-xs">
              <Edit className="h-3 w-3 mr-1" />
              Created by you
            </Badge>
            <Badge className={`text-xs ${
              roadmap.visibility === 'public' 
                ? 'bg-blue-900/30 text-blue-300 border-blue-700' 
                : 'bg-purple-900/30 text-purple-300 border-purple-700'
            }`}>
              {roadmap.visibility === 'public' ? (
                <Globe className="h-3 w-3 mr-1" />
              ) : (
                <Lock className="h-3 w-3 mr-1" />
              )}
              {roadmap.visibility === 'public' ? 'Public' : 'Private'}
            </Badge>
          </div>
        )}
        
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-lg bg-slate-700 text-slate-300">
              {getCategoryIcon(roadmap.category)}
            </div>
            <Badge variant="secondary" className="bg-slate-700 text-slate-300">
              {roadmap.category}
            </Badge>
          </div>
          <CardTitle className="text-white text-lg">{roadmap.title}</CardTitle>
          <CardDescription className="text-slate-400 text-sm line-clamp-2">
            {roadmap.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {progress && completionPercentage > 0 && (
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Progress</span>
                <span className="text-slate-300">{completionPercentage}%</span>
              </div>
              <Progress value={completionPercentage} className="h-2" />
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-slate-400 text-sm">
              <BookOpen className="h-4 w-4 mr-1" />
              {roadmap.steps?.length || 0} steps
            </div>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Play className="h-3 w-3 mr-1" />
              {progress ? 'Continue' : 'Start'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Create Roadmap Card
function CreateRoadmapCard() {
  const navigate = useNavigate();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card 
        className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 bg-slate-800/30 border-slate-700 border-dashed hover:border-slate-600 h-full flex items-center justify-center min-h-[280px]"
        onClick={() => navigate('/create-roadmap')}
      >
        <CardContent className="text-center">
          <div className="p-4 rounded-full bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-slate-300 transition-colors mb-4 inline-block">
            <Plus className="h-8 w-8" />
          </div>
          <h3 className="text-white font-semibold mb-2">Create New Roadmap</h3>
          <p className="text-slate-400 text-sm">Share your knowledge with the community</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function Dashboard() {
  const { user } = useUser();
  const [roadmaps, setRoadmaps] = useState([]);
  const [userProgress, setUserProgress] = useState([]);
  const [userRoadmaps, setUserRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roadmapsRes, progressRes, userRoadmapsRes] = await Promise.all([
          api.get("/roadmaps"),
          api.get("/progress").catch(() => ({ data: [] })),
          api.get("/roadmaps/user/created").catch(() => ({ data: [] }))
        ]);
        
        setRoadmaps(roadmapsRes.data);
        setUserProgress(progressRes.data);
        setUserRoadmaps(userRoadmapsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getProgressForRoadmap = (roadmapId) => {
    return userProgress.find(p => p.roadmap === roadmapId);
  };

  const isRoadmapOwnedByUser = (roadmapId) => {
    return userRoadmaps.some(r => r._id === roadmapId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-600 rounded-xl">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{roadmaps.length}</h3>
                  <p className="text-slate-400">Available Roadmaps</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-600 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{userProgress.length}</h3>
                  <p className="text-slate-400">In Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-600 rounded-xl">
                  <Edit className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{userRoadmaps.length}</h3>
                  <p className="text-slate-400">Created by You</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-orange-600 rounded-xl">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">10K+</h3>
                  <p className="text-slate-400">Community</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Roadmaps Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Your Learning Paths</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CreateRoadmapCard />
            {roadmaps.map((roadmap, index) => (
              <RoadmapCard
                key={roadmap._id}
                roadmap={roadmap}
                progress={getProgressForRoadmap(roadmap._id)}
                index={index + 1}
                isOwned={isRoadmapOwnedByUser(roadmap._id)}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
