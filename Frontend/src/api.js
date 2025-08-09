import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 15000, // Increased timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  try {
    if (typeof window !== 'undefined' && window.Clerk?.session) {
      const token = await window.Clerk.session.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("🔐 Auth token added to request");
      } else {
        console.warn("⚠️ No auth token available");
      }
    }
  } catch (error) {
    console.warn("❌ Failed to get auth token:", error);
  }
  
  console.log("📤 API Request:", config.method?.toUpperCase(), config.url);
  return config;
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    console.log("📥 API Response:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error("❌ API Error:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      console.warn("🔒 Authentication failed - redirecting to login");
      // Could trigger a re-authentication flow here
    }
    
    return Promise.reject(error);
  }
);

export default api;
