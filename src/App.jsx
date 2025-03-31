import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
// import Signup from "./pages/Signup";
import Profile from "./pages/Profile.jsx";

import AddUser from "./pages/AddUser.jsx";
import TeacherDashboard from "./pages/Teacher/TeacherDashboard";

import ParentDashboard from "./pages/Parent/ParentDashboard";
import StudentDashboard from "./pages/Student/StudentDashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import TeacherGrades from "./pages/Teacher/grades.jsx";
import axios from "axios";
import AdminTeacher from "./pages/Admin/testt.jsx";
import TeacherForm from "./pages/Admin/TeacherForm.jsx";
import UploadAssignment from "./pages/Teacher/AssingmentUpload.jsx";
import AssignmentList from "./pages/Teacher/ViewAssinements.jsx";
import Attendance from "./pages/Teacher/Attendance.jsx";
import AddStudent from "./pages/Admin/AdminStudent.jsx";
import SubmissionsList from "./pages/Teacher/SubmissionsList.jsx";
import SubmitAssignment from "./pages/Student/AssinementSumition.jsx";
import StudentAssignmentList from "./pages/Student/viewAssinments.jsx";
import StudentAssignmentDetail from "./pages/Student/AssinmentDetails.jsx";
import MarkSubmission from "./pages/Teacher/MarkAssinments.jsx";
import AddParents from "./pages/Admin/parentsForm.jsx";
import ChatPage from "./pages/message/ChatPage.jsx";
import { SocketProvider } from "./context/SocketContext";
import ChatList from "./components/ChatList.jsx";
import NewChat from "./components/NewChat.jsx";
// import Tester from "./pages/Admin/Tester.jsx";
import ChatInterface from "./components/ChatInterface.jsx";
import UserManagement from "./pages/Admin/UserManagement.jsx";
import { useAuth } from "./context/AuthContext";

axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.withCredentials = true;

// Add after axios.defaults configuration in App.jsx
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Main App component
function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <AppContent />
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

// ✅ AppContent component to conditionally render Navbar
function AppContent() {
  const location = useLocation();

  // Define routes where Navbar should NOT be displayed
  const noNavbarRoutes = ["/login", "/signup"];
  const showNavbar = !noNavbarRoutes.includes(location.pathname);

  useEffect(() => {
    // Request notification permission when component mounts
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("Notification permission granted");
        }
      });
    }
  }, []);

  // const ProtectedRoute = ({ children }) => {
  //   const { currentUser, loading } = useAuth();

  //   if (loading) {
  //     return <div>Loading...</div>; // Show a proper loading indicator
  //   }

  //   if (!currentUser) {
  //     // Only redirect if we're sure we're not logged in
  //     return <Navigate to="/login" state={{ from: location }} replace />;
  //   }

  //   return children;
  // };

  const ProtectedRoute = ({ children }) => {
    const { currentUser, loading } = useAuth();
    const location = useLocation();

    if (loading) {
      return <div>Loading...</div>;
    }

    // Allow access to chat routes without authentication
    if (
      location.pathname.startsWith("/chat") ||
      location.pathname.startsWith("/new-chat")
    ) {
      return children;
    }

    if (!currentUser) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
  };

  return (
    <>
      {showNavbar && <Navbar />}
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      <Routes>
        {/* ✅ Public Routes */}
        <Route path="/login" element={<Login />} />
        {/* // <Route path="/signup" element={<Signup />} /> */}
        <Route path="/profile" element={<Profile />} />
        {/* Dashboard Routes - No Protection */}
        {/* <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/parent" element={<ParentDashboard />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} /> */}
        <Route path="/admin/adduser" element={<AddUser />} />
        {/* Unprotected Dashboard Routes */}
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/parent" element={<ParentDashboard />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/teacher/grades" element={<TeacherGrades />} />
        <Route path="/admin/test" element={<AdminTeacher />} />
        {/* <Route path="/admin/teacher" element={<Tester />} /> */}
        <Route path="/admin/teacherform" element={<TeacherForm />} />
        <Route
          path="/teacher/uploadassignment"
          element={<UploadAssignment />}
        />
        <Route path="/teacher/assignments" element={<AssignmentList />} />
        {/* <Route path="/student/assingments" element={<AssignmentList/>}/> */}
        <Route path="/teacher/atendance" element={<Attendance />} />
        <Route path="/admin/student" element={<AddStudent />} />
        {/* <Route path="/teacher/submissions" element={<SubmissionsList/>}/> */}
        <Route
          path="/student/assignments"
          element={<StudentAssignmentList />}
        />
        <Route
          path="/teacher/assignments/:assignmentId/submissions"
          element={<SubmissionsList />}
        />
        <Route
          path="/student/assingments/submissions"
          element={<SubmissionsList />}
        />
        {/* <Route path="/submit-assignment/:assignmentId" element={<SubmitAssignment />} /> */}
        <Route
          path="/student/assignments/:assignmentId"
          element={<StudentAssignmentDetail />}
        />
        <Route
          path="/teacher/assingments/submissions/mark/:submissionId"
          element={<MarkSubmission />}
        />
        // In App.jsx, update the chat routes section
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <div className="flex h-screen">
                <ChatList />
                <div className="flex-1 flex items-center justify-center bg-gray-100">
                  <p>Select a chat or start a new one</p>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat/:chatId"
          element={
            <ProtectedRoute>
              <div className="flex h-screen">
                <ChatList />
                <ChatInterface />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/new-chat"
          element={
            <ProtectedRoute>
              <NewChat />
            </ProtectedRoute>
          }
        />
        <Route path="/admin/adduser" element={<AddUser />} />
        <Route path="/message" element={<ChatPage />} />
        {/* ✅ Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/test" element={<AdminTeacher />} />
        <Route path="/admin/teacher" element={<TeacherForm />} />
        <Route path="/admin/student" element={<AddStudent />} />
        <Route path="/admin/parent" element={<AddParents />} />
        {/* ✅ Teacher Routes */}
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/teacher/grades" element={<TeacherGrades />} />
        <Route
          path="/teacher/uploadassignment"
          element={<UploadAssignment />}
        />
        <Route path="/teacher/assignments" element={<AssignmentList />} />
        <Route
          path="/teacher/assignments/:assignmentId/submissions"
          element={<SubmissionsList />}
        />
        <Route
          path="/teacher/assignments/submissions/mark/:submissionId"
          element={<MarkSubmission />}
        />
        <Route path="/teacher/attendance" element={<Attendance />} />
        {/* ✅ Student Routes */}
        <Route path="/student" element={<StudentDashboard />} />
        <Route
          path="/student/assignments"
          element={<StudentAssignmentList />}
        />
        <Route
          path="/student/assignments/:assignmentId"
          element={<StudentAssignmentDetail />}
        />
        {/* ✅ Parent Routes */}
        <Route path="/parent" element={<ParentDashboard />} />
        {/* ✅ Default Route */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/admin/users" element={<UserManagement />} />
      </Routes>
    </>
  );
}

export default App;
