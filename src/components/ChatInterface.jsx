import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import axios from "axios";
import { FiSend, FiPaperclip, FiDownload } from "react-icons/fi";
import AdminChatTools from "./AdminChatTools";

const ChatInterface = ({ chatId, onClose }) => {
  const { currentUser } = useAuth();
  const socket = useSocket();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingStatus, setTypingStatus] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/chat/${chatId}/messages`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        setMessages(response.data);
        scrollToBottom();
      } catch (error) {
        console.error("Error fetching messages:", error);
        setError("Failed to load messages");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();

    // Join chat room
    socket.emit("joinChat", chatId);

    // Set up message listeners
    socket.on("newMessage", (message) => {
      setMessages((prev) => [...prev, message]);
      scrollToBottom();
    });

    socket.on("typing", (data) => {
      if (data.userId !== currentUser._id) {
        setTypingStatus(`${data.userName} is typing...`);
      }
    });

    socket.on("stopTyping", (data) => {
      if (data.userId !== currentUser._id) {
        setTypingStatus("");
      }
    });

    // Set up notification listener
    socket.on("newChatNotification", (notification) => {
      if (notification.chatId === chatId) {
        // Play notification sound
        const audio = new Audio("/notification.mp3");
        audio.play().catch(err => console.error("Error playing notification sound:", err));
      }
    });

    return () => {
      socket.emit("leaveChat", chatId);
      socket.off("newMessage");
      socket.off("typing");
      socket.off("stopTyping");
      socket.off("newChatNotification");
    };
  }, [chatId, currentUser, socket, navigate]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Presence updates
  useEffect(() => {
    if (!socket || !currentUser?._id) return;

    socket.emit("joinChat", chatId);
    socket.emit("presenceUpdate", {
      userId: currentUser._id,
      isOnline: true,
    });

    const handleUserOnline = (userId) => {
      setOnlineUsers((prev) => [...new Set([...prev, userId])]);
    };

    const handleUserOffline = (userId) => {
      setOnlineUsers((prev) => prev.filter((id) => id !== userId));
    };

    socket.on("userOnline", handleUserOnline);
    socket.on("userOffline", handleUserOffline);

    return () => {
      socket.off("userOnline", handleUserOnline);
      socket.off("userOffline", handleUserOffline);
      socket.emit("leaveChat", chatId);
    };
  }, [socket, chatId, currentUser?._id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !selectedFile) return;

    try {
      let messageData = {
        chatId,
        content: newMessage.trim(),
      };

      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const uploadResponse = await axios.post("/upload", formData, {
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
          },
        });

        messageData.fileUrl = uploadResponse.data.url;
        messageData.fileName = selectedFile.name;
        messageData.fileType = selectedFile.type;
      }

      // Emit message through socket
      socket.emit("chatMessage", messageData);

      // Clear input and file
      setNewMessage("");
      setSelectedFile(null);
      setUploadProgress(0);
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message");
    }
  };

  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      socket.emit("typing", {
        chatId,
        userId: currentUser._id,
        userName: `${currentUser.fname} ${currentUser.lname}`
      });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket.emit("stopTyping", {
        chatId,
        userId: currentUser._id
      });
    }, 1000);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-full">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-3 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Chat Room</h2>
        <div className="text-sm text-gray-500">
          {currentUser ? (
            <div className="p-2">Welcome, {currentUser.fname}!</div>
          ) : (
            <div className="p-2">Loading user...</div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 flex ${
              currentUser._id === message.sender._id
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs md:max-w-md rounded-lg p-3 ${
                currentUser._id === message.sender._id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {currentUser._id !== message.sender._id && (
                <div className="flex items-center mb-1">
                  {message.sender.profilePic && (
                    <img
                      src={message.sender.profilePic}
                      alt={message.sender.fname}
                      className="w-6 h-6 rounded-full mr-2"
                    />
                  )}
                  <span className="font-medium">
                    {message.sender.fname} {message.sender.lname}
                  </span>
                </div>
              )}
              <p className="whitespace-pre-wrap">{message.content}</p>
              <p className="text-xs mt-1 opacity-70">
                {new Date(message.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}
        {typingStatus && (
          <div className="text-xs text-gray-500 mb-2">{typingStatus}</div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4">
        <form onSubmit={handleSendMessage} className="flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleTyping}
            placeholder="Type a message..."
            className="flex-1 border rounded-full py-2 px-4 mx-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className={`rounded-full p-2 ${
              newMessage.trim()
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <FiSend />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;