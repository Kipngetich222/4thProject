// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { signup } from "../services/api";

// const Signup = () => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState("teacher");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await signup(name, email, password, role);
//       alert("Signup successful");
//       navigate("/login");
//     } catch (error) {
//       alert("Signup failed");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//       <div className="bg-white p-8 rounded-lg shadow-md w-96">
//         <h1 className="text-2xl font-bold mb-6 text-center">Signup</h1>
//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label className="block text-gray-700">Name</label>
//             <input
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="w-full px-4 py-2 border rounded-lg"
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700">Email</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full px-4 py-2 border rounded-lg"
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700">Password</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full px-4 py-2 border rounded-lg"
//               required
//             />
//           </div>
//           <div className="mb-6">
//             <label className="block text-gray-700">Role</label>
//             <select
//               value={role}
//               onChange={(e) => setRole(e.target.value)}
//               className="w-full px-4 py-2 border rounded-lg"
//             >
//               <option value="teacher">Teacher</option>
//               <option value="parent">Parent</option>
//               <option value="student">Student</option>
//               {/* <option value="admin">Admin</option> */}
//             </select>
//           </div>
//           <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
//             Signup
//           </button>
//         </form>
//         <div className="mt-4 text-center">
//           <span className="text-gray-600">Have an account? </span>
//           <Link to="/login" className="text-blue-500 hover:underline">
//             Login
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Signup;

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
    const { userNo, fname, sname, lname, email, password, role, gender } = data;
    try {
      const { data } = await axios.post('/register', {
        userNo, fname, sname, lname, email, password, role, gender
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
              value={data.userNo}
              onChange={(e) => setData({ ...data, userNo: e.target.value })}
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
            <label className="block text-gray-700">Role</label>
            <select
              id="gender"
              value={data.role}
              onChange={(e) => setData({ ...data, gender: e.target.value })}
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
