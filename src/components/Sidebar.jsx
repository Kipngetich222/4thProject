import React from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

const Sidebar = ({ isOpen, onToggle }) => {
  const role = ["admin", "teacher", "student", "parent"].includes(localStorage.getItem("role"))
    ? localStorage.getItem("role")
    : null;

  const commonLinks = [
    { path: "/profile", label: "Profile" },
    { path: "/chat", label: "Messages" },
  ];

  const roleBasedLinks = {
    admin: [
      { path: "/admin", label: "Dashboard" },
      { path: "/admin/adduser", label: "Add User" },
      { path: "/admin/student", label: "Add Student" },
      { path: "/admin/parent", label: "Add Parent" },
      { path: "/admin/teacher", label: "Add Teacher" },
      { path: "/admin/session", label: "Session" },
      { path: "/admin/createexam", label: "Create Exam" },
      { path: "/admin/addClass", label: "Add Class" },
    ],
    teacher: [
      { path: "/teacher", label: "Dashboard" },
      { path: "/teacher/uploadassignment", label: "Upload Assignment" },
      { path: "/teacher/grades", label: "Grades" },
      { path: "/teacher/assignments", label: "Assignments" },
      { path: "/teacher/attendance", label: "Attendance" },
    ],
    student: [
      { path: "/student", label: "Dashboard" },
      { path: "/student/assignments", label: "Assignments" },
    ],
    parent: [
      { path: "/parent", label: "Dashboard" },
      { path: "/parent/performce", label: "Performance" },
    ],
  };

  const linksToRender = role ? [...(roleBasedLinks[role] || []), ...commonLinks] : commonLinks;

  return (
    <aside className={`w-64 h-full bg-blue-600 text-white transition-all duration-300 ${
      isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
    }`}>
      <div className="p-4 h-full overflow-y-auto">
        <h2 className="text-xl font-bold mb-6">Menu ({role})</h2>
        <ul className="space-y-2">
          {linksToRender.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className="block px-4 py-2 hover:bg-blue-500 rounded-md transition-colors"
                onClick={() => {
                  if (window.innerWidth < 768) {
                    onToggle();
                  }
                }}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
