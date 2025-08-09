import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SignInButton } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { ArrowRight, Code, Database, Cloud, BookOpen, Cpu, Smartphone, Shield, Gamepad2, Users, Star, TrendingUp, Play, CheckCircle, Zap, Target, Award } from 'lucide-react';
import { Button } from "./UI/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./UI/card";
import { Badge } from "./UI/badge";
import Header from "./Header";
import Footer from "./Footer";
import api from "../api";

// Feature Card Component
function FeatureCard({ icon, title, description, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all duration-300 h-full">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            {icon}
          </div>
          <CardTitle className="text-white text-lg">{title}</CardTitle>
          <CardDescription className="text-slate-400">{description}</CardDescription>
        </CardHeader>
      </Card>
    </motion.div>
  );
}

// Roadmap Preview Card
function RoadmapPreviewCard({ roadmap, index }) {
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

export default function PublicHome() {
  const navigate = useNavigate();
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const response = await api.get("/roadmaps");
        // Show only first 6 roadmaps for preview
        setRoadmaps(response.data.slice(0, 6));
      } catch (error) {
        console.error("Error fetching roadmaps:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmaps();
  }, []);

  const features = [
    {
      icon: <Target className="h-6 w-6 text-white" />,
      title: "Structured Learning Paths",
      description: "Follow step-by-step roadmaps designed by industry experts"
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-white" />,
      title: "Track Your Progress",
      description: "Monitor your learning journey and celebrate milestones"
    },
    {
      icon: <Users className="h-6 w-6 text-white" />,
      title: "Community Driven",
      description: "Learn from and contribute to a growing developer community"
    },
    {
      icon: <Zap className="h-6 w-6 text-white" />,
      title: "Interactive Experience",
      description: "Engage with hands-on projects and real-world examples"
    },
    {
      icon: <Award className="h-6 w-6 text-white" />,
      title: "Skill Validation",
      description: "Earn recognition for completing learning milestones"
    },
    {
      icon: <BookOpen className="h-6 w-6 text-white" />,
      title: "Curated Resources",
      description: "Access the best tutorials, docs, and learning materials"
    }
  ];

  const stats = [
    { number: "50+", label: "Learning Roadmaps" },
    { number: "10K+", label: "Active Learners" },
    { number: "500+", label: "Skills Covered" },
    { number: "95%", label: "Success Rate" }
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />

      {/* Hero Section */}
      <section className="py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Master Your
              </span>
              <br />
              <span className="text-white">Developer Journey</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-8 leading-relaxed">
              VisionPilot provides structured learning paths, expert guidance, and a supportive community 
              to help you become the developer you aspire to be.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <SignInButton mode="modal">
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-4">
                  Start Learning Free
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </SignInButton>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => navigate('/roadmap/675b8c5e123456789abcdef0')} // Example roadmap ID
                className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white text-lg px-8 py-4"
              >
                Explore Roadmaps
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-slate-400 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-800/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Choose VisionPilot?
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Everything you need to accelerate your development career in one platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Roadmaps Preview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Popular Learning Paths
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Start with these community-favorite roadmaps
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-slate-400">Loading roadmaps...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {roadmaps.map((roadmap, index) => (
                <RoadmapPreviewCard key={roadmap._id} roadmap={roadmap} index={index} />
              ))}
            </div>
          )}

          <div className="text-center">
            <SignInButton mode="modal">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                View All Roadmaps
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </SignInButton>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Career?
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
              Join thousands of developers who have accelerated their careers with VisionPilot
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <SignInButton mode="modal">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4">
                  Get Started Free
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </SignInButton>
              <div className="flex items-center text-blue-100">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span>No credit card required</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
