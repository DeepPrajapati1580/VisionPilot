// src/hooks/useUserData.js
import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import api from "../api";

export const useUserData = () => {
  const { user, isSignedIn } = useUser();
  const [userData, setUserData] = useState(null);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isSignedIn || !user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch user profile
        const profileResponse = await api.get("/auth/profile");
        setUserData(profileResponse.data);

        // Fetch user progress
        try {
          const progressResponse = await api.get("/progress");
          setProgress(progressResponse.data);
        } catch (progressErr) {
          console.warn("Could not fetch progress:", progressErr);
          setProgress([]);
        }

        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch user data");
        console.error("User data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isSignedIn, user]);

  const updateProgress = async (roadmapId, completedSteps) => {
    try {
      const response = await api.post("/progress", {
        roadmap: roadmapId,
        completedSteps
      });
      
      // Update local progress state
      setProgress(prev => {
        const existing = prev.find(p => p.roadmap === roadmapId);
        if (existing) {
          return prev.map(p => 
            p.roadmap === roadmapId ? response.data : p
          );
        } else {
          return [...prev, response.data];
        }
      });

      return response.data;
    } catch (err) {
      console.error("Progress update error:", err);
      throw err;
    }
  };

  const getRoadmapProgress = (roadmapId) => {
    return progress.find(p => p.roadmap === roadmapId);
  };

  const getCompletionPercentage = (roadmapId, totalSteps) => {
    const roadmapProgress = getRoadmapProgress(roadmapId);
    if (!roadmapProgress || !totalSteps) return 0;
    return Math.round((roadmapProgress.completedSteps.length / totalSteps) * 100);
  };

  return {
    userData,
    progress,
    loading,
    error,
    updateProgress,
    getRoadmapProgress,
    getCompletionPercentage,
    refetch: () => {
      setLoading(true);
      // Re-trigger the useEffect
      setUserData(null);
    }
  };
};
