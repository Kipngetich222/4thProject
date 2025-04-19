import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Tester() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    userNo: "",
    department : "",
    subjects: "",
    contactNo : ""
  });

  const registerUser = async (e) => {
    e.preventDefault(); // Prevent form reload
    const { userNo, department, subjects, contactNo } = data;

    try {
      // Make POST request to the backend
      const response = await axios.post("admin/student", {
        userNo,
        department,
        subjects,
        contactNo
      });

      // Handle server response
      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        toast.success("Registration successful!");
        navigate("/admin");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("An error occurred during registration.");
    }
  };

  

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
        <form onSubmit={registerUser}>
          {/* User No */}
          <div className="mb-4">
            <label className="block text-gray-700">User No</label>
            <input
              type="text"
              placeholder="Enter user number"
              value={data.userNo}
              onChange={(e) => setData({ ...data, userNo: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          {/* First Name */}
          <div className="mb-4">
            <label className="block text-gray-700">department</label>
            <input
              type="text"
              placeholder="Enter first name"
              value={data.department}
              onChange={(e) => setData({ ...data, department: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          {/* Second Name */}
          <div className="mb-4">
            <label className="block text-gray-700">Subjects</label>
            <input
              type="text"
              placeholder="Enter second name"
              value={data.subjects}
              onChange={(e) => setData({ ...data, subjects: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          {/* Last Name */}
          <div className="mb-4">
            <label className="block text-gray-700">Contact No</label>
            <input
              type="text"
              placeholder="Enter last name"
              value={data.contactNo}
              onChange={(e) => setData({ ...data, contactNo: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          {/* Email */}
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

          {/* Role */}
          <div className="mb-4">
            <label className="block text-gray-700">Role</label>
            <select
              id="role"
              value={data.role}
              onChange={(e) => setData({ ...data, role: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              required
            >
              <option value="">Select role</option>
              <option value="admin">Admin</option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="parent">Parent</option>
            </select>
          </div>

          {/* Gender */}
          <div className="mb-4">
            <label className="block text-gray-700">Gender</label>
            <select
              id="gender"
              value={data.gender}
              onChange={(e) => setData({ ...data, gender: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              required
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Password */}
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

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Tester;
