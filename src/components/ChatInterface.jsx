import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import axios from "axios";
import { FiSend, FiPaperclip, FiDownload } from "react-icons/fi";
import AdminChatTools from "./AdminChatTools";

const ChatInterface = () => {
  const { chatId } = useParams();
  const { currentUser } = useAuth();
  const socket = useSocket();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingStatus, setTypingStatus] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const messagesEndRef = useRef(null);

  // Fetch existing messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`/api/chat/${chatId}/messages`);
        setMessages(response.data);
      } catch (error) {
        console.error("Failed to load messages:", error);
      }
    };

    fetchMessages();

    // Socket handlers
    if (socket) {
      socket.emit("joinChat", chatId);

      const handleNewMessage = (message) => {
        if (message.chatId === chatId) {
          setMessages((prev) => [...prev, message]);
        }
      };

      const handleTyping = ({ userId, isTyping }) => {
        if (currentUser?._id && userId !== currentUser._id) {
          setIsTyping(isTyping);
          setTypingStatus(isTyping ? "Someone is typing..." : "");
        }
      };

      const handleOnlineUsers = (users) => {
        setOnlineUsers(users);
      };

      socket.on("newMessage", handleNewMessage);
      socket.on("typing", handleTyping);
      socket.on("onlineUsers", handleOnlineUsers);

      return () => {
        socket.off("newMessage", handleNewMessage);
        socket.off("typing", handleTyping);
        socket.off("onlineUsers", handleOnlineUsers);
        socket.emit("leaveChat", chatId);
      };
    }
  }, [chatId, socket, currentUser?._id]); // Optional chaining in dependencies

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

  const handleSendMessage = async () => {
    if ((!newMessage.trim() && !selectedFile) || !currentUser) return;

    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append("file", selectedFile);
        formData.append("fileType", selectedFile.type.split("/")[0]); // 'image', 'application', etc.
      }
      if (newMessage.trim()) formData.append("content", newMessage);

      const response = await axios.post(
        `/api/chat/${chatId}/messages`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (socket) {
        socket.emit("chatMessage", {
          chatId,
          sender: {
            _id: currentUser._id,
            fname: currentUser.fname,
            lname: currentUser.lname,
            profilePic: currentUser.profilePic,
          },
          content: newMessage,
          fileUrl: response.data.fileUrl,
          fileType: response.data.fileType,
          createdAt: new Date().toISOString(),
        });
      }

      setNewMessage("");
      setSelectedFile(null);
      setIsTyping(false);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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
                      onClick={() => setSelectedFile(null)}
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
                  onKeyPress={handleKeyPress}
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
