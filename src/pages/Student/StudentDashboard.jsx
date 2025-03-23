import React from "react";
import { useNavigate } from "react-router-dom";
const StudentDashboard = () => {
  const navigate = useNavigate();

  const navigateAssingment = () =>{
    navigate("/student/assignments")
  }
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-purple-800 mb-6">Student Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800">Homework</h2>
          <p className="text-gray-600 mt-2">View and submit assignments.</p>
          <button className="mt-4 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600" onClick={navigateAssingment}>
            View
          </button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800">Chat with Classmates</h2>
          <p className="text-gray-600 mt-2">Connect with fellow students.</p>
          <button className="mt-4 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
            Chat
          </button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800">Request Guidance</h2>
          <p className="text-gray-600 mt-2">Ask teachers for help.</p>
          <button className="mt-4 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
            Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;