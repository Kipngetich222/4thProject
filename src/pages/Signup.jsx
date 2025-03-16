import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    user_id: "",
    fname: "",
    sname: "",
    lname: "",
    email: "",
    password: "",
    role: ""
  });

  const registerUser = async (e) => {
    e.preventDefault();
    const { user_id, fname, sname, lname, email, password, role } = data;
    try {
      const { data } = await axios.post('/register', {
        user_id, fname, sname, lname, email, password, role
      });
      if (data.error) {
        toast.error(data.error);
      } else {
        setData({});
        toast.success("Registration successful");
        navigate('/login');
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred during registration");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
        <form onSubmit={registerUser}>
          <div className="mb-4">
            <label className="block text-gray-700">User No</label>
            <input
              type="text"
              placeholder="Enter user number"
              value={data.user_id}
              onChange={(e) => setData({ ...data, user_id: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">First Name</label>
            <input
              type="text"
              placeholder="Enter first name"
              value={data.fname}
              onChange={(e) => setData({ ...data, fname: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Second Name</label>
            <input
              type="text"
              placeholder="Enter second name"
              value={data.sname}
              onChange={(e) => setData({ ...data, sname: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Last Name</label>
            <input
              type="text"
              placeholder="Enter last name"
              value={data.lname}
              onChange={(e) => setData({ ...data, lname: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Role</label>
            <select
              id="role"
              value={data.role}
              onChange={(e) => setData({ ...data, role: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option>Select role</option>
              <option value="admin">Admin</option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="parent">Parent</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
