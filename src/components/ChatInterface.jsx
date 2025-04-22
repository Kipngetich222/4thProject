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
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/chat/${chatId}/messages`);
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

    socket.on("typing", () => {
      setOtherUserTyping(true);
    });

    socket.on("stopTyping", () => {
      setOtherUserTyping(false);
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
  }, [chatId, user, navigate]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
      socket.emit("typing", chatId);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket.emit("stopTyping", chatId);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="border-b p-3 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Chat Room</h2>
        <div className="text-sm text-gray-500">
          {onlineUsers.length > 0 ? (
            <span>{onlineUsers.length} online</span>
          ) : (
            <span>Offline</span>
          )}

      {currentUser ? (
        <div className="p-2">Welcome, {currentUser.fname}!</div>
      ) : (
        <div className="p-2">Loading user...</div>
      )}

      <AdminChatTools chatId={chatId} />

      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 flex ${
              currentUser?._id === message.sender?._id
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs md:max-w-md rounded-lg p-3 ${
                currentUser?._id === message.sender?._id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {currentUser?._id !== message.sender?._id && (
                <div className="flex items-center mb-1">
                  {message.sender?.profilePic && (
                    <img
                      src={message.sender.profilePic}
                      alt={message.sender.fname}
                      className="w-6 h-6 rounded-full mr-2"
                    />
                  )}
                  <span className="font-medium">
                    {message.sender?.fname} {message.sender?.lname}
                  </span>
                </div>
              )}
              {/* Message content remains same */}
              {/* ... rest of message rendering ... */}
              {message.content && (
                              <p className="whitespace-pre-wrap">{message.content}</p>
                            )}
                            {message.fileUrl && (
                              <div className="mt-2">
                                {message.fileType?.startsWith("image/") ? (
                                  <img
                                    src={message.fileUrl}
                                    alt="Shared file"
                                    className="max-w-full h-auto rounded"
                                  />
                                ) : (
                                  <a
                                    href={message.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center text-blue-600 hover:underline"
                                  >
                                    <FiDownload className="mr-1" />
                                    Download {message.fileType?.split("/")[1] || "file"}
                                  </a>
                                )}
                              </div>
                            )}
                            <p className="text-xs mt-1 opacity-70">
                              {new Date(message.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                      {isTyping && (
                        <div className="flex justify-start mb-4">
                          <div className="bg-gray-200 text-gray-800 rounded-lg p-3">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                              <div
                                className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              ></div>
                              <div
                                className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                                style={{ animationDelay: "0.4s" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
            </div>
         
        {/* Typing indicator and input section remain same */}
      </div>

      {/* Message input */}
      
      {/* Message input */}
            <div className="border-t p-4">
              {typingStatus && (
                <div className="text-xs text-gray-500 mb-2">{typingStatus}</div>
              )}
              <div className="flex items-center">
                <label className="cursor-pointer p-2 hover:bg-gray-100 rounded-full">
                  <FiPaperclip className="text-gray-500" />
                  <input
                    type="file"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    className="hidden"
                    accept="image/*, .pdf, .doc, .docx, .txt"
                  />
                </label>
                {selectedFile && (
                  <div className="ml-2 text-sm text-gray-500 flex items-center">
                    <span>{selectedFile.name}</span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedFile(null);
                      }}
                      className="ml-1 text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                )}
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 border rounded-full py-2 px-4 mx-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  onKeyPress={handleTyping}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() && !selectedFile}
                  className={`rounded-full p-2 ${
                    newMessage.trim() || selectedFile
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <FiSend />
                </button>
              </div>
            </div>
           
    </div>
  );
};

export default ChatInterface;