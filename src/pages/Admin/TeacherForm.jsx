<<<<<<< HEAD
import { useState } from "react";

export default function TeacherForm() {
=======
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function TeacherForm() {
  const navigate = useNavigate();
>>>>>>> origin/admin
  const [formData, setFormData] = useState({
    userNo: "",
    department: "",
    subjects: [],
<<<<<<< HEAD
    contactNumber: "",
  });

=======
    contactNo: "", // ✅ Updated variable
  });

  // ✅ Fetch userNo from localStorage (if applicable)
  useEffect(() => {
    const storedUserNo = localStorage.getItem("userNo");
    if (storedUserNo) {
      setFormData((prev) => ({ ...prev, userNo: storedUserNo }));
    }
  }, []);

>>>>>>> origin/admin
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubjectChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      subjects: checked
        ? [...prev.subjects, value]
        : prev.subjects.filter((subject) => subject !== value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
<<<<<<< HEAD
      const response = await fetch("/admin/teacher", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to submit form");

      alert("Form submitted successfully!");
      setFormData({ userNo: "", department: "", subjects: [], contactNumber: "" });
    } catch (error) {
      console.error("Error:", error);
      alert("Submission failed");
=======
      const response = await axios.post("/admin/teacher", formData);

      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        toast.success("Teacher added successfully!");
        navigate('/admin')
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Submission failed.");
>>>>>>> origin/admin
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Add Teacher</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
<<<<<<< HEAD
        {/* User Number */}
=======
        {/* User Number (Readonly, fetched from localStorage) */}
>>>>>>> origin/admin
        <div>
          <label className="block text-gray-700">User No</label>
          <input
            type="text"
            name="userNo"
            value={formData.userNo}
<<<<<<< HEAD
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-300"
            required
=======
            readOnly
            className="w-full mt-1 p-2 border rounded-md bg-gray-100"
>>>>>>> origin/admin
          />
        </div>

        {/* Department */}
        <div>
          <label className="block text-gray-700">Department</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-300"
            required
          >
            <option value="">Select Department</option>
            <option value="Science">Science</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Languages">Languages</option>
          </select>
        </div>

        {/* Subjects (Checkboxes) */}
        <div>
          <label className="block text-gray-700">Subjects</label>
          <div className="flex gap-4 mt-1">
            {["Math", "English", "Physics"].map((subject) => (
              <label key={subject} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={subject}
                  checked={formData.subjects.includes(subject)}
                  onChange={handleSubjectChange}
                  className="rounded border-gray-300 focus:ring focus:ring-blue-300"
                />
                <span>{subject}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Contact Number */}
        <div>
          <label className="block text-gray-700">Contact Number</label>
          <input
            type="tel"
<<<<<<< HEAD
            name="contactNumber"
            value={formData.contactNumber}
=======
            name="contactNo" // ✅ Updated variable
            value={formData.contactNo}
>>>>>>> origin/admin
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-300"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
