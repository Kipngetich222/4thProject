// src/pages/Admin/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../../services/api";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiMessageSquare,
  FiUsers,
  FiUserPlus,
} from "react-icons/fi";
import { useSocket } from "../../context/SocketContext";
import UserManagement from "./UserManagement";

const localizer = momentLocalizer(moment);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { socket, isConnected } = useSocket();
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // ✅ State for search input
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: "",
    end: "",
    description: "",
  });
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  // WebSocket connection
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:5000");

    ws.onopen = () => {
      setIsConnected(true);
    };

    // ws.onclose = () => {
    //   setIsConnected(false);
    //   console.log("Disconnected from WebSocket");
    // };
  });

  // Add this function for AI event suggestions
  const generateEventSuggestions = async () => {
    try {
      const response = await axios.post("/api/generate-ai-suggestions", {
        currentEvents: events.map((e) => e.title),
      });
      setAiSuggestions(response.data.suggestions);
      setShowSuggestionModal(true);
    } catch (err) {
      toast.error("Failed to generate suggestions");
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get("/events");
      setEvents(response.data.data || response.data); // Handle both response formats
    } catch (error) {
      toast.error("Failed to fetch events");
    }
  };

  // Fetch all events from the backend
  useEffect(() => {
    fetchEvents();
  }, []);

  // Add a new event
  const handleAddEvent = async () => {
    // Validate required fields
    if (!newEvent.title || !newEvent.start || !newEvent.end) {
      toast.error("Please fill all required fields");
      return;
    }

    // Validate date order
    if (new Date(newEvent.start) >= new Date(newEvent.end)) {
      toast.error("End time must be after start time");
      return;
    }

    try {
      const eventToSend = {
        title: newEvent.title,
        description: newEvent.description || "",
        start: new Date(newEvent.start).toISOString(),
        end: new Date(newEvent.end).toISOString(),
      };

      const response = await axios.post("/api/events", eventToSend);
      
      // Update local state with the new event
      setEvents(prev => [...prev, response.data.data]);
      setNewEvent({ title: "", start: "", end: "", description: "" });
      toast.success("Event added successfully!");
    } catch (error) {
      console.error("Event creation failed:", error);
      const errorMessage = error.response?.data?.error || "Failed to create event";
      toast.error(errorMessage);
    }
  };

  // Delete an event
  const handleDeleteEvent = async (eventId) => {
    try {
      await axios.delete(`/api/events/${eventId}`);
      setEvents(prev => prev.filter(event => event._id !== eventId));
      toast.success("Event deleted successfully");
    } catch (error) {
      toast.error("Failed to delete event");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Back Arrow Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-900 cursor-pointer font-medium transition-colors"
      >
        <FiArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      <div className="flex flex-row items-center justify-center mt-2">
        <h1 className="text-3xl font-bold text-indigo-800 mb-6">
          Admin Dashboard
        </h1>
        <span
          className={`inline-block w-3 h-3 rounded-full mr-2 ${
            isConnected ? "bg-green-500" : "bg-indigo-500"
          }`}
        ></span>
        <span className="text-sm text-gray-600">
          {isConnected ? "Connected" : "Disconnected"}
        </span>
      </div>

      {/* Dashboard Navigation Tabs */}
      <div className="flex border-b mb-6">
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === "dashboard"
              ? "text-indigo-600 border-b-2 border-indigo-600"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("dashboard")}
        >
          Overview
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === "users"
              ? "text-indigo-600 border-b-2 border-indigo-600"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("users")}
        >
          User Management
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === "communication"
              ? "text-indigo-600 border-b-2 border-indigo-600"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("communication")}
        >
          Communication
        </button>
      </div>

      {/* Dashboard Content */}
      {activeTab === "dashboard" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* User Management Card */}
          <div
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setActiveTab("users")}
          >
            <div className="flex items-start">
              <div className="bg-indigo-100 p-3 rounded-full mr-4">
                <FiUsers className="text-indigo-600 h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  User Management
                </h2>
                <p className="text-gray-600 mt-2">Manage all system users</p>
                <button
                  className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click from firing
                    setActiveTab("users");
                  }}
                >
                  Manage Users
                </button>
              </div>
            </div>
          </div>

          {/* Add more admin cards as needed */}
        </div>
      )}

      {activeTab === "users" && <UserManagement />}

      {activeTab === "communication" && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-indigo-800 mb-6">
            Communication Center
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Chat with Teachers */}
            <div
              className="border rounded-lg p-6 hover:bg-indigo-50 cursor-pointer transition-colors"
              onClick={() => navigate("/admin/chat?role=teacher")}
            >
              <div className="flex items-center mb-3">
                <FiMessageSquare className="text-indigo-600 mr-2" size={24} />
                <h3 className="text-lg font-medium">Chat with Teachers</h3>
              </div>
              <p className="text-gray-600">
                Communicate directly with teaching staff
              </p>
            </div>

            {/* Chat with Parents */}
            <div
              className="border rounded-lg p-6 hover:bg-indigo-50 cursor-pointer transition-colors"
              onClick={() => navigate("/admin/chat?role=parent")}
            >
              <div className="flex items-center mb-3">
                <FiUsers className="text-indigo-600 mr-2" size={24} />
                <h3 className="text-lg font-medium">Chat with Parents</h3>
              </div>
              <p className="text-gray-600">
                Communicate with student guardians
              </p>
            </div>

            {/* Chat with Students */}
            <div
              className="border rounded-lg p-6 hover:bg-indigo-50 cursor-pointer transition-colors"
              onClick={() => navigate("/admin/chat?role=student")}
            >
              <div className="flex items-center mb-3">
                <FiUserPlus className="text-indigo-600 mr-2" size={24} />
                <h3 className="text-lg font-medium">Chat with Students</h3>
              </div>
              <p className="text-gray-600">
                Communicate directly with students
              </p>
            </div>

            {/* View All Chats */}
            <div
              className="border rounded-lg p-6 hover:bg-indigo-50 cursor-pointer transition-colors"
              onClick={() => navigate("/chat")}
            >
              <div className="flex items-center mb-3">
                <FiMessageSquare className="text-indigo-600 mr-2" size={24} />
                <h3 className="text-lg font-medium">All Conversations</h3>
              </div>
              <p className="text-gray-600">
                View all your active conversations
              </p>
            </div>
          </div>
        </div>
      )}

      {/* User Management Section */}
      

      {/* Add Events Section */}
      <div className="bg-white p-6 mt-6 rounded-lg shadow-md">
        {/* AI Suggestions Section */}
        <div className="bg-white p-6 mt-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            AI Event Suggestions
          </h2>
          <button
            onClick={generateEventSuggestions}
            className="bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-600"
          >
            Get AI Suggestions
          </button>
        </div>

        {showSuggestionModal && (
          <div className="fixed inset-0 bg-gray-300 bg-opacity-20 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full mx-4 border border-gray-200">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                AI-Generated Event Suggestions
              </h3>
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                {aiSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <p className="font-medium text-gray-900">
                      {suggestion.title}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {suggestion.description}
                    </p>
                    <button
                      onClick={() => {
                        setNewEvent({
                          title: suggestion.title,
                          description: suggestion.description,
                          start: "",
                          end: "",
                        });
                        setShowSuggestionModal(false);
                        toast.success("Event details filled!");
                      }}
                      className="mt-3 text-sm bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600 transition-colors"
                    >
                      Use This Suggestion
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowSuggestionModal(false)}
                className="mt-6 w-full bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
              >
                Close Suggestions
              </button>
            </div>
          </div>
        )}

        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Add Events & Activities
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Event Title"
            value={newEvent.title}
            onChange={(e) =>
              setNewEvent({ ...newEvent, title: e.target.value })
            }
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="datetime-local"
            value={newEvent.start}
            onChange={(e) =>
              setNewEvent({ ...newEvent, start: e.target.value })
            }
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="datetime-local"
            value={newEvent.end}
            onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:indigo-red-500"
          />
          <input
            type="text"
            placeholder="Description"
            value={newEvent.description}
            onChange={(e) =>
              setNewEvent({ ...newEvent, description: e.target.value })
            }
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button
          onClick={handleAddEvent}
          className="mt-4 bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-600"
        >
          Add Event
        </button>
      </div>

      {/* Calendar Section */}
      <div className="bg-white p-6 mt-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Event Calendar
        </h2>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          onSelectEvent={(event) => handleDeleteEvent(event._id)}
          defaultView="month"
          views={["month", "week", "day", "agenda"]}
          className="border border-gray-300 rounded-lg"
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
