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


  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = data;

    try {
      const response = await login(email, password);

      // Verify token exists in response
      if (!response.data.token) {
        throw new Error("Authentication token missing in response");
      }

      // Store token and user data
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("userNo", response.data.userNo);
      localStorage.setItem("userObjectId", response.data.ObjectId);

      if (response.data.role === "student") {
        localStorage.setItem("studentId", response.data.userNo);
      }

      // Redirect based on role
      const redirectPaths = {
        teacher: "/teacher",
        parent: "/parent",
        student: "/student",
        admin: "/admin",
      };

      navigate(redirectPaths[response.data.role] || "/");
    } catch (error) {
      console.error("Login error:", error);
      toast.error(
        error.response?.data?.error ||
          error.message ||
          "Login failed. Please try again."
      );
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
              autoComplete="username"
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