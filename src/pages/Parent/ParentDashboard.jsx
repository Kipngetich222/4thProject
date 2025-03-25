// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { toast } from "react-hot-toast";

// const ParentDashboard = () => {
//   const [events, setEvents] = useState([]);
//   const [notifications, setNotifications] = useState([]);

//   // Fetch all events from the backend
//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         const response = await axios.get("/api/events");
//         setEvents(response.data);
//       } catch (error) {
//         toast.error("Failed to fetch events");
//       }
//     };
//     fetchEvents();
//   }, []);

//   // Connect to WebSocket server
//   useEffect(() => {
//     const ws = new WebSocket("ws://localhost:5000");

//     ws.onopen = () => {
//       console.log("Connected to WebSocket server");
//     };

//     ws.onmessage = (event) => {
//       const message = JSON.parse(event.data);
//       if (message.type === "newEvent") {
//         setNotifications((prev) => [...prev, message.content]);
//       }
//     };

//     ws.onclose = () => {
//       console.log("Disconnected from WebSocket server");
//     };

//     return () => {
//       ws.close();
//     };
//   }, []);


//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <h1 className="text-3xl font-bold text-green-800 mb-6">Parent Dashboard</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <h2 className="text-xl font-semibold text-gray-800">Student Performance</h2>
//           <p className="text-gray-600 mt-2">View grades and progress reports.</p>
//           <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
//             View
//           </button>
//         </div>
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <h2 className="text-xl font-semibold text-gray-800">Attendance Records</h2>
//           <p className="text-gray-600 mt-2">Check your child's attendance.</p>
//           <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
//             Check
//           </button>
//         </div>
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <h2 className="text-xl font-semibold text-gray-800">Communicate with Teachers</h2>
//           <p className="text-gray-600 mt-2">Send messages to teachers.</p>
//           <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
//             Chat
//           </button>
//         </div>
//       </div>

//       <div>
//       <h1>Events</h1>
//       <div>
//         <h2>Notifications</h2>
//         {notifications.map((notification, index) => (
//           <p key={index}>{notification}</p>
//         ))}
//       </div>
//       <div>
//         <h2>Upcoming Events</h2>
//         {events.map((event) => (
//           <div key={event._id}>
//             <h3>{event.title}</h3>
//             <p>{event.description}</p>
//             <p>
//               {new Date(event.start).toLocaleString()} - {new Date(event.end).toLocaleString()}
//             </p>
//           </div>
//         ))}
//       </div>
//     </div>
//     </div>
//   );
// };

// export default ParentDashboard;


import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const ParentDashboard = () => {
  const [events, setEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Fetch all events from the backend
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

  // Connect to WebSocket server
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:5000");

    ws.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "newEvent") {
        setNotifications((prev) => [...prev, message.content]);
      }
    };

    ws.onclose = () => {
      console.log("Disconnected from WebSocket server");
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-green-800 mb-6">Parent Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800">Student Performance</h2>
          <p className="text-gray-600 mt-2">View grades and progress reports.</p>
          <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            View
          </button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800">Attendance Records</h2>
          <p className="text-gray-600 mt-2">Check your child's attendance.</p>
          <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Check
          </button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800">Communicate with Teachers</h2>
          <p className="text-gray-600 mt-2">Send messages to teachers.</p>
          <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Chat
          </button>
        </div>
      </div>

      <div className="mt-8">
        <h1 className="text-2xl font-bold text-green-700 mb-4">Events</h1>
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Notifications</h2>
          <ul className="mt-2 list-disc list-inside text-gray-600">
            {notifications.map((notification, index) => (
              <li key={index} className="bg-gray-100 p-2 rounded mb-2">{notification}</li>
            ))}
          </ul>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800">Upcoming Events</h2>
          <div className="mt-4 space-y-4">
            {events.map((event) => (
              <div key={event._id} className="p-4 border border-gray-300 rounded-lg">
                <h3 className="text-lg font-semibold text-green-700">{event.title}</h3>
                <p className="text-gray-600">{event.description}</p>
                <p className="text-sm text-gray-500">
                  {new Date(event.start).toLocaleString()} - {new Date(event.end).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
