

// import React from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import Login from "./pages/Login";
// import AddUser from "./pages/AddUser.jsx";
// import TeacherDashboard from "./pages/Teacher/TeacherDashboard";
// import ParentDashboard from "./pages/Parent/ParentDashboard";
// import StudentDashboard from "./pages/Student/StudentDashboard";
// import AdminDashboard from "./pages/Admin/AdminDashboard";
// import { AuthProvider, useAuth } from "./context/AuthContext";
// import { Toaster } from "react-hot-toast";
// import  TeacherGrades from "./pages/Teacher/grades.jsx";
// import axios from "axios";
// import AdminTeacher from "./pages/Admin/testt.jsx";
// import Tester from "./pages/Admin/adminTeacher.jsx";
// import TeacherForm from "./pages/Admin/TeacherForm.jsx";
// import UploadAssignment from "./pages/Teacher/AssingmentUpload.jsx";
// import AssignmentList from "./pages/Teacher/ViewAssinements.jsx";
// import Attendance from "./pages/Teacher/Attendance.jsx";
// import AddStudent from "./pages/Admin/AdminStudent.jsx";
// import SubmissionsList from "./pages/Teacher/SubmissionsList.jsx";
// import SubmitAssignment from "./pages/Student/AssinementSumition.jsx"
// import StudentAssignmentList from './pages/Student/viewAssinments.jsx';
// import StudentAssignmentDetail from './pages/Student/AssinmentDetails.jsx';
// // import SubmissionsList from './pages/Teacher/SubmissionsList.jsx';
// import MarkSubmission from './pages/Teacher/MarkAssinments.jsx';

// axios.defaults.baseURL = 'http://localhost:5000';
// axios.defaults.withCredentials = true;

// // ProtectedRoute component to restrict access based on user role
// const ProtectedRoute = ({ children, requiredRole }) => {
//   const { user } = useAuth();

//   if (!user) {
//     return <Navigate to="/login" />; // Redirect to login if not authenticated
//   }

//   if (user.role !== requiredRole) {
//     return <Navigate to="/" />; // Redirect to home or unauthorized page
//   }

//   return children;
// };

// // Main App component
// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <AppContent />
//       </Router>
//     </AuthProvider>
//   );
// }

// // AppContent component to conditionally render Navbar
// function AppContent() {
//   const location = useLocation();
//   const { user } = useAuth();

//   // Define routes where Navbar should not be displayed
//   const noNavbarRoutes = ["/login", "/signup"];

//   // Check if the current route is in the noNavbarRoutes array
//   const showNavbar = !noNavbarRoutes.includes(location.pathname);

//   return (
//     <>
//       {showNavbar && <Navbar />}
//       <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
//       <Routes>
//         {/* Public Routes */}
//         <Route path="/login" element={<Login />} />
//         <Route path="/admin/adduser" element={<AddUser />} />

//         {/* Unprotected Dashboard Routes */}
//         <Route path="/teacher" element={<TeacherDashboard />} />
//         <Route path="/parent" element={<ParentDashboard />} />
//         <Route path="/student" element={<StudentDashboard />} />
//         <Route path="/admin" element={<AdminDashboard />} />
//         <Route path="/teacher/grades" element={<TeacherGrades />} />
//         <Route path="/admin/test" element={<AdminTeacher />} />
//         <Route path="/admin/teacher" element={<TeacherForm />} />
//         <Route path="/admin/teacherform" element={<TeacherForm />} />
//         <Route path="/teacher/uploadassignment" element={<UploadAssignment />} />
//         <Route path="/teacher/assignments" element={<AssignmentList/>}/>
//         {/* <Route path="/student/assingments" element={<AssignmentList/>}/> */}
//         <Route path="/teacher/atendance" element={<Attendance/>}/>
//         <Route path="/admin/student:studentId" element={<AddStudent/>}/>
//         {/* <Route path="/teacher/submissions" element={<SubmissionsList/>}/> */}
//         <Route path="/student/assignments" element={<StudentAssignmentList />} />
//         <Route path = "/teacher/assignments/:assignmentId/submissions" element={<SubmissionsList/>}/>
//         <Route path="/student/assingments/submissions" element={<SubmissionsList/>}/>
//         {/* <Route path="/submit-assignment/:assignmentId" element={<SubmitAssignment />} /> */}
//         <Route path="/student/assignments/:assignmentId" element={<StudentAssignmentDetail />} />
//       <Route path="/teacher/assingments/submissions/mark/:submissionId" element={<MarkSubmission/>}/>



//         {/* Default Route */}
//         <Route path="/" element={<Navigate to="/login" />} />
//       </Routes>
//     </>
//   );
// }

// export default App;


