import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

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
      const response = await axios.post('/login', credentials);
      console.log("Login response:", response.data);

      if (response.data.error) {
        toast.error(response.data.error);
        return false;
      }

      const { token, role, userNo, ObjectId: userObjectId, fname, lname, subjects } = response.data;

      // Store user data
      localStorage.setItem("token", token);
      localStorage.setItem("userObjectId", userObjectId);
      localStorage.setItem("role", role);
      localStorage.setItem("userNo", userNo);
      localStorage.setItem("fname", fname);
      localStorage.setItem("lname", lname);

      if (role === "teacher" && subjects) {
        localStorage.setItem("subjects", JSON.stringify(subjects));
      }

      setCurrentUser({ token, role, userNo, userObjectId, fname, lname, subjects });

      // Navigate based on role
      const redirectPaths = {
        teacher: "/teacher",
        parent: "/parent",
        student: "/student",
        admin: "/admin",
      };
      window.location.href = redirectPaths[role] || "/";

      return true;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userNo");
    localStorage.removeItem("userObjectId");
    localStorage.removeItem("fname");
    localStorage.removeItem("lname");
    localStorage.removeItem("subjects");
    setCurrentUser(null);
    window.location.href = "/login";
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

        // Get user data from localStorage
        const role = localStorage.getItem("role");
        const userNo = localStorage.getItem("userNo");
        const userObjectId = localStorage.getItem("userObjectId");
        const fname = localStorage.getItem("fname");
        const lname = localStorage.getItem("lname");
        const subjects = localStorage.getItem("subjects");

        setCurrentUser({
          token,
          role,
          userNo,
          userObjectId,
          fname,
          lname,
          subjects: subjects ? JSON.parse(subjects) : undefined,
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