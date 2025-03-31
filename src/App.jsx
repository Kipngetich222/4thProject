import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
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
//import SubmitAssignment from "./pages/Student/AssinementSumition.jsx";
import StudentAssignmentList from "./pages/Student/viewAssinments.jsx";
import StudentAssignmentDetail from "./pages/Student/AssinmentDetails.jsx";
import MarkSubmission from "./pages/Teacher/MarkAssinments.jsx";
import AddParents from "./pages/Admin/parentsForm.jsx";
import ChatPage from "./pages/message/ChatPage.jsx";
import EnterGrades from "./pages/Teacher/Entergrades.jsx"
import SessionForm from "./pages/Admin/Session.jsx";
import ExamForm from "./pages/Admin/CreateExam.jsx";
import AssignTeacher from "./pages/Admin/AssignTeachers.jsx";
import AddClassForm from "./pages/Admin/AddClass.jsx";

axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.withCredentials = true;

// ✅ Main App component
function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

// ✅ AppContent component to conditionally render Navbar
function AppContent() {
  const location = useLocation();

  // Define routes where Navbar should NOT be displayed
  const noNavbarRoutes = ["/login", "/signup"];
  const showNavbar = !noNavbarRoutes.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      <Routes>
        {/* ✅ Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/admin/adduser" element={<AddUser />} />
        <Route path="/message" element={<ChatPage/>}/>


        {/* ✅ Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/test" element={<AdminTeacher />} />
        <Route path="/admin/teacher" element={<TeacherForm />} />
        <Route path="/admin/student" element={<AddStudent />} />
        <Route path="/admin/parent" element={<AddParents/>}/>
        <Route path="/admin/session" element={<SessionForm/>}/>
        <Route path="/admin/createexam" element={<ExamForm/>}/>
        <Route path="/admin/assignteacher" element={<AssignTeacher/>} />
        <Route path="/admin/addClass" element={<AddClassForm/>}  />


        {/* ✅ Teacher Routes */}
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/teacher/grades" element={<TeacherGrades />} />
        <Route path="/teacher/uploadassignment" element={<UploadAssignment />} />
        <Route path="/teacher/assignments" element={<AssignmentList />} />
        <Route path="/teacher/assignments/:assignmentId/submissions" element={<SubmissionsList />} />
        <Route path="/teacher/assignments/submissions/mark/:submissionId" element={<MarkSubmission />} />
        <Route path="/teacher/attendance" element={<Attendance />} />
        <Route path="/teacher/entergrades" element={<EnterGrades/>}/>

        {/* ✅ Student Routes */}
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/student/assignments" element={<StudentAssignmentList />} />
        <Route path="/student/assignments/:assignmentId" element={<StudentAssignmentDetail />} />

        {/* ✅ Parent Routes */}
        <Route path="/parent" element={<ParentDashboard />} />

        {/* ✅ Default Route */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
}

export default App;
