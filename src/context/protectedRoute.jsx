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
