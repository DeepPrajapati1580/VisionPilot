import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import {
  ArrowLeft, Plus, X, Save, BookOpen, Tag, FileText, Layers,
  ExternalLink, Trash2, AlertCircle, Crown, Edit, Globe, Lock
} from "lucide-react";
import { Button } from "./UI/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./UI/card";
import { Badge } from "./UI/badge";
import Header from "./Header";
import Footer from "./Footer";
import api from "../api";

/* ------------------------------
 * StepForm (Child Component)
 * ------------------------------ */
function StepForm({ step, index, onUpdate, onRemove, canRemove }) {
  const [resources, setResources] = useState(step.resources || []);
  const [newResource, setNewResource] = useState("");

  const handleStepChange = (field, value) => {
    const updatedStep = { ...step, [field]: value };
    if (field === "resources") {
      updatedStep.resources = value;
    }
    onUpdate(index, updatedStep);
  };

  const addResource = () => {
    if (newResource.trim()) {
      const updatedResources = [...resources, newResource.trim()];
      setResources(updatedResources);
      handleStepChange("resources", updatedResources);
      setNewResource("");
    }
  };

  const removeResource = (resourceIndex) => {
    const updatedResources = resources.filter((_, i) => i !== resourceIndex);
    setResources(updatedResources);
    handleStepChange("resources", updatedResources);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
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
            <label className="block text-sm font-medium text-slate-300 mb-2">Step Title *</label>
            <input
              type="text"
              value={step.title || ""}
              onChange={(e) => handleStepChange("title", e.target.value)}
              placeholder="e.g., Learn HTML & CSS Basics"
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Step Description */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
            <textarea
              value={step.description || ""}
              onChange={(e) => handleStepChange("description", e.target.value)}
              placeholder="Describe what the learner will accomplish..."
              rows={3}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Resources */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Learning Resources</label>

            {resources.length > 0 && (
              <div className="space-y-2 mb-3">
                {resources.map((resource, resourceIndex) => (
                  <div
                    key={resourceIndex}
                    className="flex items-center space-x-2 bg-slate-700/50 rounded-lg p-2"
                  >
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

/* ------------------------------
 * CreateRoadmap (Main Component)
 * ------------------------------ */
export default function CreateRoadmap() {
  const navigate = useNavigate();
  const { user, isSignedIn } = useUser();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    visibility: "public",
    tags: [],
    steps: [{ title: "", description: "", resources: [] }]
  });

  const [newTag, setNewTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const categories = [
    "Frontend", "Backend", "DevOps", "Data", "AI/ML", "AI/LLM",
    "Mobile", "Security", "Blockchain", "GameDev", "Cloud", "Other"
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
      setNewTag("");
    }
  };
  const removeTag = (i) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter((_, idx) => idx !== i) }));
  };

  const addStep = () => {
    setFormData(prev => ({
      ...prev,
      steps: [...prev.steps, { title: "", description: "", resources: [] }]
    }));
  };
  const updateStep = (i, updated) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.map((s, idx) => idx === i ? updated : s)
    }));
  };
  const removeStep = (i) => {
    if (formData.steps.length > 1) {
      setFormData(prev => ({ ...prev, steps: prev.steps.filter((_, idx) => idx !== i) }));
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) return setError("Roadmap title is required"), false;
    if (!formData.description.trim()) return setError("Roadmap description is required"), false;
    if (!formData.category) return setError("Please select a category"), false;
    if (formData.steps.length === 0) return setError("At least one step is required"), false;
    if (formData.steps.some(s => !s.title.trim())) return setError("All steps must have a title"), false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isSignedIn) return setError("You must be signed in to create a roadmap");
    if (!validateForm()) return;

    try {
      setLoading(true);
      const roadmapData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        visibility: formData.visibility,
        tags: formData.tags.filter(tag => tag.trim().length > 0),
        steps: formData.steps.map(s => ({
          title: s.title.trim(),
          description: s.description?.trim() || "",
          resources: s.resources?.filter(r => r.trim().length > 0) || []
        }))
      };
      const response = await api.post("/roadmaps", roadmapData);
      setSuccess(true);
      setTimeout(() => navigate(`/roadmap/${response.data._id}`), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create roadmap");
    } finally {
      setLoading(false);
    }
  };



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

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="text-slate-400 hover:text-white">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-white">Create New Roadmap</h1>
        </div>

        {success && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="bg-green-900/20 border border-green-700 rounded-lg p-4 mb-6 text-green-400">
            <BookOpen className="h-5 w-5 inline-block mr-2" />
            Roadmap created successfully! Redirecting...
          </motion.div>
        )}
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="bg-red-900/20 border border-red-700 rounded-lg p-4 mb-6 text-red-400">
            <AlertCircle className="h-5 w-5 inline-block mr-2" />
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white"><FileText className="h-5 w-5 mr-2 inline-block" /> Basic Information</CardTitle>
              <CardDescription className="text-slate-400">Provide roadmap details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <input type="text" placeholder="Title" value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white" />
              <textarea placeholder="Description" value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white" />
              <select value={formData.category} onChange={(e) => handleInputChange("category", e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white">
                <option value="">Select Category</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              
              {/* Visibility Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">Visibility</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleInputChange("visibility", "public")}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      formData.visibility === "public"
                        ? "border-blue-500 bg-blue-500/10 text-blue-300"
                        : "border-slate-600 bg-slate-700 text-slate-300 hover:border-slate-500"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Globe className="h-5 w-5" />
                      <div className="text-left">
                        <div className="font-medium">Public</div>
                        <div className="text-xs opacity-75">Anyone can view</div>
                      </div>
                    </div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => handleInputChange("visibility", "private")}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      formData.visibility === "private"
                        ? "border-purple-500 bg-purple-500/10 text-purple-300"
                        : "border-slate-600 bg-slate-700 text-slate-300 hover:border-slate-500"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Lock className="h-5 w-5" />
                      <div className="text-left">
                        <div className="font-medium">Private</div>
                        <div className="text-xs opacity-75">Only you can view</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white"><Tag className="h-5 w-5 mr-2 inline-block" /> Tags</CardTitle>
              <CardDescription className="text-slate-400">Add relevant tags</CardDescription>
            </CardHeader>
            <CardContent>
              {formData.tags.map((tag, i) => (
                <Badge key={i} className="bg-blue-900/30 text-blue-300 border-blue-700 mr-2">
                  {tag}
                  <Button variant="ghost" size="sm" onClick={() => removeTag(i)} className="ml-2 p-0">
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
              <div className="flex space-x-2 mt-2">
                <input type="text" value={newTag} onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add tag" className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" />
                <Button type="button" onClick={addTag} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Steps */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white"><Layers className="h-5 w-5 mr-2 inline-block" /> Steps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {formData.steps.map((step, i) => (
                <StepForm
                  key={i}
                  step={step}
                  index={i}
                  onUpdate={updateStep}
                  onRemove={removeStep}
                  canRemove={formData.steps.length > 1}
                />
              ))}
              <Button type="button" onClick={addStep} variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" /> Add Another Step
              </Button>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? "Creating..." : (<><Save className="h-4 w-4 mr-2" /> Create Roadmap</>)}
            </Button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}
