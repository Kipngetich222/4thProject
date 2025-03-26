import React from "react";
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
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import  TeacherGrades from "./pages/Teacher/grades.jsx";
import axios from "axios";
import AdminTeacher from "./pages/Admin/testt.jsx";
import Tester from "./pages/Admin/adminTeacher.jsx";
import TeacherForm from "./pages/Admin/TeacherForm.jsx";
import UploadAssignment from "./pages/Teacher/AssingmentUpload.jsx";
import AssignmentList from "./pages/Teacher/ViewAssinements.jsx";
import Attendance from "./pages/Teacher/Attendance.jsx";
import AddStudent from "./pages/Admin/AdminStudent.jsx";
import SubmissionsList from "./pages/Teacher/SubmissionsList.jsx";
import SubmitAssignment from "./pages/Student/AssinementSumition.jsx"
import StudentAssignmentList from './pages/Student/viewAssinments.jsx';
import StudentAssignmentDetail from './pages/Student/AssinmentDetails.jsx';
// import SubmissionsList from './pages/Teacher/SubmissionsList.jsx';
import MarkSubmission from './pages/Teacher/MarkAssinments.jsx';

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
        <Route path="/admin/teacher" element={<Tester />} />
        <Route path="/admin/teacherform" element={<TeacherForm />} />
        <Route path="/teacher/uploadassignment" element={<UploadAssignment />} />
        <Route path="/teacher/assignments" element={<AssignmentList/>}/>
        {/* <Route path="/student/assingments" element={<AssignmentList/>}/> */}
        <Route path="/teacher/atendance" element={<Attendance/>}/>
        <Route path="/admin/student" element={<AddStudent/>}/>
        {/* <Route path="/teacher/submissions" element={<SubmissionsList/>}/> */}
        <Route path="/student/assignments" element={<StudentAssignmentList />} />
        <Route path = "/teacher/assignments/:assignmentId/submissions" element={<SubmissionsList/>}/>
        <Route path="/student/assingments/submissions" element={<SubmissionsList/>}/>
        {/* <Route path="/submit-assignment/:assignmentId" element={<SubmitAssignment />} /> */}
        <Route path="/student/assignments/:assignmentId" element={<StudentAssignmentDetail />} />
      <Route path="/teacher/assingments/submissions/mark/:submissionId" element={<MarkSubmission/>}/>



        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
}

export default App;
