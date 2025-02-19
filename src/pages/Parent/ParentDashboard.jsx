import React from "react";

const ParentDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-green-800 mb-6">Parent Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800">Student Performance</h2>
          <p className="text-gray-600 mt-2">View grades and progress reports.</p>
          <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            View
          </button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800">Attendance Records</h2>
          <p className="text-gray-600 mt-2">Check your child's attendance.</p>
          <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Check
          </button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800">Communicate with Teachers</h2>
          <p className="text-gray-600 mt-2">Send messages to teachers.</p>
          <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;