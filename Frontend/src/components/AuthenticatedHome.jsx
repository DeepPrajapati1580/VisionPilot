import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, UserButton } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { Plus, BookOpen, Users, Code, Database, Cloud, Cpu, Smartphone, Shield, Gamepad2, Play, TrendingUp, Edit, Settings, Crown, Eye, Award, Target, Calendar } from 'lucide-react';
import { Button } from "./UI/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./UI/card";
import { Badge } from "./UI/badge";
import { Progress } from "./UI/progress";
import Header from "./Header";
import Footer from "./Footer";
import api from "../api";

// Role Badge Component
function RoleBadge({ role }) {
  const roleConfig = {
    admin: { 
      icon: <Crown className="h-3 w-3" />, 
      color: "bg-red-900/30 text-red-300 border-red-700",
      label: "Administrator"
    },
    editor: { 
      icon: <Edit className="h-3 w-3" />, 
      color: "bg-blue-900/30 text-blue-300 border-blue-700",
      label: "Content Editor"
    },
    viewer: { 
      icon: <Eye className="h-3 w-3" />, 
      color: "bg-green-900/30 text-green-300 border-green-700",
      label: "Learner"
    }
  };

  const config = roleConfig[role] || roleConfig.viewer;

  return (
    <Badge className={`${config.color} text-xs`}>
      {config.icon}
      <span className="ml-1">{config.label}</span>
    </Badge>
  );
}

// Quick Action Card
function QuickActionCard({ icon, title, description, onClick, disabled = false, badge = null }) {
  return (
    <Card 
      className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 bg-slate-800/50 border-slate-700 hover:border-slate-600 ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      onClick={disabled ? undefined : onClick}
    >
      <CardContent className="p-6 text-center">
        <div className="relative">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            {icon}
          </div>
          {badge && (
            <div className="absolute -top-2 -right-2">
              {badge}
            </div>
          )}
        </div>
        <h3 className="text-white font-semibold mb-2">{title}</h3>
        <p className="text-slate-400 text-sm">{description}</p>
      </CardContent>
    </Card>
  );
}

// Roadmap Card with Role-based Actions
function RoadmapCard({ roadmap, progress, index, userRole, userId, onEdit, onDelete }) {
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

  const canEdit = userRole === 'admin' || roadmap.createdBy === userId;
  const canDelete = userRole === 'admin' || roadmap.createdBy === userId;
  const isOwned = roadmap.createdBy === userId;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="transition-all duration-300 hover:shadow-lg bg-slate-800/50 border-slate-700 hover:border-slate-600 relative group">
        {/* Role-based Action Buttons */}
        {(canEdit || canDelete) && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
            {canEdit && (
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(roadmap._id);
                }}
                className="h-8 w-8 p-0 bg-blue-900/50 hover:bg-blue-900/70 text-blue-300"
              >
                <Edit className="h-3 w-3" />
              </Button>
            )}
            {canDelete && (
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(roadmap._id);
                }}
                className="h-8 w-8 p-0 bg-red-900/50 hover:bg-red-900/70 text-red-300"
              >
                <Settings className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}

        {/* Ownership Badge */}
        {isOwned && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-green-900/30 text-green-300 border-green-700 text-xs">
              <Crown className="h-3 w-3 mr-1" />
              Your Roadmap
            </Badge>
          </div>
        )}
        
        <div 
          className="cursor-pointer"
          onClick={() => navigate(`/roadmap/${roadmap._id}`)}
        >
          <CardHeader className="pb-4 pt-8">
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
        </div>
      </Card>
    </motion.div>
  );
}

