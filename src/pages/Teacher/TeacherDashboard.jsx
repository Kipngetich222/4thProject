import React, {useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

const TeacherDashboard = () => {
  const [topic, setTopic] = useState("");
  const [lessonPlan, setLessonPlan] = useState("");
  const [content, setContent] = useState([]);
  const [contentTopic, setContentTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isContentLoading, setIsContentLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  
  
    // WebSocket connection
    useEffect(() => {
      const ws = new WebSocket("ws://localhost:5000");
    
      ws.onopen = () => {
        setIsConnected(true);
        
      };
    
      ws.onclose = () => {
        setIsConnected(false);
        console.log("Disconnected from WebSocket");
      };
    });

  // Generate lesson plan
  const handleGenerateLessonPlan = async () => {
    if (!topic) {
      toast.error("Please enter a topic for the lesson plan");
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/generate-lesson-plan", { topic });
      setLessonPlan(response.data.lessonPlan);
    } catch (error) {
      toast.error("Failed to generate lesson plan");
    } finally {
      setIsLoading(false);
    }
  };

  // Parse the lesson plan into sections
  const parseLessonPlan = (plan) => {
    const sections = plan.split(/\*\*(.*?)\*\*/g); // Split by **heading**
    const structuredPlan = {};

    for (let i = 1; i < sections.length; i += 2) {
      const heading = sections[i].trim();
      const content = sections[i + 1].trim();
      structuredPlan[heading] = content;
    }

    return structuredPlan;
  };

  const structuredPlan = lessonPlan ? parseLessonPlan(lessonPlan) : null;

  // Search for AI-powered content recommendations
  const handleSearchContent = async () => {
    if (!contentTopic) {
      toast.error("Please enter a topic for content recommendations");
      return;
    }
    setIsContentLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/search-content", { query: contentTopic });
      setContent(response.data.content);
    } catch (error) {
      toast.error("Failed to fetch content recommendations");
    } finally {
      setIsContentLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      
      <div className="flex items-center mt-2">
      <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">Teacher Dashboard</h1>
            <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
              isConnected ? 'bg-green-500' : 'bg-red-500'
            }`}></span>
            <span className="text-sm text-gray-600">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>

      {/* Dashboard Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {["Course Management", "Manage Attendance", "Communicate with Parents"].map((title, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
            <p className="text-gray-600 mt-2">
              {index === 0
                ? "Upload and manage student grades."
                : index === 1
                ? "Mark and update attendance records."
                : "Send messages and updates to parents."}
            </p>
            <Link
              to={index === 0 ? "/courses" : index === 1 ? "/teacher/assignments" : "/teacher/grades"}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all block text-center"
            >
              {index === 0 ? "Manage Courses" : index === 1 ? "Manage Assignments" : "Manage Grades"}
            </Link>
          </div>
        ))}
      </div>

      {/* Engage AI Section */}
      <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-blue-800">Engage AI</h2>

        {/* Generate Lesson Plan */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800">Generate Lesson Plan</h3>
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
              <h3 className="text-xl font-semibold text-red-700 mb-4">Generated Lesson Plan</h3>
              {structuredPlan && (
                <div className="space-y-4">
                  {Object.entries(structuredPlan).map(([heading, content], index) => (
                    <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold text-blue-700">{heading}</h4>
                      <p className="text-gray-700 mt-2 whitespace-pre-wrap">{content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* AI-Powered Content Recommendations */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800">AI-Powered Content Recommendations</h3>
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
                  <div key={index} className="bg-gray-100 p-4 rounded-lg shadow border border-gray-300">
                    {item.type === "video" ? (
                      <div>
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 font-semibold hover:underline"
                        >
                          <img src={item.thumbnail} alt={item.title} className="w-full h-auto rounded mb-2" />
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
              <p className="text-gray-600 mt-2">No content available. Try searching!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;