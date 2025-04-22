import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiDownload } from "react-icons/fi";
import { useSocket } from "../../context/SocketContext";
import { jsPDF } from 'jspdf';
import DashboardChatList from "../../components/DashboardChatList";

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
      const response = await axios.post("/generate-lesson-plan", 
        { topic },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      
      if (response.data && response.data.lessonPlan) {
        setLessonPlan(response.data.lessonPlan);
        toast.success("Lesson plan generated successfully!");
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error generating lesson plan:", error);
      toast.error(error.response?.data?.error || "Failed to generate lesson plan");
    } finally {
      setIsLoading(false);
    }
  };

  const parseLessonPlan = (plan) => {
    if (!plan) return null;
    
    try {
      const sections = plan.split(/\*\*(.*?)\*\*/g);
      const structuredPlan = {};
      
      for (let i = 1; i < sections.length; i += 2) {
        const heading = sections[i].trim();
        const content = sections[i + 1].trim();
        if (heading && content) {
          structuredPlan[heading] = content;
        }
      }
      
      return structuredPlan;
    } catch (error) {
      console.error("Error parsing lesson plan:", error);
      return null;
    }
  };

  const structuredPlan = lessonPlan ? parseLessonPlan(lessonPlan) : null;

  const handleSearchContent = async () => {
    if (!contentTopic) {
      toast.error("Please enter a topic for content recommendations");
      return;
    }
    setIsContentLoading(true);
    try {
      const response = await axios.post("/search-content", {
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

  const handleFileUpload = async () => {
    navigate("/teacher/uploadassignment");
  };

  const navigateToUploadGrades = () => {
    navigate("/teacher/grades");
  };

  const loadAssinements = () => {
    navigate("/teacher/assignments");
  };

  const navigateAttendance = () => {
    navigate("/teacher/atendance");
  };

  const downloadLessonPlan = () => {
    if (!lessonPlan) return;

    const doc = new jsPDF();
    const structuredPlan = parseLessonPlan(lessonPlan);
    
    // Set title
    doc.setFontSize(20);
    doc.text('Lesson Plan', 105, 20, { align: 'center' });
    
    // Set topic
    doc.setFontSize(16);
    doc.text(`Topic: ${topic || 'Untitled'}`, 20, 30);
    
    // Add date
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 40);
    
    // Add content
    doc.setFontSize(14);
    let yPosition = 50;
    
    if (structuredPlan) {
      Object.entries(structuredPlan).forEach(([heading, content]) => {
        // Add heading
        doc.setFont(undefined, 'bold');
        doc.text(heading, 20, yPosition);
        yPosition += 10;
        
        // Add content
        doc.setFont(undefined, 'normal');
        const splitContent = doc.splitTextToSize(content, 170);
        doc.text(splitContent, 20, yPosition);
        yPosition += splitContent.length * 7 + 10;
        
        // Add page break if needed
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
      });
    } else {
      // If not structured, add raw content
      const splitContent = doc.splitTextToSize(lessonPlan, 170);
      doc.text(splitContent, 20, yPosition);
    }
    
    // Save the PDF
    doc.save(`Lesson_Plan_${topic || 'Untitled'}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Back Arrow Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-900 cursor-pointer font-medium transition-colors"
      >
        <FiArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      <div className="flex flex-row items-center justify-center mt-2">
        <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">
          Teacher Dashboard
        </h1>
        <span
          className={`inline-block w-3 h-3 rounded-full mr-2 ${
            socket ? "bg-green-500" : "bg-red-500"
          }`}
        ></span>
        <span className="text-sm text-gray-600">
          {socket ? "Connected" : "Disconnected"}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Upload Assignment Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Assignments</h2>
          <div className="flex gap-4">
            <button
              onClick={handleFileUpload}
              className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Upload
            </button>
            <button
              onClick={loadAssinements}
              className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              View assignments
            </button>
          </div>
        </div>

        {/* Upload Grades Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload Grades</h2>
          <p className="text-gray-600 mb-4">Manage student grades and updates.</p>
          <button
            onClick={navigateToUploadGrades}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Go to Upload Grades
          </button>
        </div>

        {/* Manage Attendance Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Manage Attendance</h2>
          <p className="text-gray-600 mb-4">Mark and update attendance records.</p>
          <button 
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors" 
            onClick={navigateAttendance}
          >
            Manage
          </button>
        </div>
      </div>

      {/* Chat Section */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Communication Center
          </h2>
          <p className="text-gray-600 mt-1">
            Chat with administrators and parents
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <DashboardChatList role="admin" />
          <DashboardChatList role="parent" />
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
              disabled={isLoading || !topic.trim()}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {isLoading ? "Generating..." : "Generate"}
            </button>
          </div>

          {/* Display Lesson Plan */}
          {lessonPlan && (
            <div className="mt-4 bg-white p-4 rounded-lg shadow border border-gray-300">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-blue-700">
                  Generated Lesson Plan
                </h3>
                <button
                  onClick={downloadLessonPlan}
                  className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                >
                  <FiDownload />
                  Download
                </button>
              </div>
              {parseLessonPlan(lessonPlan) ? (
                <div className="space-y-4">
                  {Object.entries(parseLessonPlan(lessonPlan)).map(
                    ([heading, content], index) => (
                      <div
                        key={index}
                        className="bg-gray-50 p-4 rounded-lg shadow-sm"
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
              ) : (
                <div className="text-gray-600">
                  <p>Unable to parse lesson plan. Here's the raw content:</p>
                  <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto">
                    {lessonPlan}
                  </pre>
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
    </div>
  );
};

export default TeacherDashboard;
