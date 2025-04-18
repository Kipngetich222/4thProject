import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { currentUser, login } = useAuth();

  // Redirect when authenticated
  useEffect(() => {
    if (currentUser?.token) {
      const redirectPaths = {
        teacher: "/teacher",
        parent: "/parent",
        student: "/student",
        admin: "/admin",
      };
      navigate(redirectPaths[currentUser.role] || "/chat");
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const success = await login(data);
      if (!success) {
        toast.error("Login failed. Please check your credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <form onSubmit={handleSubmit}>
          {/* ... your form fields ... */}
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              autoComplete="username"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Logging in..." : "Login"}
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
