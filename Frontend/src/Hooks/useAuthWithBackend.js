// src/hooks/useAuthWithBackend.js
import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import api from "../api";

export const useAuthWithBackend = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  const [backendUser, setBackendUser] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const syncWithBackend = async () => {
      if (!isLoaded) return;
      
      if (!isSignedIn || !user) {
        setBackendUser(null);
        setIsRegistered(false);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await api.get("/auth/profile");
        setBackendUser(response.data);
        setIsRegistered(true);
        setError(null);
      } catch (err) {
        if (err.response?.status === 404) {
          setIsRegistered(false);
          setBackendUser(null);
        } else {
          setError("Failed to sync with backend");
          console.error("Backend sync error:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    syncWithBackend();
  }, [isSignedIn, user, isLoaded]);

  const registerWithBackend = async (userData) => {
    try {
      setLoading(true);
      const response = await api.post("/auth/register", userData);
      setBackendUser(response.data.user);
      setIsRegistered(true);
      setError(null);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Registration failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    try {
      setLoading(true);
      const response = await api.put("/auth/profile", updates);
      setBackendUser(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Update failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    user: backendUser,
    clerkUser: user,
    isSignedIn,
    isRegistered,
    loading,
    error,
    registerWithBackend,
    updateProfile,
    isLoaded
  };
};
