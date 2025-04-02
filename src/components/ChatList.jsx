// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import axios from "axios";
// import { FiMessageSquare, FiUserPlus } from "react-icons/fi";

// const ChatList = () => {
//   const [chats, setChats] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { currentUser } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);

//         // Fetch chats with timeout
//         const chatsResponse = await axios.get("/api/chat");
//         setChats(chatsResponse.data);

//         // Determine role-based filtering
//         let roleFilter = [];
//         if (currentUser) {
//           switch (currentUser.role) {
//             case "teacher":
//               roleFilter = ["parent", "student"];
//               break;
//             case "parent":
//               roleFilter = ["teacher"];
//               break;
//             case "student":
//               roleFilter = ["teacher", "student"];
//               break;
//             default:
//               roleFilter = [];
//           }
//         }

//         // Fetch users with timeout
//         const usersResponse = await axios.get(
//           `/api/users?role=${roleFilter.join(",")}`,
//           { timeout: 5000 }
//         );
//         setUsers(
//           usersResponse.data.filter((user) => user._id !== currentUser?._id)
//         );
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [currentUser]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-40">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return <div className="text-red-500 p-4">Error: {error}</div>;
//   }

//   return (
//     <div className="w-80 border-r p-4 h-full overflow-y-auto">
//       <button
//         onClick={() => navigate("/new-chat")}
//         className="w-full bg-blue-500 text-white p-2 rounded mb-4 hover:bg-blue-600"
//       >
//         <FiUserPlus className="inline mr-2" /> New Chat
//       </button>

//       {chats.length === 0 ? (
//         <div className="text-center p-4 text-gray-500">
//           No existing chats. Start a new conversation!
//         </div>
//       ) : (
//         chats.map((chat) => (
//           <div
//             key={chat._id}
//             className="p-2 hover:bg-gray-100 rounded cursor-pointer"
//           >
//             {/* Chat list items */}
//           </div>
//         ))
//       )}

//       <div className="mt-4">
//         <h3 className="font-semibold mb-2">Available Users</h3>
//         {users.length === 0 ? (
//           <div className="text-gray-500">No users available</div>
//         ) : (
//           users.map((user) => (
//             <div key={user._id} className="p-2 hover:bg-gray-100 rounded">
//               {user.fname} {user.lname} ({user.role})
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChatList;


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { FiMessageSquare, FiUserPlus } from "react-icons/fi";

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("ChatList mounted - Current user:", currentUser?.role);

    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("Starting data fetch...");

        // 1. Fetch chats
        console.log("Fetching chats...");
        const chatsResponse = await axios.get("/api/chat", {
          timeout: 5000,
          params: { debug: true },
        });
        console.log("Chats received:", chatsResponse.data.length);
        setChats(chatsResponse.data);

        // 2. Determine role-based filtering
        let roleFilter = [];
        if (currentUser) {
          console.log("Current user role:", currentUser.role);

          switch (currentUser.role) {
            case "teacher":
              roleFilter = ["parent", "student"];
              break;
            case "parent":
              roleFilter = ["teacher"];
              break;
            case "student":
              roleFilter = ["teacher"]; // Removed student-student chat
              break;
            case "admin":
              roleFilter = ["teacher", "parent", "student"]; // Admin can see all
              break;
            default:
              roleFilter = [];
          }
        }

        console.log("Role filter to apply:", roleFilter);

        // 3. Fetch users
        if (roleFilter.length > 0) {
          console.log("Fetching users with roles:", roleFilter);
          const usersResponse = await axios.get(`/api/users`, {
            timeout: 5000,
            params: {
              role: roleFilter.join(","),
              exclude: currentUser?._id,
            },
          });

          console.log("Users received:", usersResponse.data.length);
          setUsers(usersResponse.data);
        } else {
          console.warn("No role filter applied - skipping user fetch");
          setUsers([]);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
        console.log("Data fetch completed");
      }
    };

    fetchData();

    return () => {
      console.log("ChatList unmounted");
    };
  }, [currentUser]);

  if (loading) {
    console.log("Rendering loading state");
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    console.error("Rendering error state:", error);
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  console.log("Rendering with:", {
    chats: chats.length,
    users: users.length,
  });

  return (
    <div className="w-80 border-r p-4 h-full overflow-y-auto">
      <button
        onClick={() => navigate("/new-chat")}
        className="w-full bg-blue-500 text-white p-2 rounded mb-4 hover:bg-blue-600"
      >
        <FiUserPlus className="inline mr-2" /> New Chat
      </button>

      {/* Chats Section */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Your Conversations</h3>
        {chats.length === 0 ? (
          <div className="text-center p-4 text-gray-500">
            No existing chats. Start a new conversation!
          </div>
        ) : (
          chats.map((chat) => (
            <div
              key={chat._id}
              className="p-2 hover:bg-gray-100 rounded cursor-pointer flex items-center"
              onClick={() => navigate(`/chat/${chat._id}`)}
            >
              <div className="w-8 h-8 rounded-full bg-gray-200 mr-2 flex items-center justify-center">
                {chat.participants[0]?.profilePic ? (
                  <img
                    src={chat.participants[0].profilePic}
                    alt="Profile"
                    className="w-full h-full rounded-full"
                  />
                ) : (
                  <FiMessageSquare className="text-gray-500" />
                )}
              </div>
              <div>
                <p className="font-medium">
                  {chat.participants[0]?.fname} {chat.participants[0]?.lname}
                </p>
                <p className="text-xs text-gray-500">
                  {chat.lastMessage?.substring(0, 30)}...
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Available Users Section */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Available Users</h3>
        {users.length === 0 ? (
          <div className="text-gray-500 p-2">
            {currentUser?.role === "admin"
              ? "No non-admin users available"
              : `No ${
                  currentUser?.role === "teacher"
                    ? "parents/students"
                    : "teachers"
                } available`}
          </div>
        ) : (
          users.map((user) => (
            <div
              key={user._id}
              className="p-2 hover:bg-gray-100 rounded cursor-pointer flex items-center"
              onClick={() => navigate(`/new-chat?userId=${user._id}`)}
            >
              <div className="w-8 h-8 rounded-full bg-gray-200 mr-2 flex items-center justify-center overflow-hidden">
                {user.profilePic ? (
                  <img
                    src={user.profilePic}
                    alt={`${user.fname} ${user.lname}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FiUserPlus className="text-gray-500" />
                )}
              </div>
              <div>
                <p className="font-medium">
                  {user.fname} {user.lname}
                </p>
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatList;