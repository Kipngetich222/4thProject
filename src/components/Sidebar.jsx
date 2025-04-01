import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { user } = useAuth(); // Get logged-in user info

  // Define sidebar links based on user role
  const sidebarLinks = {
    admin: [
      { path: "/admin", label: "Dashboard" },
      { path: "/admin/adduser", label: "Add User" },
      { path: "/admin/teacher", label: "Manage Teachers" },
      { path: "/admin/student", label: "Manage Students" },
      { path: "/admin/parent", label: "Manage Parents" },
    ],
    teacher: [
      { path: "/teacher", label: "Dashboard" },
      { path: "/teacher/grades", label: "Grades" },
      { path: "/teacher/uploadassignment", label: "Upload Assignment" },
      { path: "/teacher/assignments", label: "Assignments" },
      { path: "/teacher/attendance", label: "Attendance" },
    ],
    student: [
      { path: "/student", label: "Dashboard" },
      { path: "/student/assignments", label: "Assignments" },
    ],
    parent: [
      { path: "/parent", label: "Dashboard" },
    ],
  };

  // Get user's role or fallback to empty array
  const links = sidebarLinks[user?.role] || [];

  return (
    <div className="w-64 h-screen bg-gray-800 text-white fixed left-0 top-0 p-4">
      <h2 className="text-xl font-bold mb-4">Menu</h2>
      <ul>
        {links.map((link) => (
          <li key={link.path} className="mb-2">
            <Link to={link.path} className="hover:text-gray-300">{link.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
