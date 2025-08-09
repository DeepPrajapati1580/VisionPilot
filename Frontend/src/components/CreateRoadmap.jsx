import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, X, Save, BookOpen, Tag, FileText, Layers, ExternalLink, Trash2, AlertCircle, Crown, Edit } from 'lucide-react';
import { Button } from "./UI/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./UI/card";
import { Badge } from "./UI/badge";
import Header from "./Header";
import Footer from "./Footer";
import api from "../api";

// Step Form Component
function StepForm({ step, index, onUpdate, onRemove, canRemove }) {
  const [resources, setResources] = useState(step.resources || []);
  const [newResource, setNewResource] = useState("");

  const handleStepChange = (field, value) => {
    const updatedStep = { ...step, [field]: value };
    if (field === 'resources') {
      updatedStep.resources = value;
    }
    onUpdate(index, updatedStep);
  };

  const addResource = () => {
    if (newResource.trim()) {
      const updatedResources = [...resources, newResource.trim()];
      setResources(updatedResources);
      handleStepChange('resources', updatedResources);
      setNewResource("");
    }
  };

  const removeResource = (resourceIndex) => {
    const updatedResources = resources.filter((_, i) => i !== resourceIndex);
    setResources(updatedResources);
    handleStepChange('resources', updatedResources);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                {index + 1}
              </div>
              <h3 className="text-lg font-semibold text-white">Step {index + 1}</h3>
            </div>
            {canRemove && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(index)}
                className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Step Title */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Step Title *
            </label>
            <input
              type="text"
              value={step.title || ""}
              onChange={(e) => handleStepChange('title', e.target.value)}
              placeholder="e.g., Learn HTML & CSS Basics"
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Step Description */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description
            </label>
            <textarea
              value={step.description || ""}
              onChange={(e) => handleStepChange('description', e.target.value)}
              placeholder="Describe what the learner will accomplish in this step..."
              rows={3}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Resources */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Learning Resources
            </label>
            
            {/* Existing Resources */}
            {resources.length > 0 && (
              <div className="space-y-2 mb-3">
                {resources.map((resource, resourceIndex) => (
                  <div key={resourceIndex} className="flex items-center space-x-2 bg-slate-700/50 rounded-lg p-2">
                    <ExternalLink className="h-4 w-4 text-blue-400 flex-shrink-0" />
                    <span className="text-sm text-slate-300 flex-1 truncate">{resource}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeResource(resourceIndex)}
                      className="text-red-400 hover:text-red-300 h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Resource */}
            <div className="flex space-x-2">
              <input
                type="url"
                value={newResource}
                onChange={(e) => setNewResource(e.target.value)}
                placeholder="https://example.com/tutorial"
                className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Button
                type="button"
                onClick={addResource}
                disabled={!newResource.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Main Create Roadmap Component
export default function CreateRoadmap() {
  const navigate = useNavigate();
  const { user, isSignedIn } = useUser();
  
  const [userRole, setUserRole] = useState(null);
  const [checkingRole, setCheckingRole] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    tags: [],
    steps: [{ title: "", description: "", resources: [] }]
  });
  
  const [newTag, setNewTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Predefined categories
  const categories = [
    "Frontend", "Backend", "DevOps", "Data", "AI/ML", "AI/LLM", 
    "Mobile", "Security", "Blockchain", "GameDev", "Cloud", "Other"
  ];

  // Check user role on component mount
  useEffect(() => {
    const checkUserRole = async () => {
      if (!isSignedIn) {
        setCheckingRole(false);
        return;
      }

      try {
        console.log("🔍 Checking user role...");
        const response = await api.get("/auth/profile");
        const role = response.data.role;
        console.log("👤 User role:", role);
        setUserRole(role);
        
        // Check if user has permission to create roadmaps
        if (role !== 'editor' && role !== 'admin') {
          setError(`Access denied. Only Content Creators and Administrators can create roadmaps. Your current role: ${role}`);
        }
      } catch (err) {
        console.error("❌ Error checking user role:", err);
        setError("Failed to verify your permissions. Please try refreshing the page.");
      } finally {
        setCheckingRole(false);
      }
    };

    checkUserRole();
  }, [isSignedIn]);

  // Handle form field changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  // Handle tag management
  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagIndex) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== tagIndex)
    }));
  };

  // Handle step management
  const addStep = () => {
    setFormData(prev => ({
      ...prev,
      steps: [...prev.steps, { title: "", description: "", resources: [] }]
    }));
  };

  const updateStep = (stepIndex, updatedStep) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) => i === stepIndex ? updatedStep : step)
    }));
  };

  const removeStep = (stepIndex) => {
    if (formData.steps.length > 1) {
      setFormData(prev => ({
        ...prev,
        steps: prev.steps.filter((_, i) => i !== stepIndex)
      }));
    }
  };

  // Form validation
  const validateForm = () => {
    console.log("🔍 Validating form data:", formData);
    
    if (!formData.title.trim()) {
      setError("Roadmap title is required");
      return false;
    }
    if (!formData.description.trim()) {
      setError("Roadmap description is required");
      return false;
    }
    if (!formData.category) {
      setError("Please select a category");
      return false;
    }
    if (formData.steps.length === 0) {
      setError("At least one step is required");
      return false;
    }
    if (formData.steps.some(step => !step.title.trim())) {
      setError("All steps must have a title");
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log("📝 Attempting to create roadmap...");
    console.log("👤 User:", user);
    console.log("🔐 User role:", userRole);
    console.log("📋 Form data:", formData);

    if (!isSignedIn) {
      setError("You must be signed in to create a roadmap");
      return;
    }

    if (userRole !== 'editor' && userRole !== 'admin') {
      setError(`Access denied. Only Content Creators and Administrators can create roadmaps. Your current role: ${userRole}`);
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Clean up the data before sending
      const roadmapData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        tags: formData.tags.filter(tag => tag.trim().length > 0),
        steps: formData.steps.map(step => ({
          title: step.title.trim(),
          description: step.description?.trim() || "",
          resources: step.resources?.filter(resource => resource.trim().length > 0) || []
        }))
      };

      console.log("📤 Sending roadmap data:", roadmapData);

      const response = await api.post("/roadmaps", roadmapData);
      
      console.log("✅ Roadmap created successfully:", response.data);
      setSuccess(true);
      
      setTimeout(() => {
        navigate(`/roadmap/${response.data._id}`);
      }, 2000);

    } catch (err) {
      console.error("❌ Error creating roadmap:", err);
      
      let errorMessage = "Failed to create roadmap";
      
      if (err.response) {
        console.error("Response data:", err.response.data);
        console.error("Response status:", err.response.status);
        
        if (err.response.status === 403) {
          errorMessage = err.response.data.message || "Access denied. You don't have permission to create roadmaps.";
        } else if (err.response.status === 401) {
          errorMessage = "Authentication failed. Please sign in again.";
        } else if (err.response.status === 400) {
          errorMessage = err.response.data.error || "Invalid data provided. Please check your inputs.";
        } else if (err.response.data?.error) {
          errorMessage = err.response.data.error;
        }
      } else if (err.request) {
        errorMessage = "Network error. Please check your connection and try again.";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking role
  if (checkingRole) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Checking your permissions...</p>
        </div>
      </div>
    );
  }

  // Redirect if not signed in
  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Card className="bg-slate-800 border-slate-700 p-8 text-center max-w-md">
          <CardContent>
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-4">Sign In Required</h2>
            <p className="text-slate-400 mb-6">You need to be signed in to create a roadmap.</p>
            <Button onClick={() => navigate('/login')} className="bg-blue-600 hover:bg-blue-700">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show access denied if user doesn't have permission
  if (userRole && userRole !== 'editor' && userRole !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Card className="bg-slate-800 border-slate-700 p-8 text-center max-w-md">
          <CardContent>
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-4">Access Denied</h2>
            <p className="text-slate-400 mb-4">
              Only Content Creators and Administrators can create roadmaps.
            </p>
            <div className="mb-6">
              <Badge className="bg-slate-700 text-slate-300">
                Your current role: {userRole}
              </Badge>
            </div>
            <div className="space-y-2">
              <Button onClick={() => navigate('/dashboard')} className="bg-blue-600 hover:bg-blue-700 w-full">
                Go to Dashboard
              </Button>
              <Button 
                onClick={() => navigate('/contact')} 
                variant="outline" 
                className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white w-full"
              >
                Request Role Change
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')}
              className="text-slate-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">Create New Roadmap</h1>
              <div className="flex items-center space-x-2 mt-1">
                <p className="text-slate-400">Share your knowledge and help others learn</p>
                {userRole === 'admin' && (
                  <Badge className="bg-red-900/30 text-red-300 border-red-700">
                    <Crown className="h-3 w-3 mr-1" />
                    Administrator
                  </Badge>
                )}
                {userRole === 'editor' && (
                  <Badge className="bg-blue-900/30 text-blue-300 border-blue-700">
                    <Edit className="h-3 w-3 mr-1" />
                    Content Creator
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-900/20 border border-green-700 rounded-lg p-4 mb-6"
          >
            <div className="flex items-center space-x-2 text-green-400">
              <BookOpen className="h-5 w-5" />
              <span className="font-medium">Roadmap created successfully! Redirecting...</span>
            </div>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-900/20 border border-red-700 rounded-lg p-4 mb-6"
          >
            <div className="flex items-center space-x-2 text-red-400">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Basic Information
              </CardTitle>
              <CardDescription className="text-slate-400">
                Provide the essential details about your roadmap
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Roadmap Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., Complete Frontend Developer Roadmap"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe what learners will achieve by following this roadmap..."
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Tag className="h-5 w-5 mr-2" />
                Tags
              </CardTitle>
              <CardDescription className="text-slate-400">
                Add relevant tags to help people discover your roadmap
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Existing Tags */}
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} className="bg-blue-900/30 text-blue-300 border-blue-700">
                      {tag}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTag(index)}
                        className="ml-2 h-4 w-4 p-0 text-blue-300 hover:text-blue-200"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}

              {/* Add New Tag */}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Add a tag (e.g., javascript, react, beginner)"
                  className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Button
                  type="button"
                  onClick={addTag}
                  disabled={!newTag.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Steps */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Layers className="h-5 w-5 mr-2" />
                Learning Steps
              </CardTitle>
              <CardDescription className="text-slate-400">
                Break down the learning journey into manageable steps
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {formData.steps.map((step, index) => (
                <StepForm
                  key={index}
                  step={step}
                  index={index}
                  onUpdate={updateStep}
                  onRemove={removeStep}
                  canRemove={formData.steps.length > 1}
                />
              ))}

              <Button
                type="button"
                onClick={addStep}
                variant="outline"
                className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Step
              </Button>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || (userRole !== 'editor' && userRole !== 'admin')}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Creating...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Save className="h-4 w-4" />
                  <span>Create Roadmap</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}
