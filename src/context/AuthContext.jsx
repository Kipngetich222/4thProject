// import React, { createContext, useState, useEffect, useContext } from "react";
// import axios from "axios";
// import { jwtDecode } from "jwt-decode";

// // import e from "express";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [authChecked, setAuthChecked] = useState(false);

//   // Client-side token validation (for UI only)
//   const validateToken = (token) => {
//     try {
//       const decoded = jwtDecode(token);
//       return decoded.exp * 1000 > Date.now();
//     } catch {
//       return false;
//     }
//   };

//   // In checkAuth function
//   const checkAuth = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setLoading(false);
//         setAuthChecked(true);
//         return;
//       }

//       // Decode token first for immediate UI update
//       const decoded = jwtDecode(token);
//       setCurrentUser({
//         token,
//         _id: decoded._id,
//         fname: decoded.fname,
//         lname: decoded.lname,
//         role: decoded.role,
//         profilePic: decoded.profilePic,
//       });

//       // Verify with backend
//       const response = await axios.get(`${API_URL}/auth/check`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       // Merge decoded data with fresh backend data
//       setCurrentUser((prev) => ({
//         ...prev,
//         ...response.data.user,
//         token,
//       }));
//     } catch (error) {
//       console.error("Auth check failed:", error);
//       localStorage.removeItem("token");
//       setCurrentUser(null);
//     } finally {
//       setLoading(false);
//       setAuthChecked(true);
//     }
//   };

//   useEffect(() => {
//     // Load user data from localStorage on initial load
//     const token = localStorage.getItem("token");
//     const role = localStorage.getItem("role");
//     const userNo = localStorage.getItem("userNo");
//     if (token && role) {
//       setCurrentUser({ token, role, userNo });
//     }
//   }, []);


//   // AuthContext.jsx
//   const login = async (credentials) => {
//     try {
//       console.log("Attempting login with:", credentials); // Debug log
//       const response = await api.post("/login", credentials);
//       console.log("Backend response:", response.data); // Debug log

//       if (!response.data.success) {
//         console.error("Login failed - backend response:", response.data);
//         return false;
//       }

//       const { token, role, userNo, ObjectId: userObjectId } = response.data;

//       // Verify all required fields exist
//       if (!token || !role || !userNo || !userObjectId) {
//         console.error("Missing required fields in response:", response.data);
//         return false;
//       }

//       // Save to localStorage
//       localStorage.setItem("token", token);
//       localStorage.setItem("role", role);
//       localStorage.setItem("userNo", userNo);
//       localStorage.setItem("userObjectId", userObjectId);

//       // Update state
//       setCurrentUser({ token, role, userNo, userObjectId });
//       return true;
//     } catch (error) {
//       console.error("Login error:", error);
//       if (error.response) {
//         console.error("Backend error response:", error.response.data);
//         toast.error(error.response.data.error || "Login failed");
//       } else {
//         toast.error("Network error. Please try again.");
//       }
//       return false;
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("role");
//     localStorage.removeItem("userNo");
//     setCurrentUser(null);
//     setLoading(false);
//     setAuthChecked(true);
//   };

//   return (
//     <AuthContext.Provider value={{ currentUser, loading, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
// // export default AuthContext;
// // import { Buffer } from 'buffer';

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