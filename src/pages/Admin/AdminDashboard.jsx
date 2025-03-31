import React, { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // ✅ State for search input

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      const formattedUsers = response.data.map((user) => ({
        ...user,
        name: `${user.fname} ${user.sname} ${user.lname}`,
      }));
      setUsers(formattedUsers);
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while fetching users");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      fetchUsers();
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while deleting user");
    }
  };

  const handleAddUser = () => {
    navigate("/admin/adduser");
  };

  // ✅ Filter users based on search query
  const filteredUsers = users.filter((user) =>
    user.userNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-red-800 mb-6">Admin Dashboard</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">User Management</h2>

        {/* ✅ Search Input */}
        <div className="flex justify-between items-center mb-4">
          {/* <input
            type="text"
            placeholder="Search by UserNo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border p-2 rounded-md w-1/3"
          /> */}
          <input
            type="text"
            placeholder="🔍 Search by UserNo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-400 p-3 rounded-md w-1/3 text-black text-lg placeholder-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          <button
            onClick={handleAddUser}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add User
          </button>
        </div>

        {/* ✅ Users Table */}
        <table className="w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="text-left text-black px-4 py-2">UserNo</th>
              <th className="text-left text-black px-4 py-2">Name</th>
              <th className="text-left text-black px-4 py-2">Email</th>
              <th className="text-left text-black px-4 py-2">Role</th>
              <th className="text-left text-black px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr key={user._id} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                  <td className="text-black border px-4 py-2">{user.userNo}</td>
                  <td className="text-black border px-4 py-2">{user.name}</td>
                  <td className="text-black border px-4 py-2">{user.email}</td>
                  <td className="text-black border px-4 py-2">{user.role}</td>
                  <td className="text-black border px-4 py-2">
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
