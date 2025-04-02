import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { useSocket } from "../../context/SocketContext";

const TeacherDashboard = () => {
  const [topic, setTopic] = useState("");
  const [lessonPlan, setLessonPlan] = useState("");
  const [content, setContent] = useState([]);
  const [contentTopic, setContentTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isContentLoading, setIsContentLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const socket = useSocket();
  const navigate = useNavigate();

  // Socket.IO event listeners
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      toast.success(`New message from ${message.sender}`);
    };

    const handleParentResponse = (response) => {
      toast.info(`Parent response: ${response.message}`);
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("parentResponse", handleParentResponse);

    // Join teacher-specific room
    socket.emit("joinTeacherRoom");

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("parentResponse", handleParentResponse);
      socket.emit("leaveTeacherRoom");
    };
  }, [socket]);

  const handleGenerateLessonPlan = async () => {
    if (!topic) {
      toast.error("Please enter a topic for the lesson plan");
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post("/api/generate-lesson-plan", { topic });
      setLessonPlan(response.data.lessonPlan);
    } catch (error) {
      toast.error("Failed to generate lesson plan");
    } finally {
      setIsLoading(false);
    }
  };

  const parseLessonPlan = (plan) => {
    const sections = plan.split(/\*\*(.*?)\*\*/g);
    const structuredPlan = {};
    for (let i = 1; i < sections.length; i += 2) {
      const heading = sections[i].trim();
      const content = sections[i + 1].trim();
      structuredPlan[heading] = content;
    }
    return structuredPlan;
  };

  const structuredPlan = lessonPlan ? parseLessonPlan(lessonPlan) : null;

  const handleSearchContent = async () => {
    if (!contentTopic) {
      toast.error("Please enter a topic for content recommendations");
      return;
    }
    setIsContentLoading(true);
    try {
      const response = await axios.post("/api/search-content", {
        query: contentTopic,
      });
      setContent(response.data.content);
    } catch (error) {
      toast.error("Failed to fetch content recommendations");
    } finally {
      setIsContentLoading(false);
    }
  };

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

      {/* Engage AI Section */}
      <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-blue-800">Engage AI</h2>

        {/* Generate Lesson Plan */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800">
            Generate Lesson Plan
          </h3>
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter topic"
              className="border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleGenerateLessonPlan}
              disabled={isLoading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all disabled:bg-blue-300"
            >
              {isLoading ? "Generating..." : "Generate"}
            </button>
          </div>

          {/* Display Lesson Plan */}
          {lessonPlan && (
            <div className="mt-4 bg-gray-300 p-4 rounded border border-gray-300">
              <h3 className="text-xl font-semibold text-red-700 mb-4">
                Generated Lesson Plan
              </h3>
              {structuredPlan && (
                <div className="space-y-4">
                  {Object.entries(structuredPlan).map(
                    ([heading, content], index) => (
                      <div
                        key={index}
                        className="bg-white p-4 rounded-lg shadow-sm"
                      >
                        <h4 className="text-lg font-semibold text-blue-700">
                          {heading}
                        </h4>
                        <p className="text-gray-700 mt-2 whitespace-pre-wrap">
                          {content}
                        </p>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* AI-Powered Content Recommendations */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800">
            AI-Powered Content Recommendations
          </h3>
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={contentTopic}
              onChange={(e) => setContentTopic(e.target.value)}
              placeholder="Enter topic for content recommendations"
              className="border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearchContent}
              disabled={isContentLoading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all disabled:bg-blue-300"
            >
              {isContentLoading ? "Searching..." : "Search Content"}
            </button>
          </div>

          {/* Content List */}
          <div className="mt-4">
            {content.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {content.map((item, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 p-4 rounded-lg shadow border border-gray-300"
                  >
                    {item.type === "video" ? (
                      <div>
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 font-semibold hover:underline"
                        >
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            className="w-full h-auto rounded mb-2"
                          />
                          {item.title}
                        </a>
                      </div>
                    ) : (
                      <div>
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 font-semibold hover:underline"
                        >
                          {item.title}
                        </a>
                        <p className="text-gray-600 mt-2">{item.description}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 mt-2">
                No content available. Try searching!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Dashboard content remains the same */}
      {/* ... */}
    </div>
  );
};

export default TeacherDashboard;
