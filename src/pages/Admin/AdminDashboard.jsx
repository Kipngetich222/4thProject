// src/pages/Admin/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../../services/api";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import { toast } from "react-hot-toast";

const localizer = momentLocalizer(moment);

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: "", start: "", end: "", description: "" });

  // useEffect(() => {
  //   fetchUsers();
  // }, []);

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

  // // Fetch all events from the backend
  // useEffect(() => {
  //   const fetchEvents = async () => {
  //     try {
  //       const response = await axios.get("/api/events");
  //       setEvents(response.data);
  //     } catch (error) {
  //       toast.error("Failed to fetch events");
  //     }
  //   };
  //   fetchEvents();
  // }, []);

  // Add a new event
  const handleAddEvent = async () => {
    try {
      const response = await axios.post("/api/events", newEvent);
      setEvents([...events, response.data]);
      setNewEvent({ title: "", start: "", end: "", description: "" });
      toast.success("Event added successfully");
    } catch (error) {
      toast.error("Failed to add event");
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
      <h1 className="text-3xl font-bold text-red-800 mb-6">Admin Dashboard</h1>
  
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