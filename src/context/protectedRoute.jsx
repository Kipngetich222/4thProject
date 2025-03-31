// protectedRoute.jsx - Updated version
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// const ProtectedRoute = ({ children }) => {
//   const { currentUser, loading } = useAuth();
//   const location = useLocation();

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (!currentUser?.token) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   if (roles && !roles.includes(currentUser.role)) {
//     return <Navigate to="/unauthorized" replace />;
//   }

//   // Check both currentUser and localStorage token for redundancy
//   const token = localStorage.getItem("token");
//   if (!currentUser && !token) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   // Verify token expiration if needed
//   if (token) {
//     try {
//       const decoded = jwt.decode(token);
//       if (decoded.exp * 1000 < Date.now()) {
//         localStorage.removeItem("token");
//         return <Navigate to="/login" state={{ from: location }} replace />;
//       }
//     } catch (error) {
//       console.error("Token decode error:", error);
//       localStorage.removeItem("token");
//       return <Navigate to="/login" state={{ from: location }} replace />;
//     }
//   }

//   return children;
// };

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
