import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useUser, SignInButton } from "@clerk/clerk-react";
import { ArrowLeft, Code, Users, Target, Zap, Heart, Globe, Award, BookOpen, TrendingUp, Star, CheckCircle } from 'lucide-react';
import { Button } from "./UI/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./UI/card";
import { Badge } from "./UI/badge";
import Header from "./Header";
import Footer from "./Footer";

// Team Member Card Component
function TeamMemberCard({ member, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="text-center bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
            {member.name ? member.name.charAt(0) : 'U'}
          </div>
          <CardTitle className="text-gray-900 dark:text-white">{member.name}</CardTitle>
          <CardDescription className="text-gray-600 dark:text-slate-400">{member.role}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 dark:text-slate-400 mb-4">
            {member.description}
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {member.skills.map((skill, skillIndex) => (
              <Badge key={skillIndex} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Feature Card Component
function FeatureCard({ feature, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="h-full bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white mb-4">
            {feature.icon}
          </div>
          <CardTitle className="text-gray-900 dark:text-white">{feature.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-slate-400">
            {feature.description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Stats Card Component
function StatsCard({ stat, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <CardContent className="p-6">
          <div className="text-3xl font-bold mb-2">{stat.value}</div>
          <div className="text-sm opacity-90">{stat.label}</div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Main About Component
export default function About() {
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();

  // Single team member - Deep Prajapati
  const teamMembers = [
    {
      name: "Deep Prajapati",
      role: "Founder & Full-Stack Developer",
      description: "Passionate developer and educator dedicated to creating comprehensive learning paths for the developer community. Built VisionPilot from the ground up with a vision to democratize developer education.",
      skills: ["Full-Stack Development", "React", "Node.js", "MongoDB", "UI/UX Design", "Developer Education", "Product Strategy"]
    }
  ];

  const features = [
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Expert-Curated Content",
      description: "Our roadmaps are designed by industry experts and updated regularly to reflect current best practices and emerging technologies."
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Goal-Oriented Learning",
      description: "Each roadmap is structured with clear milestones and objectives to help you track progress and stay motivated."
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Community-Driven",
      description: "Join a thriving community of developers sharing knowledge, experiences, and supporting each other's growth."
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Interactive Experience",
      description: "Engage with 3D visualizations, progress tracking, and interactive elements that make learning enjoyable."
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Global Accessibility",
      description: "Available worldwide with multi-language support and resources accessible to developers everywhere."
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Industry Recognition",
      description: "Our roadmaps are trusted by top tech companies and have helped launch thousands of successful careers."
    }
  ];

  const stats = [
    { value: "50K+", label: "Active Learners" },
    { value: "25+", label: "Learning Paths" },
    { value: "95%", label: "Success Rate" },
    { value: "150+", label: "Countries" }
  ];

  const milestones = [
    {
      year: "2023",
      title: "VisionPilot Founded",
      description: "Deep Prajapati started with a vision to democratize developer education and create clear learning paths for aspiring developers."
    },
    {
      year: "2023",
      title: "First Roadmaps Launched",
      description: "Released the initial set of comprehensive roadmaps for Frontend, Backend, and DevOps development paths."
    },
    {
      year: "2024",
      title: "Community Growth",
      description: "Reached significant milestones in user engagement and expanded to include AI/ML and mobile development paths."
    },
    {
      year: "2024",
      title: "Platform Enhancement",
      description: "Introduced 3D visualizations, progress tracking, and interactive learning features to enhance the user experience."
    }
  ];

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
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                About VisionPilot
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-slate-400 max-w-3xl mx-auto mb-8 leading-relaxed">
              We're on a mission to democratize developer education by providing clear, 
              actionable roadmaps that guide your learning journey from beginner to expert.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white/50 dark:bg-slate-800/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl text-white mb-6">
                <Heart className="h-8 w-8" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 dark:text-slate-400 leading-relaxed mb-8">
                Every developer deserves a clear path to success. We believe that with the right guidance, 
                resources, and community support, anyone can master the skills needed to build amazing things. 
                VisionPilot exists to remove the confusion from learning and provide structured, 
                expert-validated roadmaps that accelerate your growth.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Clarity</h3>
                  <p className="text-sm text-gray-600 dark:text-slate-400">
                    Clear, step-by-step guidance without overwhelming complexity
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Community</h3>
                  <p className="text-sm text-gray-600 dark:text-slate-400">
                    A supportive community of learners and mentors
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Growth</h3>
                  <p className="text-sm text-gray-600 dark:text-slate-400">
                    Continuous improvement and career advancement
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Our Impact
            </h2>
            <p className="text-lg text-gray-600 dark:text-slate-400">
              Numbers that reflect our commitment to developer success
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <StatsCard key={index} stat={stat} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white/50 dark:bg-slate-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              What Makes Us Different
            </h2>
            <p className="text-lg text-gray-600 dark:text-slate-400">
              Features designed to accelerate your learning journey
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Our Journey
            </h2>
            <p className="text-lg text-gray-600 dark:text-slate-400">
              Key milestones in building VisionPilot
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="flex items-start space-x-4 mb-8"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {milestone.year.slice(-2)}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {milestone.title}
                  </h3>
                  <p className="text-gray-600 dark:text-slate-400">
                    {milestone.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section - Single Member */}
      <section className="py-16 bg-white/50 dark:bg-slate-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Meet the Creator
            </h2>
            <p className="text-lg text-gray-600 dark:text-slate-400">
              The passionate developer behind VisionPilot
            </p>
          </div>
          <div className="flex justify-center">
            <div className="max-w-md">
              {teamMembers.map((member, index) => (
                <TeamMemberCard key={index} member={member} index={index} />
              ))}
            </div>
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
              Join our community and take the first step towards mastering your craft
            </p>
            {isSignedIn ? (
              <Button 
                size="lg" 
                onClick={() => navigate('/dashboard')}
                className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4"
              >
                Go to Dashboard
              </Button>
            ) : (
              <SignInButton mode="modal">
                <Button 
                  size="lg" 
                  className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4"
                >
                  Get Started Free
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
