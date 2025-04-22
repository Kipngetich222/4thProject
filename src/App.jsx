import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
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
//import EnterGrades from "./pages/Teacher/Entergrades.jsx"
import SessionForm from "./pages/Admin/Session.jsx";
import ExamForm from "./pages/Admin/CreateExam.jsx";
import AssignTeacher from "./pages/Admin/AssignTeachers.jsx";
import AddClassForm from "./pages/Admin/AddClass.jsx";
import StdPerfomance from "./pages/Parent/stdPerformance.jsx";
import { SocketProvider } from "./context/SocketContext";
import ChatList from "./components/ChatList.jsx";
import NewChat from "./components/NewChat.jsx";
// import Tester from "./pages/Admin/Tester.jsx";
import ChatInterface from "./components/ChatInterface.jsx";
import UserManagement from "./pages/Admin/UserManagement.jsx";
import { useAuth } from "./context/AuthContext";
import Sidebar from "./components/Sidebar.jsx";
import ChatSelection from "./pages/Admin/ChatSelection";

// Configure axios defaults
axios.defaults.baseURL = "http://localhost:5000/api";
axios.defaults.withCredentials = true;

// Add request interceptor
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    config.headers["Content-Type"] = "application/json";
  }
  return config;
});

// Add response interceptor
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

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
  const noSidebarRoutes = ["/login", "/signup", "/message"];
  
  const showNavbar = !noNavbarRoutes.includes(location.pathname);
  const showSidebar = !noSidebarRoutes.includes(location.pathname) && localStorage.getItem("token");
  

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


  const ProtectedRoute = ({ children }) => {
    const { currentUser, loading } = useAuth();
    const location = useLocation();

    if (loading) {
      return <div>Loading...</div>;
    }
    if (!currentUser) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
  };

  return (
    <>
      {showNavbar && <Navbar />}
      {showSidebar && <Sidebar />}
  
      {/* Main content with space for sidebar and navbar */}
      <div className={`pt-16 ${localStorage.getItem("token") ? "md:pl-64" : ""}`}>
        <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
        <Routes>
          {/* ✅ Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/admin/adduser" element={<AddUser />} />
          <Route path="/message" element={<ChatPage />} />
  
          {/* ✅ Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/test" element={<AdminTeacher />} />
          <Route path="/admin/teacher" element={<TeacherForm />} />
          <Route path="/admin/student" element={<AddStudent />} />
          <Route path="/admin/parent" element={<AddParents />} />
          <Route path="/admin/session" element={<SessionForm />} />
          <Route path="/admin/createexam" element={<ExamForm />} />
          <Route path="/admin/assignteacher" element={<AssignTeacher />} />
          <Route path="/admin/addClass" element={<AddClassForm />} />
          <Route path="/admin/chat" element={<ChatSelection />} />
  
          {/* ✅ Teacher Routes */}
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/teacher/grades" element={<TeacherGrades />} />
          <Route path="/teacher/uploadassignment" element={<UploadAssignment />} />
          <Route path="/teacher/assignments" element={<AssignmentList />} />
          <Route path="/teacher/assignments/:assignmentId/submissions" element={<SubmissionsList />} />
          <Route path="/teacher/assignments/submissions/mark/:submissionId" element={<MarkSubmission />} />
          <Route path="/teacher/attendance" element={<Attendance />} />
  
          {/* ✅ Student Routes */}
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/assignments" element={<StudentAssignmentList />} />
          <Route path="/student/assignments/:assignmentId" element={<StudentAssignmentDetail />} />
  
          {/* ✅ Parent Routes */}
          <Route path="/parent" element={<ParentDashboard />} />
          <Route path="/parent/performce" element={<StdPerfomance />} />
  
          {/* ✅ Chat Routes */}
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <div className="flex h-screen">
                  <ChatList />
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
  
          {/* ✅ Default Route */}
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </>
  );
  
}

export default App;
