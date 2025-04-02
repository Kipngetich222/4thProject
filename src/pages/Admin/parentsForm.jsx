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
        navigate("/admin"); // ✅ Redirect after success
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
