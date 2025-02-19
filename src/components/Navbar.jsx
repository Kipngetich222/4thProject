import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">
          Teacher-Parent Platform
        </Link>
        <div className="space-x-4">
          <Link to="/teacher" className="text-white hover:text-gray-200">
            Teacher
          </Link>
          <Link to="/parent" className="text-white hover:text-gray-200">
            Parent
          </Link>
          <Link to="/student" className="text-white hover:text-gray-200">
            Student
          </Link>
          <Link to="/admin" className="text-white hover:text-gray-200">
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;