export default function AuthenticatedHome() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [roadmaps, setRoadmaps] = useState([]);
  const [userProgress, setUserProgress] = useState([]);
  const [userRoadmaps, setUserRoadmaps] = useState([]);
  const [userRole, setUserRole] = useState('viewer');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRoadmaps: 0,
    inProgress: 0,
    completed: 0,
    created: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roadmapsRes, progressRes, userRoadmapsRes, profileRes] = await Promise.all([
          api.get("/roadmaps"),
          api.get("/progress").catch(() => ({ data: [] })),
          api.get("/roadmaps/user/created").catch(() => ({ data: [] })),
          api.get("/auth/profile").catch(() => ({ data: { role: 'viewer' } }))
        ]);
        
        setRoadmaps(roadmapsRes.data);
        setUserProgress(progressRes.data);
        setUserRoadmaps(userRoadmapsRes.data);
        setUserRole(profileRes.data.role || 'viewer');

        // Calculate stats
        const completedCount = progressRes.data.filter(p => {
          const roadmap = roadmapsRes.data.find(r => r._id === p.roadmap);
          return roadmap && p.completedSteps.length === roadmap.steps?.length;
        }).length;

        setStats({
          totalRoadmaps: roadmapsRes.data.length,
          inProgress: progressRes.data.length - completedCount,
          completed: completedCount,
          created: userRoadmapsRes.data.length
        });

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

  const handleEditRoadmap = (roadmapId) => {
    navigate(`/edit-roadmap/${roadmapId}`);
  };

  const handleDeleteRoadmap = async (roadmapId) => {
    if (window.confirm('Are you sure you want to delete this roadmap?')) {
      try {
        await api.delete(`/roadmaps/${roadmapId}`);
        setRoadmaps(prev => prev.filter(r => r._id !== roadmapId));
        setUserRoadmaps(prev => prev.filter(r => r._id !== roadmapId));
      } catch (error) {
        console.error('Error deleting roadmap:', error);
      }
    }
  };

  const getQuickActions = () => {
    const actions = [
      {
        icon: <Play className="h-6 w-6 text-white" />,
        title: "Continue Learning",
        description: "Resume your current roadmaps",
        onClick: () => navigate('/dashboard'),
        disabled: false
      },
      {
        icon: <Target className="h-6 w-6 text-white" />,
        title: "Set Goals",
        description: "Define your learning objectives",
        onClick: () => navigate('/goals'),
        disabled: false
      }
    ];

    if (userRole === 'admin') {
      actions.push({
        icon: <Plus className="h-6 w-6 text-white" />,
        title: "Create Roadmap",
        description: "Share your knowledge",
        onClick: () => navigate('/create-roadmap'),
        disabled: false,
        badge: <Badge className="bg-red-900/30 text-red-300 border-red-700 text-xs">Admin</Badge>
      });
    }

    if (userRole === 'admin') {
      actions.push({
        icon: <Settings className="h-6 w-6 text-white" />,
        title: "Admin Panel",
        description: "Manage users and content",
        onClick: () => navigate('/admin'),
        disabled: false,
        badge: <Badge className="bg-red-900/30 text-red-300 border-red-700 text-xs">Admin</Badge>
      });
    }

    return actions;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />

      {/* Welcome Section */}
      <section className="py-12 bg-gradient-to-r from-slate-800/50 to-slate-700/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row items-center justify-between"
          >
            <div className="flex items-center space-x-4 mb-6 md:mb-0">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {user?.firstName?.charAt(0) || user?.emailAddresses?.[0]?.emailAddress?.charAt(0) || 'U'}
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Welcome back, {user?.firstName || 'Developer'}!
                </h1>
                <div className="flex items-center space-x-2 mt-1">
                  <p className="text-slate-400">Ready to continue your learning journey?</p>
                  <RoleBadge role={userRole} />
                </div>
              </div>
            </div>
            <UserButton afterSignOutUrl="/" />
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="bg-slate-800/50 border-slate-700 text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-blue-400 mb-2">{stats.totalRoadmaps}</div>
                  <div className="text-slate-400 text-sm">Available Roadmaps</div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-slate-800/50 border-slate-700 text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-orange-400 mb-2">{stats.inProgress}</div>
                  <div className="text-slate-400 text-sm">In Progress</div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="bg-slate-800/50 border-slate-700 text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-green-400 mb-2">{stats.completed}</div>
                  <div className="text-slate-400 text-sm">Completed</div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="bg-slate-800/50 border-slate-700 text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-purple-400 mb-2">{stats.created}</div>
                  <div className="text-slate-400 text-sm">Created by You</div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {getQuickActions().map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <QuickActionCard {...action} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmaps Grid */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Your Learning Paths</h2>
            <Button 
              onClick={() => navigate('/dashboard')}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              View All
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roadmaps.slice(0, 6).map((roadmap, index) => (
              <RoadmapCard
                key={roadmap._id}
                roadmap={roadmap}
                progress={getProgressForRoadmap(roadmap._id)}
                index={index}
                userRole={userRole}
                userId={user?.id}
                onEdit={handleEditRoadmap}
                onDelete={handleDeleteRoadmap}
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
