
// import React from "react";
// import { useLocation } from "react-router-dom";

// function AdminTeacher() {
//   const location = useLocation();
//   const userNo = location.state?.userNo || localStorage.getItem("userNo"); // Fallback to localStorage


//   // Log the received data
//   console.log("Received userNo:", userNo);

//   return (
//     <div>
//       <h1>Teacher Dashboard</h1>
//       {/* Render userNo to confirm data */}
//       <p>Received User No: {userNo}</p>
//     </div>
//   );
// }

// export default AdminTeacher;


import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

function AddTeacher() {
  const location = useLocation();
  const userNo = location.state?.userNo || localStorage.getItem("userNo"); // Retrieve userNo

  const [formData, setFormData] = useState({
    userNo: userNo || "", // Use userNo from previous page or fallback
    department: "",
    subjects: [],
    contactNumber: "",
  });

  const [newSubject, setNewSubject] = useState(""); // Temp state for adding subjects dynamically

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle subjects addition
  const handleAddSubject = () => {
    if (newSubject.trim() !== "") {
      setFormData({
        ...formData,
        subjects: [...formData.subjects, newSubject],
      });
      setNewSubject(""); // Clear the input field
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form reload
    try {
      const response = await axios.post("admin/teacher", formData); // Replace with your backend endpoint

      if (response.status === 201) {
        toast.success("Teacher added successfully!");
        setFormData({
          userNo: userNo || "",
          department: "",
          subjects: [],
          contactNumber: "",
        });
      } else {
        toast.error("Failed to add teacher. Please try again.");
      }
    } catch (error) {
      console.error("Error adding teacher:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Add Teacher</h1>
        <form onSubmit={handleSubmit}>
          {/* UserNo */}
          <div className="mb-4">
            <label className="block text-gray-700">User No</label>
            <input
              type="text"
              name="userNo"
              value={formData.userNo}
              onChange={handleInputChange}
              placeholder="User No"
              className="w-full px-4 py-2 border rounded-lg"
              readOnly // Make this field read-only
            />
          </div>

          {/* Department */}
          <div className="mb-4">
            <label className="block text-gray-700">Department</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              placeholder="Enter Department"
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          {/* Subjects */}
          <div className="mb-4">
            <label className="block text-gray-700">Subjects</label>
            <div className="flex items-center mb-2">
              <input
                type="text"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                placeholder="Add a subject"
                className="flex-1 px-4 py-2 border rounded-lg"
              />
              <button
                type="button"
                onClick={handleAddSubject}
                className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Add
              </button>
            </div>
            <ul className="list-disc ml-6">
              {formData.subjects.map((subject, index) => (
                <li key={index}>{subject}</li>
              ))}
            </ul>
          </div>

          {/* Contact Number */}
          <div className="mb-4">
            <label className="block text-gray-700">Contact Number</label>
            <input
              type="text"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleInputChange}
              placeholder="Enter Contact Number"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddTeacher;




// import React, { useState } from "react";
// import axios from "axios";
// import { toast } from "react-hot-toast";
// import { useNavigate } from "react-router-dom";

// function AddTeacher() {
//   const navigate = useNavigate();
//   const [data, setData] = useState({
//     userNo: "",
//     fname: "",
//     sname: "",
//     lname: "",
//     email: "",
//     password: "",
//     role: "",
//     gender: "",
//   });

//   const registerUser = async (e) => {
//     e.preventDefault(); // Prevent form reload
//     const { userNo, fname, sname, lname, email, password, role, gender } = data;

//     try {
//       // Make POST request to the backend
//       const response = await axios.post("admin/teacher", {
//         userNo,
//         fname,
//         sname,
//         lname,
//         email,
//         password,
//         role,
//         gender,
//       });

//       // Handle server response
//       if (response.data.error) {
//         toast.error(response.data.error);
//       } else {
//         toast.success("Registration successful!");

//         // Navigate to the role-specific page, passing userNo as state
//         if (role === "teacher") {
//           localStorage.setItem("userNo", userNo); // Save userNo
//           navigate("/admin/teacher", { state: { userNo: userNo } });
//         }
//         else if (role === "student") {
//           navigate("/admin/student", { state: { userNo: userNo } });
//         } else if (role === "parent") {
//           navigate("/admin/parent", { state: { userNo: userNo } });
//         } else {
//           navigate("/admin/dashboard", { state: { userNo: userNo } }); // Default route for admin or other roles
//         }
//       }
//     } catch (error) {
//       console.error("Registration error:", error);
//       toast.error("An error occurred during registration.");
//     }
//   };

  

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//       <div className="bg-white p-8 rounded-lg shadow-md w-96">
//         <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
//         <form onSubmit={registerUser}>
//           {/* User No */}
//           <div className="mb-4">
//             <label className="block text-gray-700">User No</label>
//             <input
//               type="text"
//               placeholder="Enter user number"
//               value={data.userNo}
//               onChange={(e) => setData({ ...data, userNo: e.target.value })}
//               className="w-full px-4 py-2 border rounded-lg"
//               required
//             />
//           </div>

//           {/* First Name */}
//           <div className="mb-4">
//             <label className="block text-gray-700">First Name</label>
//             <input
//               type="text"
//               placeholder="Enter first name"
//               value={data.fname}
//               onChange={(e) => setData({ ...data, fname: e.target.value })}
//               className="w-full px-4 py-2 border rounded-lg"
//               required
//             />
//           </div>

//           {/* Second Name */}
//           <div className="mb-4">
//             <label className="block text-gray-700">Second Name</label>
//             <input
//               type="text"
//               placeholder="Enter second name"
//               value={data.sname}
//               onChange={(e) => setData({ ...data, sname: e.target.value })}
//               className="w-full px-4 py-2 border rounded-lg"
//               required
//             />
//           </div>

//           {/* Last Name */}
//           <div className="mb-4">
//             <label className="block text-gray-700">Last Name</label>
//             <input
//               type="text"
//               placeholder="Enter last name"
//               value={data.lname}
//               onChange={(e) => setData({ ...data, lname: e.target.value })}
//               className="w-full px-4 py-2 border rounded-lg"
//               required
//             />
//           </div>

//           {/* Email */}
//           <div className="mb-4">
//             <label className="block text-gray-700">Email</label>
//             <input
//               type="email"
//               placeholder="Enter your email"
//               value={data.email}
//               onChange={(e) => setData({ ...data, email: e.target.value })}
//               className="w-full px-4 py-2 border rounded-lg"
//               required
//             />
//           </div>

//           {/* Role */}
//           <div className="mb-4">
//             <label className="block text-gray-700">Role</label>
//             <select
//               id="role"
//               value={data.role}
//               onChange={(e) => setData({ ...data, role: e.target.value })}
//               className="w-full px-4 py-2 border rounded-lg"
//               required
//             >
//               <option value="">Select role</option>
//               <option value="admin">Admin</option>
//               <option value="student">Student</option>
//               <option value="teacher">Teacher</option>
//               <option value="parent">Parent</option>
//             </select>
//           </div>

//           {/* Gender */}
//           <div className="mb-4">
//             <label className="block text-gray-700">Gender</label>
//             <select
//               id="gender"
//               value={data.gender}
//               onChange={(e) => setData({ ...data, gender: e.target.value })}
//               className="w-full px-4 py-2 border rounded-lg"
//               required
//             >
//               <option value="">Select gender</option>
//               <option value="male">Male</option>
//               <option value="female">Female</option>
//               <option value="other">Other</option>
//             </select>
//           </div>

//           {/* Password */}
//           <div className="mb-4">
//             <label className="block text-gray-700">Password</label>
//             <input
//               type="password"
//               placeholder="Enter your password"
//               value={data.password}
//               onChange={(e) => setData({ ...data, password: e.target.value })}
//               className="w-full px-4 py-2 border rounded-lg"
//               required
//             />
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
//           >
//             Register
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default AddTeacher;

