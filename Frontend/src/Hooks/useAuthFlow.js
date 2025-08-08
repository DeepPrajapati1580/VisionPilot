// src/hooks/useAuthFlow.js
import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import api from "../api";

export const useAuthFlow = () => {
  const { user, isSignedIn } = useUser();
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkRegistration = async () => {
      if (!isSignedIn || !user) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/auth/profile");
        setIsRegistered(true);
        setError(null);
      } catch (err) {
        if (err.response?.status === 404) {
          setIsRegistered(false);
        } else {
          setError("Failed to check registration status");
        }
      } finally {
        setLoading(false);
      }
    };

    checkRegistration();
  }, [isSignedIn, user]);

  const registerUser = async (role) => {
    try {
      setLoading(true);
      await api.post("/auth/register", { role });
      setIsRegistered(true);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    isRegistered,
    loading,
    error,
    registerUser,
    user,
    isSignedIn
  };
};
