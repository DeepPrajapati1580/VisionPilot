import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, SignInButton } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { ArrowRight, Code, Database, Cloud, BookOpen, Cpu, Smartphone, Shield, Gamepad2, Users, Star, TrendingUp, Play } from 'lucide-react';
import { Button } from "./UI/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./UI/card";
import { Badge } from "./UI/badge";
import Header from "./Header";
import Footer from "./Footer";
import api from "../api";

// Roadmap Card Component
function RoadmapCard({ roadmap, index }) {
  const getCategoryIcon = (category) => {
    const icons = {
      'Frontend': <Code className="h-6 w-6" />,
      'Backend': <Database className="h-6 w-6" />,
      'DevOps': <Cloud className="h-6 w-6" />,
      'Data': <BookOpen className="h-6 w-6" />,
      'AI/ML': <Cpu className="h-6 w-6" />,
      'AI/LLM': <Cpu className="h-6 w-6" />,
      'Mobile': <Smartphone className="h-6 w-6" />,
      'Security': <Shield className="h-6 w-6" />,
      'Blockchain': <Code className="h-6 w-6" />,
      'GameDev': <Gamepad2 className="h-6 w-6" />,
      'Cloud': <Cloud className="h-6 w-6" />
    };
    return icons[category] || <Code className="h-6 w-6" />;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Frontend': 'from-blue-500 to-blue-600',
      'Backend': 'from-green-500 to-green-600',
      'DevOps': 'from-yellow-500 to-yellow-600',
      'Data': 'from-purple-500 to-purple-600',
      'AI/ML': 'from-pink-500 to-pink-600',
      'AI/LLM': 'from-orange-500 to-orange-600',
      'Mobile': 'from-cyan-500 to-cyan-600',
      'Security': 'from-red-500 to-red-600',
      'Blockchain': 'from-lime-500 to-lime-600',
      'GameDev': 'from-indigo-500 to-indigo-600',
      'Cloud': 'from-teal-500 to-teal-600'
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between mb-3">
            <div className={`p-3 rounded-xl bg-gradient-to-r ${getCategoryColor(roadmap.category)} text-white shadow-lg`}>
              {getCategoryIcon(roadmap.category)}
            </div>
            <Badge variant="secondary" className="bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300">
              {roadmap.category}
            </Badge>
          </div>
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {roadmap.title}
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-slate-400 line-clamp-3">
            {roadmap.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center text-gray-500 dark:text-slate-400 text-sm">
              <BookOpen className="h-4 w-4 mr-2" />
              {roadmap.steps?.length || 0} steps
            </div>
            <div className="flex items-center text-gray-500 dark:text-slate-400 text-sm">
              <Users className="h-4 w-4 mr-2" />
              {Math.floor(Math.random() * 1000) + 100}+ learners
            </div>
          </div>
          
          {roadmap.tags && roadmap.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {roadmap.tags.slice(0, 3).map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className="px-2 py-1 text-xs bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 rounded-full"
                >
                  {tag}
                </span>
              ))}
              {roadmap.tags.length > 3 && (
                <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400 rounded-full">
                  +{roadmap.tags.length - 3} more
                </span>
              )}
            </div>
          )}

          <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
            <Play className="h-4 w-4 mr-2" />
            Start Learning
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Stats Card Component
function StatsCard({ icon, title, value, description }) {
  return (
    <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
            {icon}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
            <p className="text-sm font-medium text-gray-600 dark:text-slate-400">{title}</p>
            <p className="text-xs text-gray-500 dark:text-slate-500">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Main HomePage Component
export default function HomePage() {
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [featuredRoadmaps, setFeaturedRoadmaps] = useState([]);

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const response = await api.get("/roadmaps");
        setRoadmaps(response.data);
        // Set featured roadmaps (first 6)
        setFeaturedRoadmaps(response.data.slice(0, 6));
      } catch (error) {
        console.error("Error fetching roadmaps:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmaps();
  }, []);

  const handleGetStarted = () => {
    if (isSignedIn) {
      navigate('/dashboard');
    }
  };

  const stats = [
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Learning Paths",
      value: roadmaps.length,
      description: "Curated roadmaps"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Active Learners",
      value: "10K+",
      description: "Growing community"
    },
    {
      icon: <Star className="h-6 w-6" />,
      title: "Success Rate",
      value: "95%",
      description: "Completion rate"
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Career Growth",
      value: "3x",
      description: "Average salary increase"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-slate-400">Loading roadmaps...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Master Your
              </span>
              <br />
              <span className="text-gray-900 dark:text-white">
                Developer Journey
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-slate-400 max-w-3xl mx-auto mb-8 leading-relaxed">
              Discover curated learning paths, track your progress, and accelerate your career 
              with our comprehensive developer roadmaps designed by industry experts.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              {isSignedIn ? (
                <Button 
                  size="lg" 
                  onClick={handleGetStarted}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-4"
                >
                  Go to Dashboard
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              ) : (
                <SignInButton mode="modal">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-4"
                  >
                    Start Learning Free
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </SignInButton>
              )}
              <Button 
                variant="outline" 
                size="lg"
                className="text-lg px-8 py-4 border-gray-300 dark:border-slate-600"
              >
                Explore Roadmaps
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 dark:bg-slate-800/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <StatsCard {...stat} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Roadmaps Section */}
      <section id="roadmaps" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Learning Paths
            </h2>
            <p className="text-xl text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
              Start your journey with our most popular and comprehensive roadmaps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredRoadmaps.map((roadmap, index) => (
              <RoadmapCard key={roadmap._id} roadmap={roadmap} index={index} />
            ))}
          </div>

          <div className="text-center mt-12">
            {isSignedIn ? (
              <Button 
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-4"
              >
                View All Roadmaps
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            ) : (
              <SignInButton mode="modal">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-4">
                  Sign Up to Access All
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </SignInButton>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white/50 dark:bg-slate-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose VisionPilot?
            </h2>
            <p className="text-xl text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
              Everything you need to accelerate your developer career
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <BookOpen className="h-8 w-8" />,
                title: "Curated Content",
                description: "Expert-designed roadmaps with step-by-step guidance and resources"
              },
              {
                icon: <TrendingUp className="h-8 w-8" />,
                title: "Track Progress",
                description: "Monitor your learning journey and celebrate milestones"
              },
              {
                icon: <Users className="h-8 w-8" />,
                title: "Community Support",
                description: "Connect with fellow learners and get help when you need it"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <Card className="text-center p-8 bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl text-white mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-slate-400">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-12 text-white"
          >
            <h2 className="text-4xl font-bold mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of developers who are already advancing their careers
            </p>
            {isSignedIn ? (
              <Button 
                size="lg" 
                onClick={handleGetStarted}
                className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4"
              >
                Go to Dashboard
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            ) : (
              <SignInButton mode="modal">
                <Button 
                  size="lg" 
                  className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4"
                >
                  Get Started Free
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </SignInButton>
            )}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
