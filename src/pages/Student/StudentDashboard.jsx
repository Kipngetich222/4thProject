import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const StudentDashboard = () => {
  const [file, setFile] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [content, setContent] = useState([]);
  const [contentTopic, setContentTopic] = useState("");
  const [isContentLoading, setIsContentLoading] = useState(false);
  const [isFileLoading, setIsFileLoading] = useState(false);
  

  // Updated handleFileUpload function
const handleFileUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Enhanced file validation
  const validTypes = [
    'text/plain', 
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  if (!validTypes.includes(file.type)) {
    toast.error('Please upload a text, PDF, or Word document');
    return;
  }

  // File size limit (5MB)
  if (file.size > 5 * 1024 * 1024) {
    toast.error('File size must be less than 5MB');
    return;
  }

  setIsFileLoading(true);
  setQuestions([]); // Clear previous questions

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(
      'http://localhost:5000/api/generate-questions',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 40000 // 40-second timeout
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.error || 'Invalid response from server');
    }

    // Format each question block into styled HTML
    const formattedQuestions = response.data.questions.map((q, index) => {
      // Split into lines and clean up
      const lines = q.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);

      // Format as HTML with proper styling
      return `
        <div class="question-block">
          <h4 class="question-title">Question ${index + 1}</h4>
          ${lines.map(line => {
            if (line.startsWith('Answer:')) {
              return `<p class="correct-answer"><strong>${line}</strong></p>`;
            } else if (line.match(/^[A-Z]\)/)) {
              return `<p class="answer-option">${line}</p>`;
            }
            return `<p class="question-text">${line}</p>`;
          }).join('')}
        </div>
      `;
    });

    setQuestions(formattedQuestions);
    
  } catch (error) {
    console.error('Question generation failed:', {
      error: error.message,
      response: error.response?.data
    });

    const errorMessage = error.response?.data?.solution 
      ? `${error.response.data.error}. ${error.response.data.solution}`
      : 'Failed to generate questions. Please try again.';
    
    toast.error(errorMessage);
  } finally {
    setIsFileLoading(false);
  }
};


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
      <h1 className="text-3xl font-bold text-purple-800 mb-6 text-center">Student Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {["Homework", "Chat with Classmates", "Request Guidance"].map((title, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
            <p className="text-gray-600 mt-2">{index === 0 ? "View and submit assignments." : index === 1 ? "Connect with fellow students." : "Ask teachers for help."}</p>
            <button className="mt-4 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-all">
              {index === 0 ? "View" : index === 1 ? "Chat" : "Request"}
            </button>
          </div>
        ))}
      </div>
      
      <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-purple-800">Engage AI</h2>
        
        {/* Upload Document */}
<div className="mt-6">
  <h3 className="text-lg font-semibold text-gray-800">Upload Document</h3>
  <input
    type="file"
    onChange={handleFileUpload}
    className="mt-2 block w-full border border-gray-300 rounded p-2"
    disabled={isFileLoading}
  />
  
  <div className="mt-4 space-y-4">
    {isFileLoading ? (
      <div className="flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-800"></div>
        <p className="mt-2">Analyzing your document and generating questions...</p>
        <p className="text-sm text-gray-500 mt-1">
          This may take up to 30 seconds for large documents
        </p>
      </div>
    ) : questions.length > 0 ? (
      <div className="space-y-6">
        {questions.map((q, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md">
            <h4 className="font-semibold text-lg mb-2">Question {index + 1}</h4>
            <div 
              className="text-gray-700"
              dangerouslySetInnerHTML={{ __html: q }}
            />
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-500 text-center py-4">
        Upload a document to generate practice questions
      </p>
    )}
  </div>
</div>
        
        {/* AI-Powered Content Recommendations */}
        <div className="mt-8 ">
          <h3 className="text-lg font-semibold text-gray-800">Content Recommendations</h3>
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
          <div className="mt-4 ">
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

export default StudentDashboard;
