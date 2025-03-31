// import { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";
// import toast from "react-hot-toast";

// function ParentForm() {
//     const navigate = useNavigate();
//     const [data, setData] = useState({
//       fname: "",
//       sname: "",
//       lname: "",
//       email: "",
//       password: "",
//       role: "",
//       gender: "",
//     });
  
//     const [userNo, setUserNo] = useState(null); // State to store the generated userNo
  
//     const registerUser = async (e) => {
//       e.preventDefault(); // Prevent form reload
//       const {userNo, fname, sname, lname, email, password, role, gender, contactNo } = data;
  
//       try {
//         // Make POST request to the backend
//         const response = await axios.post("/admin/register/parent", {
//           userNo,
//           fname,
//           sname,
//           lname,
//           email,
//           password,
//           role,
//           gender,

//         });
  
//         // Handle server response
//         if (response.data.error) {
//           toast.error(response.data.error);
//           console.log(response.data);
//         } else {
//           const generatedUserNo = response.data.userNo;
//           setUserNo(generatedUserNo); // Save userNo in state
//           localStorage.setItem("userNo", generatedUserNo); // Store userNo in local storage
//           toast.success(`Registration successful! UserNo: ${generatedUserNo}`);
  
//           // Navigate based on role
//           const roleRoutes = {
//             teacher: "/admin/teacher",
//             student: "/admin/student",
//             parent: "/admin/parent",
//             admin: "/admin/dashboard",
//           };
  
//           navigate(roleRoutes[role] || "/admin/dashboard", {
//             state: { userNo: generatedUserNo },
//           });
//         }
//       } catch (error) {
//         console.error("Registration error:", error);
//         toast.error("An error occurred during registration.");
//       }
//     };
  
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//         <div className="bg-white p-8 rounded-lg shadow-md w-96">
//           <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
//           <form onSubmit={registerUser}>
//             {/* First Name */}
//             <div className="mb-4">
//               <label className="block text-gray-700">First Name</label>
//               <input
//                 type="text"
//                 placeholder="Enter first name"
//                 value={data.fname}
//                 onChange={(e) => setData({ ...data, fname: e.target.value })}
//                 className="w-full px-4 py-2 border rounded-lg"
//                 required
//               />
//             </div>
  
//             {/* Second Name */}
//             <div className="mb-4">
//               <label className="block text-gray-700">Second Name</label>
//               <input
//                 type="text"
//                 placeholder="Enter second name"
//                 value={data.sname}
//                 onChange={(e) => setData({ ...data, sname: e.target.value })}
//                 className="w-full px-4 py-2 border rounded-lg"
//               />
//             </div>
  
//             {/* Last Name */}
//             <div className="mb-4">
//               <label className="block text-gray-700">Last Name</label>
//               <input
//                 type="text"
//                 placeholder="Enter last name"
//                 value={data.lname}
//                 onChange={(e) => setData({ ...data, lname: e.target.value })}
//                 className="w-full px-4 py-2 border rounded-lg"
//                 required
//               />
//             </div>
  
//             {/* Email */}
//             <div className="mb-4">
//               <label className="block text-gray-700">Email</label>
//               <input
//                 type="email"
//                 placeholder="Enter your email"
//                 value={data.email}
//                 onChange={(e) => setData({ ...data, email: e.target.value })}
//                 className="w-full px-4 py-2 border rounded-lg"
//                 required
//               />
//             </div>
  
//             {/* Role */}
//             <div className="mb-4">
//               <label className="block text-gray-700">Role</label>
//               <select
//                 id="role"
//                 value={data.role}
//                 onChange={(e) => setData({ ...data, role: e.target.value })}
//                 className="w-full px-4 py-2 border rounded-lg"
//                 required
//               >
//                 <option value="">Select role</option>
//                 <option value="admin">Admin</option>
//                 <option value="student">Student</option>
//                 <option value="teacher">Teacher</option>
//                 <option value="parent">Parent</option>
//               </select>
//             </div>
  
//             {/* Gender */}
//             <div className="mb-4">
//               <label className="block text-gray-700">Gender</label>
//               <select
//                 id="gender"
//                 value={data.gender}
//                 onChange={(e) => setData({ ...data, gender: e.target.value })}
//                 className="w-full px-4 py-2 border rounded-lg"
//                 required
//               >
//                 <option value="">Select gender</option>
//                 <option value="male">Male</option>
//                 <option value="female">Female</option>
//                 <option value="other">Other</option>
//               </select>
//             </div>
  
//             {/* Password */}
//             <div className="mb-4">
//               <label className="block text-gray-700">Password</label>
//               <input
//                 type="password"
//                 placeholder="Enter your password"
//                 value={data.password}
//                 onChange={(e) => setData({ ...data, password: e.target.value })}
//                 className="w-full px-4 py-2 border rounded-lg"
//                 required
//               />
//             </div>
  
//             {/* Display Generated User No After Registration */}
//             {userNo && (
//               <p className="text-green-600 font-bold text-center mt-2">
//                 Assigned User No: {userNo}
//               </p>
//             )}
  
//             {/* Submit Button */}
//             <button
//               type="submit"
//               className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
//             >
//               Register
//             </button>
//           </form>
//         </div>
//       </div>
//     );
//   }
  
//   export default ParentForm;


import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function ParentForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const studentNo = location.state?.userNo || ""; // Get Student No from Student Form

  const [formData, setFormData] = useState({
    studentNo: studentNo, // ✅ Renamed User No to Student No
    relationship: "",
    fname: "",
    sname: "",
    lname: "",
    email: "",
    password: "",
    role: "parent",
    gender: "",
    contactNo: "",
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/admin/register/parent", formData);

      if (!response.data.error) {
        toast.success("Parent registered successfully!");
        navigate("/admin/dashboard"); // ✅ Redirect after success
      } else {
        toast.error(response.data.error);
      }
    // } catch (error) {
    //   console.error("Error:", error);
    //   toast.error("Failed to register parent.");
    // }
    }
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
    <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-center text-black">Register Parent</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Student Number (Read-only) */}
        <div>
          <label className="block text-gray-700">Student No</label>
          <input
            type="text"
            name="studentNo"
            value={formData.studentNo}
            readOnly
            className="w-full mt-1 p-2 border rounded-md bg-gray-200 cursor-not-allowed text-gray-900"
          />
        </div>

        {/* Relationship */}
        <div>
          <label className="block text-gray-700">Relationship</label>
          <select
            name="relationship"
            value={formData.relationship}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md text-gray-900"
            required
          >
            <option value="">Select Relationship</option>
            <option value="Father">Father</option>
            <option value="Mother">Mother</option>
            <option value="Guardian">Guardian</option>
          </select>
        </div>

        {/* First Name */}
        <div>
          <label className="block text-gray-700">First Name</label>
          <input
            type="text"
            name="fname"
            value={formData.fname}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md text-gray-900"
            required
          />
        </div>

        {/* Second Name */}
        <div>
          <label className="block text-gray-700">Second Name</label>
          <input
            type="text"
            name="sname"
            value={formData.sname}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md text-gray-900"
          />
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-gray-700">Last Name</label>
          <input
            type="text"
            name="lname"
            value={formData.lname}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md text-gray-900"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Contact No</label>
          <input
            type="Number"
            name="contactNo"
            value={formData.contactNo}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md text-black"
            required
          />
        </div>
        {/* Email */}
        <div>
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md text-gray-900"
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md text-gray-900"
            required
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-gray-700">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md text-gray-900"
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Register Parent
        </button>
      </form>
    </div>
  );
}
