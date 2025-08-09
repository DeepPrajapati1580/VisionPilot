import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, CheckCircle, Clock, ExternalLink, Play, Users, Star, Target, Award, Calendar, TrendingUp } from 'lucide-react';
import { Button } from "./UI/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./UI/card";
import { Badge } from "./UI/badge";
import { Progress } from "./UI/progress";
import Header from "./Header";
import Footer from "./Footer";
import api from "../api";

// Step Component
function RoadmapStep({ step, index, isCompleted, onToggleComplete, canEdit = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`bg-slate-800 rounded-lg p-6 border-l-4 transition-all duration-300 ${
        isCompleted 
          ? 'border-green-500 shadow-lg' 
          : 'border-slate-600 hover:border-blue-400'
      }`}
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <button
            onClick={() => canEdit && onToggleComplete(index)}
            disabled={!canEdit}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-medium transition-all duration-200 ${
              isCompleted 
                ? 'bg-green-500 hover:bg-green-600' 
                : 'bg-slate-600 hover:bg-blue-500'
            } ${canEdit ? 'cursor-pointer' : 'cursor-default'}`}
          >
            {isCompleted ? <CheckCircle className="h-5 w-5" /> : index + 1}
          </button>
        </div>
        
        <div className="flex-1">
          <h3 className={`text-lg font-semibold mb-2 ${
            isCompleted 
              ? 'text-green-300' 
              : 'text-white'
          }`}>
            {step.title}
          </h3>
          
          {step.description && (
            <p className="text-slate-400 mb-4 leading-relaxed">
              {step.description}
            </p>
          )}
          
          {step.resources && step.resources.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-slate-300 mb-2">
                Resources:
              </h4>
              <div className="flex flex-wrap gap-2">
                {step.resources.map((resource, resourceIndex) => (
                  <a
                    key={resourceIndex}
                    href={resource}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1 bg-blue-900/30 text-blue-400 rounded-full text-sm hover:bg-blue-900/50 transition-colors"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Resource {resourceIndex + 1}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Progress Stats Component
function ProgressStats({ roadmap, userProgress, completionPercentage }) {
  const stats = [
    {
      icon: <BookOpen className="h-5 w-5" />,
      label: "Total Steps",
      value: roadmap.steps?.length || 0,
      color: "text-blue-400"
    },
    {
      icon: <CheckCircle className="h-5 w-5" />,
      label: "Completed",
      value: userProgress?.completedSteps?.length || 0,
      color: "text-green-400"
    },
    {
      icon: <Clock className="h-5 w-5" />,
      label: "Remaining",
      value: (roadmap.steps?.length || 0) - (userProgress?.completedSteps?.length || 0),
      color: "text-orange-400"
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      label: "Progress",
      value: `${completionPercentage}%`,
      color: "text-purple-400"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className="text-center bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-700 ${stat.color} mb-2`}>
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

// Main RoadmapView Component
export default function RoadmapView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isSignedIn } = useUser();
  
  const [roadmap, setRoadmap] = useState(null);
  const [userProgress, setUserProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchRoadmapData = async () => {
      try {
        setLoading(true);
        
        // Fetch roadmap details
        const roadmapResponse = await api.get(`/roadmaps/${id}`);
        setRoadmap(roadmapResponse.data);
        
        // Fetch user progress if signed in
        if (isSignedIn) {
          try {
            const progressResponse = await api.get(`/progress/roadmap/${id}`);
            setUserProgress(progressResponse.data);
          } catch (progressError) {
            // Progress might not exist yet, that's okay
            console.log("No progress found for this roadmap");
          }
        }
        
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load roadmap");
        console.error("Error fetching roadmap:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRoadmapData();
    }
  }, [id, isSignedIn]);

  const completionPercentage = React.useMemo(() => {
    if (!userProgress || !roadmap?.steps) return 0;
    return Math.round((userProgress.completedSteps.length / roadmap.steps.length) * 100);
  }, [userProgress, roadmap]);

  const handleToggleStep = async (stepIndex) => {
    if (!isSignedIn || updating) return;

    try {
      setUpdating(true);
      
      const currentCompleted = userProgress?.completedSteps || [];
      const isCompleted = currentCompleted.includes(stepIndex);
      
      let newCompletedSteps;
      if (isCompleted) {
        // Remove step from completed
        newCompletedSteps = currentCompleted.filter(step => step !== stepIndex);
      } else {
        // Add step to completed
        newCompletedSteps = [...currentCompleted, stepIndex].sort((a, b) => a - b);
      }

      // Update progress
      const response = await api.post('/progress', {
        roadmap: id,
        completedSteps: newCompletedSteps
      });

      setUserProgress(response.data);
      
    } catch (err) {
      console.error("Error updating progress:", err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading roadmap...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <BookOpen className="h-12 w-12 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">
            Roadmap Not Found
          </h2>
          <p className="text-slate-400 mb-4">{error}</p>
          <Button onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (!roadmap) return null;

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/dashboard')}
          className="mb-6 text-slate-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Header Section */}
        <div className="bg-slate-800 rounded-xl shadow-sm border border-slate-700 p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <Badge className="bg-blue-900/30 text-blue-300 border-blue-700">
                  {roadmap.category}
                </Badge>
                <div className="flex items-center text-slate-400 text-sm">
                  <Users className="h-4 w-4 mr-1" />
                  {Math.floor(Math.random() * 1000) + 100}+ learners
                </div>
              </div>
              
              <h1 className="text-4xl font-bold text-white mb-4">
                {roadmap.title}
              </h1>
              
              <p className="text-lg text-slate-400 leading-relaxed mb-6">
                {roadmap.description}
              </p>

              {roadmap.tags && roadmap.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {roadmap.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col space-y-3 md:ml-8">
              {isSignedIn ? (
                <>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Play className="h-4 w-4 mr-2" />
                    {userProgress ? 'Continue Learning' : 'Start Learning'}
                  </Button>
                  {userProgress && completionPercentage === 100 && (
                    <div className="flex items-center justify-center text-green-400">
                      <Award className="h-5 w-5 mr-2" />
                      <span className="font-medium">Completed!</span>
                    </div>
                  )}
                </>
              ) : (
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Sign In to Start Learning
                </Button>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          {isSignedIn && userProgress && (
            <div className="mt-6 pt-6 border-t border-slate-700">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-300">
                  Your Progress
                </span>
                <span className="text-sm font-medium text-white">
                  {completionPercentage}%
                </span>
              </div>
              <Progress value={completionPercentage} className="h-3" />
            </div>
          )}
        </div>

        {/* Progress Stats */}
        {isSignedIn && (
          <ProgressStats 
            roadmap={roadmap} 
            userProgress={userProgress} 
            completionPercentage={completionPercentage} 
          />
        )}

        {/* Learning Steps */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            Learning Path
          </h2>
          
          <div className="space-y-6">
            {roadmap.steps?.map((step, index) => (
              <div key={index} id={`step-${index}`}>
                <RoadmapStep
                  step={step}
                  index={index}
                  isCompleted={userProgress?.completedSteps?.includes(index) || false}
                  onToggleComplete={handleToggleStep}
                  canEdit={isSignedIn && !updating}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        {!isSignedIn && (
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to Start Learning?</h3>
              <p className="text-lg mb-6 opacity-90">
                Sign up to track your progress and unlock all features
              </p>
              <Button className="bg-white text-blue-600 hover:bg-gray-100">
                Get Started Free
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
}
