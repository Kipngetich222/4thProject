import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

const Sidebar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(true); // initialized but fixed in useEffect
  // const role = localStorage.getItem("role");
  const role = ["admin", "teacher", "student", "parent"].includes(localStorage.getItem("role"))
  ? localStorage.getItem("role")
  : null;

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    const handleResize = () => {
      const isMobileNow = window.innerWidth < 768;
      setIsMobile(isMobileNow);
      setIsOpen(!isMobileNow); // Show on desktop, hide on mobile
    };

    handleResize(); // run once at mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  //const linksToRender = [...(roleBasedLinks[role] || []), ...commonLinks];
  const linksToRender = role ? [...(roleBasedLinks[role] || []), ...commonLinks] : commonLinks;

  return (
    <>
      {/* Toggle Button */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 text-white bg-indigo-700 p-2 rounded-md md:hidden"
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      )}

      {/* Sidebar */}
      {/* <aside
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transform fixed top-0 left-0 h-full w-64 bg-indigo-700 text-white transition-transform duration-300 z-40 md:translate-x-0`}
      > */}
      <aside
        className={`${isOpen ? "translate-x-0" : "-translate-x-full"
          } transform fixed top-16 left-0 h-[calc(100%-4rem)] w-64 bg-indigo-700 text-white transition-transform duration-300 z-40 md:translate-x-0`}
      >

        <div className="p-5">
          <h2 className="text-xl font-bold mb-6">Menu ({role})</h2>
          <ul className="space-y-4">
            {linksToRender.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className="block hover:bg-indigo-600 rounded px-3 py-2 transition"
                  onClick={() => isMobile && setIsOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
