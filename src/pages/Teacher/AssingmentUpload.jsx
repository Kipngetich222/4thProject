import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AssignmentUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [assignmentDetails, setAssignmentDetails] = useState({
    assignment_id: "",
    title: "",
    description: "",
    due_date: "",
    classes: "",
    subject: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAssignmentDetails({ ...assignmentDetails, [name]: value });
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

    const { assignment_id, title, description } = assignmentDetails;
    if (!assignment_id || !title || !description || !selectedFile) {
      toast.error("Please fill in all required fields and select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    Object.keys(assignmentDetails).forEach((key) => {
      formData.append(key, assignmentDetails[key]);
    });

    try {
      const response = await axios.post("/teacher/assignment", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Assignment uploaded successfully!");
      console.log("Upload response:", response.data);

      setTimeout(() => navigate("/teacher/dashboard"), 2000); // Redirect after success
    } catch (error) {
      console.error("Error uploading assignment:", error);
      toast.error("Failed to upload assignment. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">Teacher Dashboard</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload Assignment</h2>

        <label className="block mb-2 text-gray-600">Assignment ID *</label>
        <input
          type="text"
          name="assignment_id"
          value={assignmentDetails.assignment_id}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
          placeholder="Enter Assignment ID"
          required
        />

        <label className="block mb-2 text-gray-600">Title *</label>
        <input
          type="text"
          name="title"
          value={assignmentDetails.title}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
          placeholder="Enter Title"
          required
        />

        <label className="block mb-2 text-gray-600">Description *</label>
        <textarea
          name="description"
          value={assignmentDetails.description}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
          placeholder="Enter Description"
          required
        />

        <label className="block mb-2 text-gray-600">Due Date</label>
        <input
          type="date"
          name="due_date"
          value={assignmentDetails.due_date}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
        />

        <label className="block mb-2 text-gray-600">Classes</label>
        <input
          type="text"
          name="classes"
          value={assignmentDetails.classes}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
          placeholder="Enter Associated Classes"
        />

        <label className="block mb-2 text-gray-600">Subject</label>
        <input
          type="text"
          name="subject"
          value={assignmentDetails.subject}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
          placeholder="Enter Subject"
        />

        <label className="block mb-2 text-gray-600">Upload File *</label>
        <input
          type="file"
          onChange={handleFileChange}
          className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
          accept=".pdf,.doc,.docx"
          required
        />

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full">
          Upload Assignment
        </button>
      </form>
    </div>
  );
};

export default AssignmentUpload;