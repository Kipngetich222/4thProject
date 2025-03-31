import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function AddUser() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    fname: "",
    sname: "",
    lname: "",
    email: "",
    password: "",
    role: "",
    gender: "",
  });

  const [userNo, setUserNo] = useState(null); // State to store the generated userNo

  // const registerUser = async (e) => {
  //   e.preventDefault(); // Prevent form reload
  //   const { fname, sname, lname, email, password, role, gender } = data;

  //   try {
  //     // Make POST request to the backend
  //     const response = await axios.post("/admin/register", {
  //       fname,
  //       sname,
  //       lname,
  //       email,
  //       password,
  //       role,
  //       gender,
  //     });

  //     // Handle server response
  //     console.log("Response", response.data)
  //     if (response.data.error) {
  //       toast.error(response.data.error);
  //       console.log(response.data);
  //     } else {
  //       const generatedUserNo = response.data.userNo;
  //       setUserNo(generatedUserNo); // Save userNo in state
  //       localStorage.setItem("userNo", generatedUserNo); // Store userNo in local storage
  //       toast.success(`Registration successful! UserNo: ${generatedUserNo}`);

  //       // Navigate based on role
  //       const roleRoutes = {
  //         teacher: "/admin/teacher",
  //         student: "/admin/student",
  //         parent: "/admin/parent",
  //         admin: "/admin/dashboard",
  //       };

  //       navigate(roleRoutes[role] || "/admin/dashboard", {
  //         state: { userNo: generatedUserNo },
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Registration error:", error);
  //     toast.error("An error occurred during registration.");
  //   }
  // };


  const registerUser = async (e) => {
    e.preventDefault(); // Prevent form reload

    const { fname, sname, lname, email, password, role, gender } = data || {}; // Ensure data exists

    try {
      // Make POST request to the backend
      const response = await axios.post("/admin/register", {
        fname,
        sname,
        lname,
        email,
        password,
        role,
        gender,
      });

      // Handle server response
      console.log("Response:", response.data);

      if (response.data?.error) {
        toast.error(response.data.error);
        console.error("Server Error:", response.data.error);
        return; // Stop execution if there is an error
      }

      const generatedUserNo = response.data.userNo;
      setUserNo(generatedUserNo); // Save userNo in state
      localStorage.setItem("NewuserNo", generatedUserNo); // Store userNo in local storage
      toast.success(`Registration successful! UserNo: ${generatedUserNo}`);

      // Define role-based navigation
      const roleRoutes = {
        teacher: "/admin/teacher",
        student: "/admin/student",
        parent: "/admin/parent",
        admin: "/admin/dashboard",
      };

      // Ensure valid role before navigating
      const targetRoute = roleRoutes[role] || "/admin/dashboard";
      navigate(targetRoute, { state: { userNo: generatedUserNo } });

      // } catch (error) {
      //   console.error("Registration error:", error);
      //   toast.error("An error occurred during registration.");
      // }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        console.error("Registration error:", error.response.data.error);
        toast.error(error.response.data.error); // Show backend error message
      } else {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred.");
      }
    }

  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-black">Register</h1>
        <form onSubmit={registerUser}>
          {/* First Name */}
          <div className="mb-4">
            <label className="block text-gray-700">First Name</label>
            <input
              type="text"
              placeholder="Enter first name"
              value={data.fname}
              onChange={(e) => setData({ ...data, fname: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
              required
            />
          </div>

          {/* Second Name */}
          <div className="mb-4">
            <label className="block text-gray-700">Second Name</label>
            <input
              type="text"
              placeholder="Enter second name"
              value={data.sname}
              onChange={(e) => setData({ ...data, sname: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
            />
          </div>

          {/* Last Name */}
          <div className="mb-4">
            <label className="block text-gray-700">Last Name</label>
            <input
              type="text"
              placeholder="Enter last name"
              value={data.lname}
              onChange={(e) => setData({ ...data, lname: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
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
              className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
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
              className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
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
              className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
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
              className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
              required
            />
          </div>

          {/* Display Generated User No After Registration */}
          {userNo && (
            <p className="text-green-600 font-bold text-center mt-2">
              Assigned User No: {userNo}
            </p>
          )}

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

export default AddUser;