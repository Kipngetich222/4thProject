import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { useSocket } from "../context/SocketContext";

const localizer = momentLocalizer(moment);

const ParentDashboard = () => {
  const [events, setEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [mutedEvents, setMutedEvents] = useState([]);
  const [notificationSettings, setNotificationSettings] = useState({
    dailySummary: true,
    eventReminders: true,
    importantAlerts: true,
  });
  const socket = useSocket();
  const navigate = useNavigate();

  // Fetch initial events
  useEffect(() => {
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

  // Socket.IO event listeners
  useEffect(() => {
    if (!socket) return;

    const handleNewEvent = (event) => {
      setEvents((prevEvents) => {
        const exists = prevEvents.some((e) => e._id === event._id);
        return exists ? prevEvents : [...prevEvents, event];
      });

      if (
        !mutedEvents.includes(event._id) &&
        notificationSettings.eventReminders
      ) {
        setNotifications((prev) => [
          {
            id: `${event._id}-${Date.now()}`,
            eventId: event._id,
            title: event.title,
            content: event.aiSummary,
            date: new Date(event.start).toLocaleString(),
            isRead: false,
          },
          ...prev,
        ]);

        if (notificationSettings.importantAlerts) {
          toast(
            <div>
              <strong>New Event: {event.title}</strong>
              <p>{event.aiSummary}</p>
              <small>{new Date(event.start).toLocaleString()}</small>
            </div>,
            { duration: 8000, icon: "🔔" }
          );
        }
      }
    };

    const handleDailySummary = (summary) => {
      if (notificationSettings.dailySummary) {
        toast(summary, { duration: 10000, icon: "📅" });
      }
    };

    socket.on("newEvent", handleNewEvent);
    socket.on("dailySummary", handleDailySummary);

    // Join parent-specific room
    socket.emit("joinParentRoom");

    return () => {
      socket.off("newEvent", handleNewEvent);
      socket.off("dailySummary", handleDailySummary);
      socket.emit("leaveParentRoom");
    };
  }, [socket, mutedEvents, notificationSettings]);

  const toggleNotificationSetting = (key) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleMuteEvent = (eventId) => {
    setMutedEvents((prev) =>
      prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId]
    );
  };

  const markAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Back Arrow Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-green-600 hover:text-green-900 cursor-pointer font-medium transition-colors"
      >
        <FiArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      <div className="flex flex-row items-center justify-center mt-2">
        <h1 className="text-3xl font-bold text-green-800 mb-6">
          Parent Dashboard
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800">
            Student Performance
          </h2>
          <p className="text-gray-600 mt-2">
            View grades and progress reports.
          </p>
          <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            View
          </button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800">
            Attendance Records
          </h2>
          <p className="text-gray-600 mt-2">Check your child's attendance.</p>
          <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Check
          </button>
        </div>
        {/* // Update the "Communicate with Teachers" section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800">
            Communicate with Teachers
          </h2>
          <p className="text-gray-600 mt-2">Send messages to teachers.</p>
          <button
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={() => navigate("/chat")}
          >
            Chat
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-green-800">Events</h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Notification Panel */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">
                Notification Settings
              </h2>
              <div className="space-y-3">
                {Object.entries(notificationSettings).map(([key, value]) => (
                  <div key={key} className="flex items-center">
                    <input
                      type="checkbox"
                      id={key}
                      checked={value}
                      onChange={() => toggleNotificationSetting(key)}
                      className="mr-2"
                    />
                    <label htmlFor={key} className="capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">
                Recent Notifications
              </h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-gray-500">No notifications</p>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 border rounded-lg ${
                        notification.isRead ? "bg-gray-50" : "bg-blue-50"
                      }`}
                    >
                      <div className="flex justify-between">
                        <h3 className="font-medium">{notification.title}</h3>
                        <button
                          onClick={() => toggleMuteEvent(notification.eventId)}
                          className="text-xs px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          {mutedEvents.includes(notification.eventId)
                            ? "Unmute"
                            : "Mute"}
                        </button>
                      </div>
                      <p className="text-sm my-1">{notification.content}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          {notification.date}
                        </span>
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-xs text-blue-600 hover:text-blue-800"
                          >
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Calendar and Events */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
              <div className="h-[500px]">
                <Calendar
                  localizer={localizer}
                  events={events.map((event) => ({
                    id: event._id,
                    title: event.title,
                    start: new Date(event.start),
                    end: new Date(event.end),
                    desc: event.description,
                  }))}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: "100%" }}
                  defaultView="month"
                  views={["month", "week", "day", "agenda"]}
                  onSelectEvent={(event) => {
                    const fullEvent = events.find((e) => e._id === event.id);
                    toast(
                      <div>
                        <h3 className="font-bold">{fullEvent.title}</h3>
                        <p className="my-2">{fullEvent.description}</p>
                        <div className="text-sm text-gray-600">
                          <p>
                            Starts: {new Date(fullEvent.start).toLocaleString()}
                          </p>
                          <p>
                            Ends: {new Date(fullEvent.end).toLocaleString()}
                          </p>
                        </div>
                      </div>,
                      { duration: 10000 }
                    );
                  }}
                />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Event List</h2>
              <div className="space-y-4">
                {events.length === 0 ? (
                  <p className="text-gray-500">No upcoming events</p>
                ) : (
                  [...events]
                    .sort((a, b) => new Date(a.start) - new Date(b.start))
                    .map((event) => (
                      <div
                        key={event._id}
                        className="border rounded-lg p-4 hover:bg-gray-50"
                      >
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-lg">{event.title}</h3>
                          <button
                            onClick={() => toggleMuteEvent(event._id)}
                            className={`text-xs px-2 py-1 rounded ${
                              mutedEvents.includes(event._id)
                                ? "bg-gray-200 hover:bg-gray-300"
                                : "bg-blue-100 hover:bg-blue-200 text-blue-800"
                            }`}
                          >
                            {mutedEvents.includes(event._id) ? "Muted" : "Mute"}
                          </button>
                        </div>
                        <p className="text-gray-600 my-2">
                          {event.description}
                        </p>
                        <div className="text-sm text-gray-500">
                          <p>📅 {new Date(event.start).toLocaleDateString()}</p>
                          <p>
                            🕒 {new Date(event.start).toLocaleTimeString()} -{" "}
                            {new Date(event.end).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
