import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";

// Create API instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (credentials) => {
    try {
      console.log("Attempting login with:", credentials);
      const response = await api.post("/login", credentials);
      console.log("Login response:", response.data);

      if (!response.data.success) {
        toast.error(response.data.error || "Login failed");
        return false;
      }

      const { token, role, userNo, ObjectId: userObjectId } = response.data;

      // Store user data
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("userNo", userNo);
      localStorage.setItem("userObjectId", userObjectId);

      setCurrentUser({ token, role, userNo, userObjectId });
      return true;
    } catch (error) {
      console.error("Login error:", error);
      if (error.response) {
        toast.error(error.response.data.error || "Login failed");
      } else {
        toast.error("Network error. Please try again.");
      }
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userNo");
    localStorage.removeItem("userObjectId");
    setCurrentUser(null);
    // Navigation will be handled by components
  };

  // Check auth state on initial load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Verify token is valid
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          logout();
          return;
        }

        // Optionally: Verify with backend
        const response = await api.get("/auth/check", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCurrentUser({
          token,
          role: decoded.role,
          userNo: decoded.userNo,
          userObjectId: decoded._id,
        });
      } catch (error) {
        console.error("Auth check failed:", error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
