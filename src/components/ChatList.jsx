// ChatList.jsx - Updated
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { SocketProvider } from "../context/SocketContext";
import axios from "axios";
import { FiMessageSquare, FiUserPlus } from "react-icons/fi";

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const socket = SocketProvider();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get("/api/chat");
        setChats(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.token) {
      fetchChats();
    } else {
      navigate("/login");
    }

    // Listen for new messages to update last message preview
    if (socket) {
      const handleNewMessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === "newMessage") {
          setChats((prevChats) =>
            prevChats.map((chat) =>
              chat._id === message.data.chatId
                ? { ...chat, lastMessage: message.data.content }
                : chat
            )
          );
        }
      };

      socket.addEventListener("message", handleNewMessage);
      return () => socket.removeEventListener("message", handleNewMessage);
    }
  }, [currentUser, navigate, socket]);

  const startNewChat = async (participantId) => {
    try {
      const response = await axios.post("/api/chat", { participantId });
      navigate(`/chat/${response.data._id}`);
    } catch (error) {
      console.error("Failed to start chat:", error);
    }
  };

  if (loading) return <div>Loading chats...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-4">
      <button
        onClick={() => navigate("/new-chat")}
        className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      >
        <FiUserPlus /> New Chat
      </button>

      {chats.length === 0 ? (
        <div className="text-center py-8">
          <FiMessageSquare className="mx-auto text-gray-400 text-4xl mb-2" />
          <p className="text-gray-500">
            No chats yet. Start a new conversation!
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {chats.map((chat) => (
            <div
              key={chat._id}
              onClick={() => navigate(`/chat/${chat._id}`)}
              className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer flex justify-between items-center"
            >
              <div>
                <h3 className="font-medium">
                  {chat.isGroupChat
                    ? chat.groupName
                    : chat.participants.find((p) => p._id !== currentUser._id)
                        ?.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {chat.lastMessage?.content || "No messages yet"}
                </p>
              </div>
              <span
                className={`inline-block w-2 h-2 rounded-full ${
                  chat.participants.some((p) => p.isOnline)
                    ? "bg-green-500"
                    : "bg-gray-300"
                }`}
              ></span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatList;
