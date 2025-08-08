import React, { useEffect, useState } from "react";
import { useUser, UserButton } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text, Box } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ExternalLink, Users, BookOpen, Code, Database, Shield, Smartphone, Gamepad2, Cloud, Cpu, Search, Filter, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from "./UI/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./UI/card";
import { Badge } from "./UI/badge";
import api from "../api";

// 3D Roadmap Node Component
function RoadmapNode({ position, roadmap, onClick, isSelected }) {
  const getCategoryColor = (category) => {
    const colors = {
      'Frontend': '#3b82f6',
      'Backend': '#10b981',
      'DevOps': '#f59e0b',
      'Data': '#8b5cf6',
      'AI/ML': '#ec4899',
      'AI/LLM': '#f97316',
      'Mobile': '#06b6d4',
      'Security': '#ef4444',
      'Blockchain': '#84cc16',
      'GameDev': '#6366f1',
      'Cloud': '#14b8a6'
    };
    return colors[category] || '#6b7280';
  };

  return (
    <group position={position} onClick={() => onClick(roadmap)}>
      <Box
        args={[1, 0.6, 0.2]}
        position={[0, 0, 0]}
      >
        <meshStandardMaterial 
          color={isSelected ? '#fbbf24' : getCategoryColor(roadmap.category)}
          transparent
          opacity={isSelected ? 1 : 0.8}
        />
      </Box>
      <Text
        position={[0, 0, 0.11]}
        fontSize={0.08}
        color="white"
        anchorX="center"
        anchorY="middle"
        maxWidth={0.8}
      >
        {roadmap.title}
      </Text>
    </group>
  );
}

// 3D Scene Component
function RoadmapScene({ roadmaps, onNodeClick, selectedRoadmap }) {
  const gridSize = Math.ceil(Math.sqrt(roadmaps.length));
  
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} />
      
      {roadmaps.map((roadmap, index) => {
        const row = Math.floor(index / gridSize);
        const col = index % gridSize;
        const x = (col - gridSize / 2) * 2;
        const y = (gridSize / 2 - row) * 1.5;
        
        return (
          <RoadmapNode
            key={roadmap._id}
            position={[x, y, 0]}
            roadmap={roadmap}
            onClick={onNodeClick}
            isSelected={selectedRoadmap?._id === roadmap._id}
          />
        );
      })}
      
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        maxDistance={20}
        minDistance={5}
      />
    </>
  );
}

