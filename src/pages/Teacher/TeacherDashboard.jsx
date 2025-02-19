import React from "react";

const TeacherDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">Teacher Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800">Upload Grades</h2>
          <p className="text-gray-600 mt-2">Upload and manage student grades.</p>
          <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Upload
          </button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800">Manage Attendance</h2>
          <p className="text-gray-600 mt-2">Mark and update attendance records.</p>
          <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Manage
          </button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800">Communicate with Parents</h2>
          <p className="text-gray-600 mt-2">Send messages and updates to parents.</p>
          <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;