// src/components/RoadmapStats.jsx
import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, Users, BookOpen, Award, Clock, Target } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./UI/card";
import { Progress } from "./UI/progress";
import { Badge } from "./UI/badge";

export default function RoadmapStats({ 
  roadmaps = [], 
  userProgress = [], 
  totalUsers = 0,
  className = "" 
}) {
  // Calculate statistics
  const totalRoadmaps = roadmaps.length;
  const completedRoadmaps = userProgress.filter(p => p.completedSteps?.length > 0).length;
  const totalSteps = roadmaps.reduce((acc, roadmap) => acc + (roadmap.steps?.length || 0), 0);
  const completedSteps = userProgress.reduce((acc, progress) => acc + (progress.completedSteps?.length || 0), 0);
  
  const overallProgress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
  const averageCompletion = totalRoadmaps > 0 ? Math.round((completedRoadmaps / totalRoadmaps) * 100) : 0;

  // Get category distribution
  const categoryStats = roadmaps.reduce((acc, roadmap) => {
    const category = roadmap.category || 'Other';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  const topCategories = Object.entries(categoryStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  // Recent activity (mock data for now)
  const recentActivity = [
    { action: "Completed", item: "JavaScript Fundamentals", time: "2 hours ago" },
    { action: "Started", item: "React Components", time: "1 day ago" },
    { action: "Achieved", item: "Frontend Milestone", time: "3 days ago" },
  ];

  const stats = [
    {
      title: "Total Roadmaps",
      value: totalRoadmaps,
      description: "Available learning paths",
      icon: <BookOpen className="h-5 w-5" />,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20"
    },
    {
      title: "Your Progress",
      value: `${overallProgress}%`,
      description: "Overall completion",
      icon: <TrendingUp className="h-5 w-5" />,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20"
    },
    {
      title: "Completed",
      value: completedRoadmaps,
      description: "Roadmaps finished",
      icon: <Award className="h-5 w-5" />,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20"
    },
    {
      title: "Community",
      value: `${totalUsers}+`,
      description: "Active learners",
      icon: <Users className="h-5 w-5" />,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/20"
    }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-slate-400">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-slate-500">
                      {stat.description}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <div className={stat.color}>
                      {stat.icon}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overall Progress */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
                <Target className="h-5 w-5" />
                <span>Learning Progress</span>
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-slate-400">
                Your overall progress across all roadmaps
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-slate-400">Overall Completion</span>
                  <span className="font-medium text-gray-900 dark:text-white">{overallProgress}%</span>
                </div>
                <Progress value={overallProgress} className="h-2" />
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{completedSteps}</p>
                  <p className="text-xs text-gray-500 dark:text-slate-500">Steps Completed</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalSteps - completedSteps}</p>
                  <p className="text-xs text-gray-500 dark:text-slate-500">Steps Remaining</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
                <BookOpen className="h-5 w-5" />
                <span>Popular Categories</span>
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-slate-400">
                Distribution of available roadmaps by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topCategories.map(([category, count], index) => (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="bg-gray-100 dark:bg-slate-700">
                        {category}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(count / totalRoadmaps) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white w-8 text-right">
                        {count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
              <Clock className="h-5 w-5" />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-slate-400">
              Your latest learning milestones and achievements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 rounded-lg bg-gray-50 dark:bg-slate-700/50">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Award className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.action} <span className="text-blue-600 dark:text-blue-400">{activity.item}</span>
                    </p>
                    <p className="text-xs text-gray-500 dark:text-slate-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
