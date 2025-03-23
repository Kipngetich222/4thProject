import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast"; // For user notifications
import { useNavigate } from "react-router-dom"; // To navigate between pages

const TeacherDashboard = () => {
  // State to store the selected file
  const [selectedFile, setSelectedFile] = useState(null);

  // React Router's navigation hook
  const navigate = useNavigate();

  // Handle file selection by the teacher
  const handleFileChange = (event) => {
    const file = event.target.files[0];

    // Check file type (PDF, DOC, or DOCX)
    if (file && !file.type.match(/(pdf|msword|vnd.openxmlformats-officedocument.wordprocessingml.document)$/)) {
      toast.error("Only PDF, DOC, and DOCX files are allowed.");
      setSelectedFile(null); // Reset file selection
      return;
    }

    // Check file size (limit to 5MB)
    if (file && file.size > 5 * 1024 * 1024) {
      toast.error("File size should not exceed 5MB.");
      setSelectedFile(null); // Reset file selection
      return;
    }

    // Set the valid file
    setSelectedFile(file);
  };

  // Handle file upload when the teacher clicks the upload button
  const handleFileUpload = async () => {
    navigate("/teacher/uploadassignment");
  };

  // Navigate to the "Upload Grades" page
  const navigateToUploadGrades = () => {
    navigate("/teacher/grades");
  };

  const loadAssinements = () => {
    navigate("/teacher/assignments");
  }
  const navigateAttendance = () =>{
    navigate("/teacher/atendance");
  }
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">Teacher Dashboard</h1>

      {/* Responsive grid layout using Tailwind */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Upload Assignment Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800">Assignments</h2>


          {/* Upload button */}
          <button
            onClick={handleFileUpload}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-4" // Add margin-right
          >
            Upload
          </button>

          <button
            onClick={loadAssinements}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            View assignments
          </button>



        </div>

        {/* Upload Grades Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800">Upload Grades</h2>
          <p className="text-gray-600 mt-2">Manage student grades and updates.</p>
          <button
            onClick={navigateToUploadGrades} // Navigate to the grades page
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Go to Upload Grades
          </button>
        </div>

        {/* Manage Attendance Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800">Manage Attendance</h2>
          <p className="text-gray-600 mt-2">Mark and update attendance records.</p>
          <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={navigateAttendance}>
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
