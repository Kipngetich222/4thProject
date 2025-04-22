import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import axios from "axios";
import { FiSend, FiPaperclip, FiDownload } from "react-icons/fi";
import { toast } from "react-hot-toast";

const ChatInterface = () => {
  const { chatId } = useParams();
  const { currentUser } = useAuth();
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingStatus, setTypingStatus] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/chat/${chatId}/messages`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setMessages(response.data);
        scrollToBottom();
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError(err.response?.data?.message || "Error loading messages");
      } finally {
        setLoading(false);
      }
    };

    if (chatId) {
      fetchMessages();
    }
  }, [chatId]);

  // Socket event handlers
  useEffect(() => {
    if (!socket || !currentUser) return;

    // Join chat room
    socket.emit("joinChat", chatId);

    // Handle new messages
    const handleNewMessage = (message) => {
      setMessages((prevMessages) => {
        // Check if message already exists
        const isDuplicate = prevMessages.some((msg) => msg._id === message._id);
        if (!isDuplicate) {
          return [...prevMessages, message];
        }
        return prevMessages;
      });
      scrollToBottom();
    };

    // Handle typing indicators
    const handleTyping = (data) => {
      if (data.userId !== currentUser._id) {
        setTypingStatus(`${data.userName} is typing...`);
        setIsTyping(true);
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
          setIsTyping(false);
          setTypingStatus("");
        }, 3000);
      }
    };

    // Handle stop typing
    const handleStopTyping = (data) => {
      if (data.userId !== currentUser._id) {
        setIsTyping(false);
        setTypingStatus("");
      }
    };

    // Handle notifications
    const handleNotification = (notification) => {
      if (notification.chatId !== chatId) {
        toast(`${notification.sender.fname} sent a new message`, {
          icon: "💬",
        });
      }
    };

    // Handle errors
    const handleError = (error) => {
      toast.error(error.message || "An error occurred");
    };

    // Socket event listeners
    socket.on("newMessage", handleNewMessage);
    socket.on("typing", handleTyping);
    socket.on("stopTyping", handleStopTyping);
    socket.on("newChatNotification", handleNotification);
    socket.on("error", handleError);

    // Update user status
    socket.emit("updateStatus", "online");

    // Cleanup
    return () => {
      socket.emit("leaveChat", chatId);
      socket.off("newMessage", handleNewMessage);
      socket.off("typing", handleTyping);
      socket.off("stopTyping", handleStopTyping);
      socket.off("newChatNotification", handleNotification);
      socket.off("error", handleError);
      socket.emit("updateStatus", "offline");
    };
  }, [socket, currentUser, chatId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size should be less than 10MB");
        return;
      }

      // Check file type
      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];

      if (!allowedTypes.includes(file.type)) {
        toast.error("File type not supported. Please upload images, PDFs, or Office documents.");
        return;
      }

      setSelectedFile(file);
      setError(null);
    }
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
    setUploadProgress(0);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !selectedFile) return;

    let optimisticMessage = null;
    try {
      let messageData = { content: newMessage.trim() };

      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);

        // Upload file first
        const uploadResponse = await axios.post("http://localhost:5000/api/upload", formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
          },
        });

        if (!uploadResponse.data || !uploadResponse.data.url) {
          throw new Error("Failed to upload file");
        }

        messageData = {
          ...messageData,
          fileUrl: uploadResponse.data.url,
          fileName: selectedFile.name,
          fileType: selectedFile.type,
          fileSize: selectedFile.size
        };
      }

      // Create optimistic message
      optimisticMessage = {
        _id: Date.now().toString(),
        content: messageData.content,
        sender: {
          _id: currentUser._id,
          fname: currentUser.fname,
          lname: currentUser.lname,
          profilePic: currentUser.profilePic,
        },
        createdAt: new Date(),
        ...(messageData.fileUrl && {
          fileUrl: messageData.fileUrl,
          fileName: messageData.fileName,
          fileType: messageData.fileType,
          fileSize: messageData.fileSize
        }),
      };

      // Add optimistic message to UI
      setMessages((prev) => [...prev, optimisticMessage]);
      scrollToBottom();

      // Send the message to the server
      const response = await axios.post(
        `/chat/${chatId}/messages`,
        messageData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (socket && response.data) {
        socket.emit("chatMessage", {
          chatId,
          message: response.data,
        });
      }

      setNewMessage("");
      setSelectedFile(null);
      setUploadProgress(0);
    } catch (err) {
      console.error("Error sending message:", err);
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          "Error sending message";
      setError(errorMessage);
      toast.error(errorMessage);
      
      // Remove the optimistic message if sending failed
      if (optimisticMessage) {
        setMessages((prev) => prev.filter(msg => msg._id !== optimisticMessage._id));
      }
    }
  };

  const handleTyping = () => {
    if (socket && chatId) {
      socket.emit("typing", { chatId });
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("stopTyping", { chatId });
      }, 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="text-blue-500 hover:text-blue-700"
        >
          Try Again
        </button>
      </div>
    );
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
        {messages.map((message) => (
          <div
            key={message._id}
            className={`mb-4 ${
              message.sender._id === currentUser._id
                ? "ml-auto"
                : "mr-auto"
            }`}
          >
            <div
              className={`max-w-xs p-3 rounded-lg ${
                message.sender._id === currentUser._id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              <p className="text-sm">{message.content}</p>
              {message.fileUrl && (
                <div className="mt-2">
                  <a
                    href={message.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm hover:underline"
                  >
                    <FiDownload className="mr-1" />
                    {message.fileName}
                  </a>
                </div>
              )}
              <p className="text-xs opacity-75 mt-1">
                {new Date(message.createdAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="text-gray-500 text-sm italic">
            {typingStatus}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t">
        {selectedFile && (
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-gray-600">{selectedFile.name}</span>
            <button
              type="button"
              onClick={handleFileRemove}
              className="text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="mb-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}
        <div className="flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleTyping}
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 border-t border-b border-gray-300 hover:bg-gray-100"
          >
            <FiPaperclip size={20} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            type="submit"
            disabled={!newMessage.trim() && !selectedFile}
            className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600 disabled:opacity-50"
          >
            <FiSend size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;