// Roadmap Card Component
function RoadmapCard({ roadmap, onClick }) {
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

  const getCategoryColor = (category) => {
    const colors = {
      'Frontend': 'bg-blue-500',
      'Backend': 'bg-green-500',
      'DevOps': 'bg-yellow-500',
      'Data': 'bg-purple-500',
      'AI/ML': 'bg-pink-500',
      'AI/LLM': 'bg-orange-500',
      'Mobile': 'bg-cyan-500',
      'Security': 'bg-red-500',
      'Blockchain': 'bg-lime-500',
      'GameDev': 'bg-indigo-500',
      'Cloud': 'bg-teal-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  const handleCardClick = () => {
    navigate(`/roadmap/${roadmap._id}`);
  };

  return (
    <Card 
      className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 bg-slate-800/50 border-slate-700 hover:border-slate-600"
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className={`p-2 rounded-lg ${getCategoryColor(roadmap.category)} text-white`}>
            {getCategoryIcon(roadmap.category)}
          </div>
          <ExternalLink className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <CardTitle className="text-white text-lg">{roadmap.title}</CardTitle>
        <CardDescription className="text-slate-300 text-sm line-clamp-2">
          {roadmap.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="bg-slate-700 text-slate-200">
            {roadmap.category}
          </Badge>
          <div className="flex items-center text-slate-400 text-sm">
            <Users className="h-3 w-3 mr-1" />
            {roadmap.steps?.length || 0} steps
          </div>
        </div>
        {roadmap.tags && roadmap.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {roadmap.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-slate-700/50 text-slate-300 rounded-md"
              >
                {tag}
              </span>
            ))}
            {roadmap.tags.length > 3 && (
              <span className="px-2 py-1 text-xs bg-slate-700/50 text-slate-400 rounded-md">
                +{roadmap.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Error Component
function ErrorDisplay({ error, onRetry }) {
  return (
    <div className="text-center py-12">
      <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-white mb-2">Failed to Load Roadmaps</h3>
      <p className="text-slate-400 mb-4">{error}</p>
      <Button onClick={onRetry} className="bg-blue-600 hover:bg-blue-700">
        <RefreshCw className="h-4 w-4 mr-2" />
        Try Again
      </Button>
    </div>
  );
}

// Empty State Component
function EmptyState() {
  return (
    <div className="text-center py-12">
      <BookOpen className="h-12 w-12 text-slate-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-white mb-2">No Roadmaps Found</h3>
      <p className="text-slate-400 mb-4">
        We couldn't find any roadmaps. This might be a temporary issue.
      </p>
      <Button className="bg-blue-600 hover:bg-blue-700">
        <RefreshCw className="h-4 w-4 mr-2" />
        Refresh
      </Button>
    </div>
  );
}

// Main Dashboard Component
export default function Dashboard() {
  const { user } = useUser();
  const [roadmaps, setRoadmaps] = useState([]);
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const fetchRoadmaps = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("🔄 Fetching roadmaps from API...");
      
      const response = await api.get("/roadmaps");
      console.log("📊 Roadmaps response:", response.data);
      
      if (Array.isArray(response.data)) {
        setRoadmaps(response.data);
        console.log(`✅ Successfully loaded ${response.data.length} roadmaps`);
      } else {
        console.error("❌ Invalid response format:", response.data);
        setError("Invalid data format received from server");
      }
    } catch (error) {
      console.error("❌ Error fetching roadmaps:", error);
      setError(error.response?.data?.error || error.message || "Failed to load roadmaps");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  const handleRoadmapClick = (roadmap) => {
    setSelectedRoadmap(roadmap);
  };

  const handleRetry = () => {
    fetchRoadmaps();
  };

  // Filter roadmaps based on search and category
  const filteredRoadmaps = roadmaps.filter(roadmap => {
    const matchesSearch = roadmap.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         roadmap.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || roadmap.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedRoadmaps = filteredRoadmaps.reduce((acc, roadmap) => {
    const category = roadmap.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(roadmap);
    return acc;
  }, {});

  const categories = ['all', ...new Set(roadmaps.map(r => r.category).filter(Boolean))];
  const roleBasedCategories = ['Frontend', 'Backend', 'DevOps', 'Data', 'AI/ML', 'AI/LLM', 'Mobile', 'Security'];
  const skillBasedCategories = ['Blockchain', 'GameDev', 'Cloud'];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading roadmaps...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                VisionPilot
              </h1>
              <nav className="hidden md:flex space-x-6">
                <a href="#" className="text-slate-300 hover:text-white transition-colors">Dashboard</a>
                <a href="#" className="text-slate-300 hover:text-white transition-colors">My Progress</a>
                <a href="#" className="text-slate-300 hover:text-white transition-colors">Community</a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex bg-slate-800 rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="text-xs"
                >
                  Grid
                </Button>
                <Button
                  variant={viewMode === '3d' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('3d')}
                  className="text-xs"
                >
                  3D View
                </Button>
              </div>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.firstName || 'Developer'}! 👋
          </h1>
          <p className="text-slate-400">
            Continue your learning journey with our curated roadmaps
          </p>
        </div>

        {/* Debug Info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-4 p-4 bg-slate-800 rounded-lg text-sm">
            <p className="text-slate-300">
              🔍 Debug: {roadmaps.length} roadmaps loaded, {filteredRoadmaps.length} after filtering
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <ErrorDisplay error={error} onRetry={handleRetry} />
        )}

        {/* Empty State */}
        {!error && !loading && roadmaps.length === 0 && (
          <EmptyState />
        )}

        {/* Content - only show if we have roadmaps and no error */}
        {!error && roadmaps.length > 0 && (
          <>
            {/* Search and Filter */}
            <div className="mb-8 flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search roadmaps..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-10 pr-8 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 3D View */}
            {viewMode === '3d' && filteredRoadmaps.length > 0 && (
              <div className="mb-12">
                <div className="h-[600px] bg-slate-900/50 rounded-xl border border-slate-700 overflow-hidden">
                  <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
                    <RoadmapScene
                      roadmaps={filteredRoadmaps}
                      onNodeClick={handleRoadmapClick}
                      selectedRoadmap={selectedRoadmap}
                    />
                  </Canvas>
                </div>
                <p className="text-center text-slate-400 mt-4 text-sm">
                  Click and drag to rotate • Scroll to zoom • Click on nodes to view details
                </p>
              </div>
            )}

            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className="space-y-12">
                {filteredRoadmaps.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-slate-400">No roadmaps match your search criteria.</p>
                  </div>
                ) : (
                  <>
                    {/* Role-based Roadmaps */}
                    {roleBasedCategories.some(cat => groupedRoadmaps[cat]?.length > 0) && (
                      <section>
                        <h2 className="text-2xl font-semibold mb-6 text-slate-300">
                          Role-based Roadmaps
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {roleBasedCategories.map(category => 
                            groupedRoadmaps[category]?.map(roadmap => (
                              <RoadmapCard
                                key={roadmap._id}
                                roadmap={roadmap}
                                onClick={handleRoadmapClick}
                              />
                            ))
                          )}
                        </div>
                      </section>
                    )}

                    {/* Create Your Own Roadmap */}
                    <div className="text-center">
                      <Button
                        variant="outline"
                        className="border-slate-600 text-slate-300 hover:text-white hover:border-slate-500"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create your own Roadmap
                      </Button>
                    </div>

                    {/* Skill-based Roadmaps */}
                    {skillBasedCategories.some(cat => groupedRoadmaps[cat]?.length > 0) && (
                      <section>
                        <h2 className="text-2xl font-semibold mb-6 text-slate-300">
                          Skill-based Roadmaps
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {skillBasedCategories.map(category => 
                            groupedRoadmaps[category]?.map(roadmap => (
                              <RoadmapCard
                                key={roadmap._id}
                                roadmap={roadmap}
                                onClick={handleRoadmapClick}
                              />
                            ))
                          )}
                        </div>
                      </section>
                    )}
                  </>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
