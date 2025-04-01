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
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch chats with timeout
        const chatsResponse = await axios.get("/api/chat", { timeout: 5000 });
        setChats(chatsResponse.data);

        // Determine role-based filtering
        let roleFilter = [];
        if (currentUser) {
          switch (currentUser.role) {
            case "teacher":
              roleFilter = ["parent", "student"];
              break;
            case "parent":
              roleFilter = ["teacher"];
              break;
            case "student":
              roleFilter = ["teacher", "student"];
              break;
            default:
              roleFilter = [];
          }
        }

        // Fetch users with timeout
        const usersResponse = await axios.get(
          `/api/users?role=${roleFilter.join(",")}`,
          { timeout: 5000 }
        );
        setUsers(
          usersResponse.data.filter((user) => user._id !== currentUser?._id)
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  return (
    <div className="w-80 border-r p-4 h-full overflow-y-auto">
      <button
        onClick={() => navigate("/new-chat")}
        className="w-full bg-blue-500 text-white p-2 rounded mb-4 hover:bg-blue-600"
      >
        <FiUserPlus className="inline mr-2" /> New Chat
      </button>

      {chats.length === 0 ? (
        <div className="text-center p-4 text-gray-500">
          No existing chats. Start a new conversation!
        </div>
      ) : (
        chats.map((chat) => (
          <div
            key={chat._id}
            className="p-2 hover:bg-gray-100 rounded cursor-pointer"
          >
            {/* Chat list items */}
          </div>
        ))
      )}

      <div className="mt-4">
        <h3 className="font-semibold mb-2">Available Users</h3>
        {users.length === 0 ? (
          <div className="text-gray-500">No users available</div>
        ) : (
          users.map((user) => (
            <div key={user._id} className="p-2 hover:bg-gray-100 rounded">
              {user.fname} {user.lname} ({user.role})
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatList;