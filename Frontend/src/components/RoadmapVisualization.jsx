// src/components/RoadmapVisualization.jsx
import React, { useState, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text, Html, Line } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import { X, ExternalLink, CheckCircle, Clock, Play } from 'lucide-react';
import { Button } from "./UI/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./UI/card";
import { Badge } from "./UI/badge";
import { Progress } from "./UI/progress";

// 3D Node Component
function RoadmapNode({ 
  position, 
  roadmap, 
  onClick, 
  isSelected, 
  progress = null,
  index 
}) {
  const [hovered, setHovered] = useState(false);
  
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

  const completionPercentage = useMemo(() => {
    if (!progress || !roadmap.steps) return 0;
    return Math.round((progress.completedSteps.length / roadmap.steps.length) * 100);
  }, [progress, roadmap.steps]);

  const nodeColor = isSelected ? '#fbbf24' : getCategoryColor(roadmap.category);
  const nodeSize = hovered ? 1.2 : (isSelected ? 1.1 : 1.0);

  return (
    <group 
      position={position} 
      onClick={() => onClick(roadmap)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Main Node */}
      <mesh scale={[nodeSize, nodeSize, nodeSize]}>
        <boxGeometry args={[1, 0.6, 0.2]} />
        <meshStandardMaterial 
          color={nodeColor}
          transparent
          opacity={hovered || isSelected ? 1 : 0.8}
          emissive={hovered ? nodeColor : '#000000'}
          emissiveIntensity={hovered ? 0.1 : 0}
        />
      </mesh>

      {/* Progress Ring */}
      {progress && completionPercentage > 0 && (
        <mesh position={[0, 0, 0.11]} rotation={[0, 0, 0]}>
          <ringGeometry args={[0.6, 0.7, 32, 1, 0, (completionPercentage / 100) * Math.PI * 2]} />
          <meshBasicMaterial color="#10b981" transparent opacity={0.8} />
        </mesh>
      )}

      {/* Title Text */}
      <Text
        position={[0, 0, 0.11]}
        fontSize={0.08}
        color="white"
        anchorX="center"
        anchorY="middle"
        maxWidth={0.8}
        font="/fonts/Inter-Bold.woff"
      >
        {roadmap.title}
      </Text>

      {/* Category Badge */}
      <Text
        position={[0, -0.25, 0.11]}
        fontSize={0.04}
        color="white"
        anchorX="center"
        anchorY="middle"
        maxWidth={0.8}
        font="/fonts/Inter-Regular.woff"
      >
        {roadmap.category}
      </Text>

      {/* Hover Info */}
      {hovered && (
        <Html position={[0, 0.5, 0]} center>
          <div className="bg-black/80 text-white p-2 rounded-lg text-xs max-w-48 pointer-events-none">
            <div className="font-semibold">{roadmap.title}</div>
            <div className="text-gray-300">{roadmap.steps?.length || 0} steps</div>
            {progress && (
              <div className="text-green-400">{completionPercentage}% complete</div>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}

// Connection Lines Component
function ConnectionLines({ roadmaps, connections = [] }) {
  return (
    <group>
      {connections.map((connection, index) => {
        const fromRoadmap = roadmaps.find(r => r._id === connection.from);
        const toRoadmap = roadmaps.find(r => r._id === connection.to);
        
        if (!fromRoadmap || !toRoadmap) return null;

        const fromIndex = roadmaps.indexOf(fromRoadmap);
        const toIndex = roadmaps.indexOf(toRoadmap);
        
        const gridSize = Math.ceil(Math.sqrt(roadmaps.length));
        const fromRow = Math.floor(fromIndex / gridSize);
        const fromCol = fromIndex % gridSize;
        const toRow = Math.floor(toIndex / gridSize);
        const toCol = toIndex % gridSize;
        
        const fromPos = [(fromCol - gridSize / 2) * 2, (gridSize / 2 - fromRow) * 1.5, 0];
        const toPos = [(toCol - gridSize / 2) * 2, (gridSize / 2 - toRow) * 1.5, 0];

        return (
          <Line
            key={index}
            points={[fromPos, toPos]}
            color="#64748b"
            lineWidth={2}
            transparent
            opacity={0.3}
          />
        );
      })}
    </group>
  );
}

// 3D Scene Component
function RoadmapScene({ 
  roadmaps, 
  onNodeClick, 
  selectedRoadmap, 
  userProgress = [],
  showConnections = false,
  connections = []
}) {
  const gridSize = Math.ceil(Math.sqrt(roadmaps.length));
  
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} />
      <pointLight position={[0, 0, 10]} intensity={0.5} />
      
      {/* Connection Lines */}
      {showConnections && (
        <ConnectionLines roadmaps={roadmaps} connections={connections} />
      )}
      
      {/* Roadmap Nodes */}
      {roadmaps.map((roadmap, index) => {
        const row = Math.floor(index / gridSize);
        const col = index % gridSize;
        const x = (col - gridSize / 2) * 2;
        const y = (gridSize / 2 - row) * 1.5;
        
        const progress = userProgress.find(p => p.roadmap === roadmap._id);
        
        return (
          <RoadmapNode
            key={roadmap._id}
            position={[x, y, 0]}
            roadmap={roadmap}
            onClick={onNodeClick}
            isSelected={selectedRoadmap?._id === roadmap._id}
            progress={progress}
            index={index}
          />
        );
      })}
      
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        maxDistance={25}
        minDistance={5}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 4}
      />
    </>
  );
}

// Detail Panel Component
function RoadmapDetailPanel({ roadmap, onClose, userProgress = null }) {
  if (!roadmap) return null;

  const completionPercentage = useMemo(() => {
    if (!userProgress || !roadmap.steps) return 0;
    return Math.round((userProgress.completedSteps.length / roadmap.steps.length) * 100);
  }, [userProgress, roadmap.steps]);

  const completedSteps = userProgress?.completedSteps || [];

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed right-0 top-0 h-full w-96 bg-white dark:bg-slate-900 border-l border-gray-200 dark:border-slate-700 shadow-2xl z-50 overflow-y-auto"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{roadmap.title}</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Basic Info */}
          <div>
            <Badge className="mb-3 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
              {roadmap.category}
            </Badge>
            <p className="text-gray-600 dark:text-slate-400 leading-relaxed">{roadmap.description}</p>
          </div>

          {/* Progress */}
          {userProgress && (
            <Card className="bg-gray-50 dark:bg-slate-800/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Your Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-slate-400">Completion</span>
                    <span className="font-medium text-gray-900 dark:text-white">{completionPercentage}%</span>
                  </div>
                  <Progress value={completionPercentage} className="h-2" />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-slate-500">
                    <span>{completedSteps.length} completed</span>
                    <span>{(roadmap.steps?.length || 0) - completedSteps.length} remaining</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Technologies */}
          {roadmap.tags && roadmap.tags.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {roadmap.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Learning Steps */}
          {roadmap.steps && roadmap.steps.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Learning Path</h3>
              <div className="space-y-4">
                {roadmap.steps.map((step, index) => {
                  const isCompleted = completedSteps.includes(index);
                  
                  return (
                    <div key={index} className={`bg-gray-50 dark:bg-slate-800/50 rounded-lg p-4 border-l-4 ${
                      isCompleted ? 'border-green-500' : 'border-gray-300 dark:border-slate-600'
                    }`}>
                      <div className="flex items-start space-x-3">
                        <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                          isCompleted ? 'bg-green-500' : 'bg-gray-400 dark:bg-slate-600'
                        }`}>
                          {isCompleted ? <CheckCircle className="h-4 w-4" /> : index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-medium mb-1 ${
                            isCompleted ? 'text-green-700 dark:text-green-300' : 'text-gray-900 dark:text-white'
                          }`}>
                            {step.title}
                          </h4>
                          {step.description && (
                            <p className="text-gray-600 dark:text-slate-400 text-sm mb-2">{step.description}</p>
                          )}
                          {step.resources && step.resources.length > 0 && (
                            <div className="space-y-1">
                              {step.resources.map((resource, resourceIndex) => (
                                <a
                                  key={resourceIndex}
                                  href={resource}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm"
                                >
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  Resource {resourceIndex + 1}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 border-t border-gray-200 dark:border-slate-700 space-y-3">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <Play className="h-4 w-4 mr-2" />
              {userProgress ? 'Continue Learning' : 'Start Learning Path'}
            </Button>
            {userProgress && completionPercentage < 100 && (
              <Button variant="outline" className="w-full">
                <Clock className="h-4 w-4 mr-2" />
                Set Reminder
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Main Visualization Component
export default function RoadmapVisualization({ 
  roadmaps = [], 
  userProgress = [],
  showConnections = false,
  connections = [],
  className = ""
}) {
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);
  const [viewMode, setViewMode] = useState('3d'); // '3d' or 'network'

  const handleNodeClick = (roadmap) => {
    setSelectedRoadmap(roadmap);
  };

  const handleCloseDetail = () => {
    setSelectedRoadmap(null);
  };

  if (roadmaps.length === 0) {
    return (
      <div className={`flex items-center justify-center h-96 bg-gray-50 dark:bg-slate-800/50 rounded-lg ${className}`}>
        <div className="text-center">
          <div className="text-gray-400 dark:text-slate-500 mb-2">
            <BookOpen className="h-12 w-12 mx-auto" />
          </div>
          <p className="text-gray-600 dark:text-slate-400">No roadmaps available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Controls */}
      <div className="absolute top-4 left-4 z-10 flex space-x-2">
        <Button
          variant={viewMode === '3d' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('3d')}
        >
          3D View
        </Button>
        <Button
          variant={showConnections ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('network')}
        >
          Network
        </Button>
      </div>

      {/* 3D Canvas */}
      <div className="h-[600px] bg-gray-50 dark:bg-slate-900/50 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
        <Canvas camera={{ position: [0, 0, 12], fov: 60 }}>
          <RoadmapScene
            roadmaps={roadmaps}
            onNodeClick={handleNodeClick}
            selectedRoadmap={selectedRoadmap}
            userProgress={userProgress}
            showConnections={showConnections}
            connections={connections}
          />
        </Canvas>
      </div>

      {/* Instructions */}
      <div className="text-center text-gray-500 dark:text-slate-400 mt-4 text-sm">
        <p>Click and drag to rotate • Scroll to zoom • Click on nodes to view details</p>
      </div>

      {/* Detail Panel */}
      <AnimatePresence>
        {selectedRoadmap && (
          <RoadmapDetailPanel
            roadmap={selectedRoadmap}
            onClose={handleCloseDetail}
            userProgress={userProgress.find(p => p.roadmap === selectedRoadmap._id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
