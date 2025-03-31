import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

// import e from "express";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  // Client-side token validation (for UI only)
  const validateToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  };

  // Server-side authentication check
  // const checkAuth = async () => {
  //   const token = localStorage.getItem("token");

  //   if (!token || !validateToken(token)) {
  //     logout();
  //     return;
  //   }

  //   try {
  //     const response = await axios.get(`${API_URL}/auth/check`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });

  //     setCurrentUser({
  //       ...response.data.user,
  //       token,
  //     });
  //   } catch (error) {
  //     logout();
  //   } finally {
  //     setLoading(false);
  //     setAuthChecked(true);
  //   }
  // };

  // In checkAuth function
  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        setAuthChecked(true);
        return;
      }

      // Proceed to verify token but don't block on failure
      const response = await axios.get(`${API_URL}/auth/check`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCurrentUser({ ...response.data.user });
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
      setAuthChecked(true);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/login`, credentials);
      const { token, userData } = response.data;

      if (!token || !validateToken(token)) {
        throw new Error("Invalid token received");
      }

      localStorage.setItem("token", token);
      setCurrentUser({
        token,
        ...userData,
      });
      return true;
    } catch (error) {
      logout();
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
    setLoading(false);
    setAuthChecked(true);
  };

  // Token expiration check
  // In AuthContext.jsx, modify the initial check
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Immediate UI update while verifying
      setCurrentUser({ token });
      checkAuth(); // Then verify properly
    } else {
      setLoading(false);
      setAuthChecked(true);
    }
  }, []);

  // Initial auth check
  useEffect(() => {
    if (!authChecked) {
      checkAuth();
    }
  }, [authChecked]);

  return (
    <AuthContext.Provider value={{ currentUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
// export default AuthContext;
// import { Buffer } from 'buffer';