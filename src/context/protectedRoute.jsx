<<<<<<< HEAD
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoutes = ({ children, role }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />; // Redirect to login if not authenticated
  }

  try {
    const user = JSON.parse(atob(token.split(".")[1])); // Decode token to get user info
    if (user.role !== role) {
      return <Navigate to="/login" />; // Redirect if user role is not authorized
    }
    return children; // Render the protected component
  } catch (error) {
    console.error("Invalid token:", error);
    localStorage.removeItem("token");
    return <Navigate to="/login" />; // Redirect on token error
  }
};

export default ProtectedRoutes;
=======
// protectedRoute.jsx - Updated version
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


const ProtectedRoute = ({ children, roles }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (!currentUser?.token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(currentUser.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
>>>>>>> teacher_edits
