import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AssignmentUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [assignmentDetails, setAssignmentDetails] = useState({
    title: "",
    description: "",
    due_date: "",
    classes: [],
    subject: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAssignmentDetails({ ...assignmentDetails, [name]: value });
  };

  const handleClassesChange = (e) => {
    const classList = e.target.value.split(",").map((cls) => cls.trim()); // Convert to array
    setAssignmentDetails({ ...assignmentDetails, classes: classList });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return; // Prevents errors when no file is selected

    if (!file.type.match(/application\/(pdf|msword|vnd.openxmlformats-officedocument.wordprocessingml.document)$/)) {
      toast.error("Only PDF, DOC, and DOCX files are allowed.");
      setSelectedFile(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should not exceed 5MB.");
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { title, description, classes } = assignmentDetails;
    if (!title || !description || !selectedFile) {
      toast.error("Please fill in all required fields and select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    Object.keys(assignmentDetails).forEach((key) => {
      formData.append(key, assignmentDetails[key]);
    });

    // ✅ Log data before sending request
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    try {
      const response = await axios.post("/teacher/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Assignment uploaded successfully!");
      console.log("Upload response:", response.data);
      setTimeout(() => navigate("/teacher/assignments"), 2000);
    } catch (error) {
      console.error("Error uploading assignment:", error);
      console.error("Server Response:", error.response?.data); // ✅ Log the server error
      toast.error("Failed to upload assignment. Please try again.");
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">Teacher Dashboard</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload Assignment</h2>

        <label className="block mb-2 text-gray-600">Title *</label>
        <input type="text" name="title" value={assignmentDetails.title} onChange={handleInputChange} className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900" required />

        <label className="block mb-2 text-gray-600">Description *</label>
        <textarea name="description" value={assignmentDetails.description} onChange={handleInputChange} className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900" required></textarea>

        <label className="block mb-2 text-gray-600">Classes (comma-separated)</label>
        <input type="text" name="classes" value={assignmentDetails.classes.join(", ")} onChange={handleClassesChange} className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900" />

        <label className="block mb-2 text-gray-600">Due Date *</label>
       

        <label className="block mb-2 text-gray-600">Due Date & Time *</label>
        <input
          type="datetime-local"  // ✅ Allows both date and time selection
          name="due_date"
          value={assignmentDetails.due_date}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded px-4 py-2 mb-4 "
          required
        />



        <label className="block mb-2 text-gray-600">Upload File *</label>
        <input type="file" onChange={handleFileChange} className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900" accept=".pdf,.doc,.docx" required />

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full">Upload Assignment</button>
      </form>
    </div>
  );
};

export default AssignmentUpload;
