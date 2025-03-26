import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

export default function AddStudent() {
  const [formData, setFormData] = useState({
    userNo: "",
    StdClass: "", // Changed from "class" to "studentClass"
    stream: "",
    subjects: [],
    enrollmentDate: "",
    parentContact: "",
    performance: "",
  });

  // Handle text and select input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle changes for the "subjects" checkboxes
  const handleSubjectChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      subjects: checked
        ? [...prev.subjects, value]
        : prev.subjects.filter((subject) => subject !== value),
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/admin/student", formData);

      if (response.status === 201) {
        toast.success("Student details submitted successfully!");
        setFormData({
          userNo: "",
          StdClass: "",
          stream: "",
          subjects: [],
          enrollmentDate: "",
          parentContact: "",
          performance: "",
        });
      } else {
        toast.error("Failed to submit student details.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Submission failed");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Add Student Details</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* User Number */}
        <div>
          <label className="block text-gray-700">User No</label>
          <input
            type="text"
            name="userNo"
            value={formData.userNo}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-300"
            required
          />
        </div>

        {/* Class */}
        <div>
          <label className="block text-gray-700">Class</label>
          <input
            type="text"
            name="StdClass" // Updated name
            value={formData.StdClass}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-300"
            placeholder="E.g., Grade 10"
            required
          />
        </div>

        {/* Stream */}
        <div>
          <label className="block text-gray-700">Stream</label>
          <input
            type="text"
            name="stream"
            value={formData.stream}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-300"
            placeholder="E.g., Science"
          />
        </div>

        {/* Subjects */}
        <div>
          <label className="block text-gray-700">Subjects</label>
          <div className="flex gap-4 mt-1">
            {["Math", "English", "Physics", "History"].map((subject) => (
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

        {/* Enrollment Date */}
        <div>
          <label className="block text-gray-700">Enrollment Date</label>
          <input
            type="date"
            name="enrollmentDate"
            value={formData.enrollmentDate}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-300"
          />
        </div>

        {/* Parent Contact */}
        <div>
          <label className="block text-gray-700">Parent Contact</label>
          <input
            type="tel"
            name="parentContact"
            value={formData.parentContact}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-300"
            placeholder="E.g., +1234567890"
            required
          />
        </div>

        {/* Performance */}
        <div>
          <label className="block text-gray-700">Performance Remarks</label>
          <textarea
            name="performance"
            value={formData.performance}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-300"
            placeholder="Optional remarks on student performance"
          ></textarea>
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

