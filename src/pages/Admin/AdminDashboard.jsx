// src/pages/Admin/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../../services/api";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

const localizer = momentLocalizer(moment);

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: "", start: "", end: "", description: "" });
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const navigate = useNavigate();


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


  // Add this function for AI event suggestions
const generateEventSuggestions = async () => {
  try {
    const response = await axios.post("/api/generate-ai-suggestions", {
      currentEvents: events.map(e => e.title)
    });
    setAiSuggestions(response.data.suggestions);
    setShowSuggestionModal(true);
  } catch (err) {
    toast.error("Failed to generate suggestions");
  }
};

  // Fetch all events from the backend
  useEffect(() => {
    fetchUsers();
    const fetchEvents = async () => {
      try {
        const response = await axios.get("/api/events");
        setEvents(response.data);
      } catch (error) {
        toast.error("Failed to fetch events");
      }
    };
    fetchEvents();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response.data);
    } catch (error) {
      alert("Error fetching users");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      fetchUsers();
    } catch (error) {
      alert("Error deleting user");
    }
  };


  // Add a new event
  // Update your handleAddEvent function
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
    // Format dates properly for the server
    const eventToSend = {
      title: newEvent.title,
      description: newEvent.description || "",
      start: new Date(newEvent.start).toISOString(),
      end: new Date(newEvent.end).toISOString()
    };

    const response = await axios.post("/api/events", eventToSend, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    // Update local state
    setEvents([...events, response.data]);
    setNewEvent({ title: "", start: "", end: "", description: "" });
    toast.success("Event added successfully!");
  } catch (error) {
    console.error("Event creation failed:", error);
    const errorMessage = error.response?.data?.error || 
                        error.response?.data?.message || 
                        "Failed to create event";
    toast.error(errorMessage);
  }
};

  // Delete an event
  const handleDeleteEvent = async (eventId) => {
    try {
      await axios.delete(`/api/events/${eventId}`);
      setEvents(events.filter((event) => event._id !== eventId));
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
  className="flex items-center gap-2 text-blue-600 hover:text-blue-900 cursor-pointer font-medium transition-colors"
>
  <FiArrowLeft className="w-5 h-5" />
  <span>Back</span>
</button>
  
      <div className="flex items-center mt-2">
      <h1 className="text-3xl font-bold text-red-800 mb-6">Admin Dashboard</h1>
            <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
              isConnected ? 'bg-green-500' : 'bg-red-500'
            }`}></span>
            <span className="text-sm text-gray-600">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
  
      {/* User Management Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">User Management</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="text-left p-3 border border-gray-300">Name</th>
              <th className="text-left p-3 border border-gray-300">Email</th>
              <th className="text-left p-3 border border-gray-300">Role</th>
              <th className="text-left p-3 border border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border border-gray-300 hover:bg-gray-100">
                <td className="p-3 border border-gray-300">{user.name}</td>
                <td className="p-3 border border-gray-300">{user.email}</td>
                <td className="p-3 border border-gray-300">{user.role}</td>
                <td className="p-3 border border-gray-300">
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  
      {/* Add Events Section */}
      <div className="bg-white p-6 mt-6 rounded-lg shadow-md">
        {/* AI Suggestions Section */}
<div className="bg-white p-6 mt-6 rounded-lg shadow-md">
  <h2 className="text-xl font-semibold text-gray-800 mb-4">AI Event Suggestions</h2>
  <button
    onClick={generateEventSuggestions}
    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
  >
    Get AI Suggestions
  </button>
</div>

{/* AI Suggestions Modal */}
{showSuggestionModal && (
  <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full mx-4 border border-gray-200">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">AI-Generated Event Suggestions</h3>
      <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
        {aiSuggestions.map((suggestion, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <p className="font-medium text-gray-900">{suggestion.title}</p>
            <p className="text-sm text-gray-600 mt-1">{suggestion.description}</p>
            <button
              onClick={() => {
                setNewEvent({
                  title: suggestion.title,
                  description: suggestion.description,
                  start: "",
                  end: ""
                });
                setShowSuggestionModal(false);
                toast.success("Event details filled!");
              }}
              className="mt-3 text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors"
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


        <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Events & Activities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Event Title"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <input
            type="datetime-local"
            value={newEvent.start}
            onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <input
            type="datetime-local"
            value={newEvent.end}
            onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <input
            type="text"
            placeholder="Description"
            value={newEvent.description}
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <button
          onClick={handleAddEvent}
          className="mt-4 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
        >
          Add Event
        </button>
      </div>
  
      {/* Calendar Section */}
      <div className="bg-white p-6 mt-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Event Calendar</h2>
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