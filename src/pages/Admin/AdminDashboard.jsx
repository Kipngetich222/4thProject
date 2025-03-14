import React, { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

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
      //setUsers(response.data);
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
  const handleAddUser = async () => {
       navigate("/admin/adduser");
  }
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-red-800 mb-6">Admin Dashboard</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">User Management</h2>
        <div className="flex items-center justify-between mb-4">
            {/* <h2 className="text-xl font-semibold text-gray-800">User Management</h2> */}
          <button
            onClick={handleAddUser} // Replace with your functionality
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add User
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">UserNo</th>
              <th className="text-left">Name</th>
              <th className="text-left">Email</th>
              <th className="text-left">Role</th>
              <th className="text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.userNo}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;