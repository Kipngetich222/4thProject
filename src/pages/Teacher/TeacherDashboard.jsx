import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const TeacherDashboard = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]); // Get the selected file
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file to upload."); // Display error toast
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile); // Append file to FormData

    try {
      const response = await axios.post("/upload-assignment", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Assignment uploaded successfully!"); // Display success toast
      console.log(response.data); // Handle response if needed
    } catch (error) {
      console.error("Error uploading assignment:", error);
      toast.error("Failed to upload assignment."); // Display error toast
    }
  };

  const navigateToUploadGrades = () => {
    navigate("/teacher/grades"); // Navigate to /teacher/grades
};


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">Teacher Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Upload Assignment Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800">Upload Assignment</h2>
          <p className="text-gray-600 mt-2">Upload and manage student assignments.</p>
          {/* File Input */}
          <input
            type="file"
            onChange={handleFileChange}
            className="mt-4 block w-full text-gray-800 border border-gray-300 rounded px-4 py-2"
          />
          {/* Upload Button */}
          <button
            onClick={handleFileUpload}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Upload
          </button>
        </div>

        {/* Upload Grades Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800">Upload Grades</h2>
          <p className="text-gray-600 mt-2">Manage student grades and updates.</p>
          <button
            onClick={navigateToUploadGrades} // Navigate to /teacher/uploadassignment
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Go to Upload Grades
          </button>
        </div>

        {/* Manage Attendance Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800">Manage Attendance</h2>
          <p className="text-gray-600 mt-2">Mark and update attendance records.</p>
          <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Manage
          </button>
        </div>

        {/* Communicate with Parents Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800">Communicate with Parents</h2>
          <p className="text-gray-600 mt-2">Send messages and updates to parents.</p>
          <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