// import React from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import Login from "./pages/Login";
// import AddUser from "./pages/AddUser.jsx";
// import TeacherDashboard from "./pages/Teacher/TeacherDashboard";
// import ParentDashboard from "./pages/Parent/ParentDashboard";
// import StudentDashboard from "./pages/Student/StudentDashboard";
// import AdminDashboard from "./pages/Admin/AdminDashboard";
// import { AuthProvider, useAuth } from "./context/AuthContext";
// import { Toaster } from "react-hot-toast";
// import TeacherGrades from "./pages/Teacher/grades.jsx";
// import axios from "axios";
// import AdminTeacher from "./pages/Admin/testt.jsx";
// import TeacherForm from "./pages/Admin/TeacherForm.jsx";
// import UploadAssignment from "./pages/Teacher/AssingmentUpload.jsx";
// import AssignmentList from "./pages/Teacher/ViewAssinements.jsx";
// import Attendance from "./pages/Teacher/Attendance.jsx";
// import AddStudent from "./pages/Admin/AdminStudent.jsx";
// import SubmissionsList from "./pages/Teacher/SubmissionsList.jsx";
// import SubmitAssignment from "./pages/Student/AssinementSumition.jsx";
// import StudentAssignmentList from "./pages/Student/viewAssinments.jsx";
// import StudentAssignmentDetail from "./pages/Student/AssinmentDetails.jsx";
// import MarkSubmission from "./pages/Teacher/MarkAssinments.jsx";

// axios.defaults.baseURL = "http://localhost:5000";
// axios.defaults.withCredentials = true;

// // ✅ ProtectedRoute component to restrict access based on user role
// const ProtectedRoute = ({ children, requiredRole }) => {
//   const { user } = useAuth();

//   if (!user) return <Navigate to="/login" />; // Redirect to login if not authenticated

//   if (requiredRole && user.role !== requiredRole) return <Navigate to="/" />; // Restrict access based on role

//   return children;
// };

// // ✅ Main App component
// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <AppContent />
//       </Router>
//     </AuthProvider>
//   );
// }

// // ✅ AppContent component to conditionally render Navbar
// function AppContent() {
//   const location = useLocation();
//   const { user } = useAuth();

//   // Define routes where Navbar should NOT be displayed
//   const noNavbarRoutes = ["/login", "/signup"];
//   const showNavbar = !noNavbarRoutes.includes(location.pathname);

//   return (
//     <>
//       {showNavbar && <Navbar />}
//       <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
//       <Routes>
//         {/* ✅ Public Routes */}
//         <Route path="/login" element={<Login />} />
//         <Route path="/admin/adduser" element={<AddUser />} />

//         {/* ✅ Admin Routes */}
//         <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
//         <Route path="/admin/test" element={<ProtectedRoute requiredRole="admin"><AdminTeacher /></ProtectedRoute>} />
//         <Route path="/admin/teacher" element={<ProtectedRoute requiredRole="admin"><TeacherForm /></ProtectedRoute>} />
//         <Route path="/admin/teacherform" element={<ProtectedRoute requiredRole="admin"><TeacherForm /></ProtectedRoute>} />
//         <Route path="/admin/student" element={<ProtectedRoute requiredRole="admin"><AddStudent /></ProtectedRoute>} />

//         {/* ✅ Teacher Routes */}
//         <Route path="/teacher" element={<ProtectedRoute requiredRole="teacher"><TeacherDashboard /></ProtectedRoute>} />
//         <Route path="/teacher/grades" element={<ProtectedRoute requiredRole="teacher"><TeacherGrades /></ProtectedRoute>} />
//         <Route path="/teacher/uploadassignment" element={<ProtectedRoute requiredRole="teacher"><UploadAssignment /></ProtectedRoute>} />
//         <Route path="/teacher/assignments" element={<ProtectedRoute requiredRole="teacher"><AssignmentList /></ProtectedRoute>} />
//         <Route path="/teacher/assignments/:assignmentId/submissions" element={<ProtectedRoute requiredRole="teacher"><SubmissionsList /></ProtectedRoute>} />
//         <Route path="/teacher/assignments/submissions/mark/:submissionId" element={<ProtectedRoute requiredRole="teacher"><MarkSubmission /></ProtectedRoute>} />
//         <Route path="/teacher/attendance" element={<ProtectedRoute requiredRole="teacher"><Attendance /></ProtectedRoute>} />

//         {/* ✅ Student Routes */}
//         <Route path="/student" element={<ProtectedRoute requiredRole="student"><StudentDashboard /></ProtectedRoute>} />
//         <Route path="/student/assignments" element={<ProtectedRoute requiredRole="student"><StudentAssignmentList /></ProtectedRoute>} />
//         <Route path="/student/assignments/:assignmentId" element={<ProtectedRoute requiredRole="student"><StudentAssignmentDetail /></ProtectedRoute>} />

//         {/* ✅ Parent Routes */}
//         <Route path="/parent" element={<ProtectedRoute requiredRole="parent"><ParentDashboard /></ProtectedRoute>} />

//         {/* ✅ Default Route */}
//         <Route path="/" element={<Navigate to="/login" />} />
//       </Routes>
//     </>
//   );
// }

// export default App;

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
import SubmitAssignment from "./pages/Student/AssinementSumition.jsx";
import StudentAssignmentList from "./pages/Student/viewAssinments.jsx";
import StudentAssignmentDetail from "./pages/Student/AssinmentDetails.jsx";
import MarkSubmission from "./pages/Teacher/MarkAssinments.jsx";
import AddParents from "./pages/Admin/parentsForm.jsx";

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

        {/* ✅ Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/test" element={<AdminTeacher />} />
        <Route path="/admin/teacher" element={<TeacherForm />} />
        <Route path="/admin/student" element={<AddStudent />} />
        <Route path="/admin/parent" element={<AddParents/>}/>


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

        {/* ✅ Default Route */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
}

export default App;
