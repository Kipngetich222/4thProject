import React from "react";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-red-800 mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800">User Management</h2>
          <p className="text-gray-600 mt-2">Add, update, or delete users.</p>
          <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Manage
          </button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800">Monitor Activities</h2>
          <p className="text-gray-600 mt-2">View platform usage statistics.</p>
          <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            View
          </button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800">System Operations</h2>
          <p className="text-gray-600 mt-2">Ensure smooth functionality.</p>
          <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Manage
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;