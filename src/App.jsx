import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom"; 
import TeacherDashboard from "./pages/Teacher/TeacherDashboard";
import ParentDashboard from "./pages/Parent/ParentDashboard";
import StudentDashboard from "./pages/Student/StudentDashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter> 
      <Navbar />
      <Routes>
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/parent" element={<ParentDashboard />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;