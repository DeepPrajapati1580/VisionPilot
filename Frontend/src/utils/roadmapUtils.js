import api from "../api";

// Check if user can edit a roadmap
export const canEditRoadmap = (roadmap, userId) => {
  if (!roadmap || !userId) return false;
  return roadmap.createdBy === userId;
};

// Check if user can delete a roadmap
export const canDeleteRoadmap = (roadmap, userId) => {
  if (!roadmap || !userId) return false;
  return roadmap.createdBy === userId;
};

// Delete roadmap with confirmation
export const deleteRoadmap = async (roadmapId) => {
  try {
    const response = await api.delete(`/roadmaps/${roadmapId}`);
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.error || "Failed to delete roadmap" 
    };
  }
};

// Update roadmap
export const updateRoadmap = async (roadmapId, roadmapData) => {
  try {
    const response = await api.put(`/roadmaps/${roadmapId}`, roadmapData);
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.error || "Failed to update roadmap" 
    };
  }
};

// Get user's created roadmaps
export const getUserRoadmaps = async () => {
  try {
    const response = await api.get("/roadmaps/user/created");
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.error || "Failed to fetch user roadmaps" 
    };
  }
};

// Validate roadmap data
export const validateRoadmapData = (data) => {
  const errors = [];

  if (!data.title?.trim()) {
    errors.push("Title is required");
  }

  if (!data.description?.trim()) {
    errors.push("Description is required");
  }

  if (!data.category) {
    errors.push("Category is required");
  }

  if (!data.steps || data.steps.length === 0) {
    errors.push("At least one step is required");
  } else {
    data.steps.forEach((step, index) => {
      if (!step.title?.trim()) {
        errors.push(`Step ${index + 1} must have a title`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
