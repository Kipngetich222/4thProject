import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import TeacherDashboard from "./pages/Teacher/TeacherDashboard";
import CourseManagement from "./pages/Teacher/CourseManagement";
import AssignmentManagement from "./pages/Teacher/AssignmentManagement";
import GradeManagement from "./pages/Teacher/GradeManagement";

import ParentDashboard from "./pages/Parent/ParentDashboard";
import StudentDashboard from "./pages/Student/StudentDashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import axios from "axios";

axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.withCredentials = true;

// Main App component
function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

// AppContent component to conditionally render Navbar
function AppContent() {
  const location = useLocation();

  // Define routes where Navbar should not be displayed
  const noNavbarRoutes = ["/login", "/signup"];

  // Check if the current route is in the noNavbarRoutes array
  const showNavbar = !noNavbarRoutes.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Dashboard Routes - No Protection */}
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/parent" element={<ParentDashboard />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />

        <Route path="/courses" element={<CourseManagement />} />
        <Route path="/teacher/assignments" element={<AssignmentManagement />} />
        <Route path="/teacher/grades" element={<GradeManagement />} />
        

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
}

export default App;
