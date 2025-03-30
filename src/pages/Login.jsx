import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/api";
import toast from "react-hot-toast";
import axios from "axios";

const Login = () => {
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const [data, setData] = useState({
    email: "",
    password: ""
  })
  const navigate = useNavigate();


  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const { email, password } = data;
  
  //   try {
  //     const { data: response } = await login(email, password);
  
  //     if (response.error) {
  //       toast.error(response.error);
  //     } else {
  //       toast.success("Login successful");
  //       console.log("Response Data:", response);
  
  //       // ✅ Store authentication data in localStorage
  //       localStorage.setItem("token", response.token);
  //       localStorage.setItem("userObjectId", response.ObjectId); // Store ObjectId
  //       localStorage.setItem("role", response.role); // Store role for future checks
  //       localStorage.setItem("userNo", response.userNo); // Store user number
  
  //       // ✅ If user is a student, store studentId
  //       if (response.role === "student") {
  //         localStorage.setItem("studentId", response.userNo);
  //       }
  
  //       // ✅ Redirect based on user role
  //       switch (response.role) {
  //         case "teacher":
  //           navigate("/teacher");
  //           break;
  //         case "parent":
  //           navigate("/parent");
  //           break;
  //         case "student":
  //           navigate("/student");
  //           break;
  //         case "admin":
  //           navigate("/admin");
  //           break;
  //         default:
  //           navigate("/");
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     toast.error("An error occurred during login");
  //   }
  // };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = data;

    try {
      const { data: response } = await login(email, password);

      // Remove localStorage token storage
      // Only store non-sensitive data
      localStorage.setItem("role", response.role);
      localStorage.setItem("userNo", response.userNo);
      localStorage.setItem("userObjectId", response.ObjectId);

      // ✅ If user is a student, store studentId
      if (response.role === "student") {
        localStorage.setItem("studentId", response.userNo);
      }

      // ✅ Redirect based on user role
      switch (response.role) {
        case "teacher":
          navigate("/teacher");
          break;
        case "parent":
          navigate("/parent");
          break;
        case "student":
          navigate("/student");
          break;
        case "admin":
          navigate("/admin");
          break;
        default:
          navigate("/");
      }

      // Redirect logic remains the same
    } catch (error) {
      console.log("Full error details:", error.response?.data);
      toast.error(error.response?.data?.error || "Login failed");
    }
  };
  
  

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              value={data.password}
              onChange={(e) =>
                setData({ ...data, password: e.target.value.trim() })
              }
              className="w-full px-4 py-2 border rounded-lg"
              required
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-center">
          <span className="text-gray-600">Don't have an account? </span>
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;