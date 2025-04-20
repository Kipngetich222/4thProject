// import React, { useState, useEffect } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import toast from "react-hot-toast";
// import axios from "axios";

// const Login = () => {
//   const [data, setData] = useState({
//     email: "",
//     password: "",
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const navigate = useNavigate();
//   const { currentUser, login } = useAuth();

//   // Redirect when authenticated
//   useEffect(() => {
//     if (currentUser?.token) {
//       const redirectPaths = {
//         teacher: "/teacher",
//         parent: "/parent",
//         student: "/student",
//         admin: "/admin",
//       };
//       navigate(redirectPaths[currentUser.role] || "/chat");
//     }
//   }, [currentUser, navigate]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       const success = await axios.post("/login",data)/* login(data);*/
//       console.log("Login success:", success);
//       if (!success) {
//         toast.error("Login failed. Please check your credentials");
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       toast.error("An error occurred during login");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };



//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center  text-gray-900">
//       <div className="bg-white p-8 rounded-lg shadow-md w-96">
//         <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
//         <form onSubmit={handleSubmit}>
//           {/* ... your form fields ... */}
//           <div className="mb-4">
//             <label className="block text-gray-700">Email</label>
//             <input
//               type="email"
//               autoComplete="username"
//               value={data.email}
//               onChange={(e) => setData({ ...data, email: e.target.value })}
//               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>
//           <div className="mb-6">
//             <label className="block text-gray-700">Password</label>
//             <input
//               type="password"
//               value={data.password}
//               onChange={(e) => setData({ ...data, password: e.target.value })}
//               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//               autoComplete="current-password"
//             />
//           </div>
//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className={`w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors ${
//               isSubmitting ? "opacity-50 cursor-not-allowed" : ""
//             }`}
//           >
//             {isSubmitting ? "Logging in..." : "Login"}
//           </button>
//         </form>
//         <div className="mt-4 text-center">
//                   <span className="text-gray-600">Don't have an account? </span>
//                   <Link to="/signup" className="text-blue-500 hover:underline">
//                     Sign up
//                   </Link>
//                 </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

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
      const { data: response } = await axios.post('/login', data); 

      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Login successful");
        console.log("Response Data:", response);

       

        localStorage.setItem("token", response.token);
        localStorage.setItem("userObjectId", response.ObjectId);
        localStorage.setItem("role", response.role);
        localStorage.setItem("userNo", response.userNo);
        localStorage.setItem("fname", response.fname);
        localStorage.setItem("lname", response.lname);

        if (response.role === "teacher") {  // ✅ Corrected role name
          console.log("subjects", response.subjects)
          localStorage.setItem("subjects", JSON.stringify(response.subjects)); // ✅ Store subjects as JSON
        }

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
      }
     }
     //catch (error) {
    //   console.log(error);
    //   toast.error("An error occurred during login");
    // }
    catch (error) {
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center  text-gray-900">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
            Login
          </button>
        </form>
        <div className="mt-4 text-center">
          <span className="text-gray-600">Don't have an account? Contact us at </span>
          <a href="tel:+254729292929" className="text-blue-500 hover:underline">
            +254 729 292 929
          </a>
        </div>

      </div>
    </div>
  );
};

export default Login;
