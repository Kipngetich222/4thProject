// import React from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom"; 
// import TeacherDashboard from "./pages/Teacher/TeacherDashboard";
// import ParentDashboard from "./pages/Parent/ParentDashboard";
// import StudentDashboard from "./pages/Student/StudentDashboard";
// import AdminDashboard from "./pages/Admin/AdminDashboard";
// import Navbar from "./components/Navbar";

// function App() {
//   return (
//     <BrowserRouter> 
//       <Navbar />
//       <Routes>
//         <Route path="/teacher" element={<TeacherDashboard />} />
//         <Route path="/parent" element={<ParentDashboard />} />
//         <Route path="/student" element={<StudentDashboard />} />
//         <Route path="/admin" element={<AdminDashboard />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

// ------------------------------------------------------------------------

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import TeacherDashboard from "./pages/Teacher/TeacherDashboard";
import ParentDashboard from "./pages/Parent/ParentDashboard";
import StudentDashboard from "./pages/Student/StudentDashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import { AuthProvider, useAuth } from "./context/AuthContext";

// ProtectedRoute component to restrict access based on user role
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />; // Redirect to login if not authenticated
  }

  if (user.role !== requiredRole) {
    return <Navigate to="/" />; // Redirect to home or unauthorized page
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route
            path="/teacher"
            element={
              <ProtectedRoute requiredRole="teacher">
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent"
            element={
              <ProtectedRoute requiredRole="parent">
                <ParentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student"
            element={
              <ProtectedRoute requiredRole="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;