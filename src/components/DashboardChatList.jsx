import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import axios from "axios";
import { FiMessageSquare, FiUser, FiBell, FiClock, FiCheck, FiCheckCircle, FiRefreshCw } from "react-icons/fi";
import { toast } from "react-hot-toast";

const DashboardChatList = ({ role }) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState({});
  const [lastSeen, setLastSeen] = useState({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [conversationCount, setConversationCount] = useState(0);
  const { currentUser } = useAuth();
  const { socket } = useSocket();
  const navigate = useNavigate();

  // Update conversation count whenever chats change
  useEffect(() => {
    const activeChats = chats.filter(chat => {
      const otherParticipant = chat.participants.find(
        p => p._id !== currentUser._id
      );
      return otherParticipant.role === role;
    });
    setConversationCount(activeChats.length);
  }, [chats, currentUser, role]);

  // Fetch chats function
  const fetchChats = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setError(null);

      const response = await axios.get("/chat", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      // Filter and sort chats
      const filteredChats = response.data
        .filter(chat => {
          const otherParticipant = chat.participants.find(
            p => p._id !== currentUser._id
          );
          return otherParticipant && otherParticipant.role === role;
        })
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      
      // Initialize states
      const unreadCounts = {};
      const lastSeenTimes = {};
      filteredChats.forEach(chat => {
        unreadCounts[chat._id] = chat.unreadMessages || 0;
        lastSeenTimes[chat._id] = chat.lastSeen || null;
      });
      
      setChats(filteredChats);
      setUnreadMessages(unreadCounts);
      setLastSeen(lastSeenTimes);
      setConversationCount(filteredChats.length);
    } catch (err) {
      console.error("Error fetching chats:", err);
      setError("Failed to load chats. Please try again.");
      toast.error("Failed to load chats");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [currentUser, role]);

  // Initial fetch
  useEffect(() => {
    if (currentUser) {
      fetchChats();
    }
  }, [currentUser, fetchChats]);

  // Socket event handlers
  useEffect(() => {
    if (!socket || !currentUser) return;

    const handleNewChat = (chat) => {
      const otherParticipant = chat.participants.find(
        p => p._id !== currentUser._id
      );
      
      if (otherParticipant && otherParticipant.role === role) {
        setChats(prevChats => {
          const chatExists = prevChats.some(c => c._id === chat._id);
          if (!chatExists) {
            const updatedChats = [...prevChats, chat];
            const sortedChats = updatedChats.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
            setConversationCount(sortedChats.length);
            return sortedChats;
          }
          return prevChats;
        });

        // Show notification for new chat
        toast((t) => (
          <div 
            className="flex items-center gap-3 p-2 bg-white rounded-lg shadow-lg cursor-pointer hover:bg-gray-50"
            onClick={() => {
              handleChatClick(chat._id);
              toast.dismiss(t.id);
            }}
          >
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                <FiMessageSquare className="text-indigo-600" size={24} />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900">New Chat Started</p>
              <p className="text-sm text-gray-600 truncate">
                Chat with {otherParticipant.fname} {otherParticipant.lname}
              </p>
            </div>
          </div>
        ), {
          duration: 5000,
          position: 'top-right',
        });
      }
    };

    const handleChatDeleted = (chatId) => {
      setChats(prevChats => {
        const updatedChats = prevChats.filter(chat => chat._id !== chatId);
        setConversationCount(updatedChats.length);
        return updatedChats;
      });
      
      setUnreadMessages(prev => {
        const { [chatId]: removed, ...rest } = prev;
        return rest;
      });
      
      setLastSeen(prev => {
        const { [chatId]: removed, ...rest } = prev;
        return rest;
      });

      toast.info("Chat has been deleted");
    };

    const handleNewMessage = async (message) => {
      const chatId = message.chatId;
      
      setChats(prevChats => {
        const chatExists = prevChats.some(chat => chat._id === chatId);
        
        if (!chatExists) {
          // Fetch the new chat
          fetchChat(chatId);
          return prevChats;
        }
        
        const updatedChats = prevChats.map(chat => {
          if (chat._id === chatId) {
            return {
              ...chat,
              lastMessage: message,
              updatedAt: new Date().toISOString()
            };
          }
          return chat;
        });

        return updatedChats.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      });

      // Update unread count for recipient only
      if (message.sender._id !== currentUser._id) {
        setUnreadMessages(prev => ({
          ...prev,
          [chatId]: (prev[chatId] || 0) + 1
        }));

        // Show notification
        const sender = message.sender;
        toast((t) => (
          <div 
            className="flex items-center gap-3 p-2 bg-white rounded-lg shadow-lg cursor-pointer hover:bg-gray-50"
            onClick={() => {
              handleChatClick(chatId);
              toast.dismiss(t.id);
            }}
          >
            <div className="flex-shrink-0">
              {sender.profilePic ? (
                <img
                  src={sender.profilePic}
                  alt={`${sender.fname} ${sender.lname}`}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                  <FiUser className="text-indigo-600" size={24} />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900">{`${sender.fname} ${sender.lname}`}</p>
              <p className="text-sm text-gray-600 truncate">{message.content}</p>
            </div>
          </div>
        ), {
          duration: 5000,
          position: 'top-right',
          style: {
            background: 'none',
            padding: '0',
            boxShadow: 'none',
          },
        });

        // Play notification sound
        const audio = new Audio('/notification.mp3');
        audio.play().catch(err => console.log('Audio play failed:', err));
      }
    };

    const handleMessageRead = (data) => {
      if (data.chatId) {
        setUnreadMessages(prev => ({
          ...prev,
          [data.chatId]: 0
        }));
        setLastSeen(prev => ({
          ...prev,
          [data.chatId]: new Date().toISOString()
        }));
      }
    };

    const handleUserStatus = (data) => {
      setChats(prevChats => {
        return prevChats.map(chat => {
          const otherParticipant = chat.participants.find(p => p._id === data.userId);
          if (otherParticipant) {
            return {
              ...chat,
              participants: chat.participants.map(p => 
                p._id === data.userId ? { ...p, isOnline: data.isOnline } : p
              )
            };
          }
          return chat;
        });
      });
    };

    socket.on("newChat", handleNewChat);
    socket.on("chatDeleted", handleChatDeleted);
    socket.on("newMessage", handleNewMessage);
    socket.on("messageRead", handleMessageRead);
    socket.on("userStatus", handleUserStatus);

    // Join role-specific room
    socket.emit("joinRoom", { role });

    return () => {
      socket.off("newChat", handleNewChat);
      socket.off("chatDeleted", handleChatDeleted);
      socket.off("newMessage", handleNewMessage);
      socket.off("messageRead", handleMessageRead);
      socket.off("userStatus", handleUserStatus);
      socket.emit("leaveRoom", { role });
    };
  }, [socket, currentUser, role, navigate]);

  const fetchChat = async (chatId) => {
    try {
      const response = await axios.get(`/chat/${chatId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      const chat = response.data;
      const otherParticipant = chat.participants.find(
        p => p._id !== currentUser._id
      );
      
      if (otherParticipant && otherParticipant.role === role) {
        setChats(prevChats => {
          const chatExists = prevChats.some(c => c._id === chat._id);
          if (!chatExists) {
            const updatedChats = [...prevChats, chat];
            const sortedChats = updatedChats.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
            setConversationCount(sortedChats.length);
            return sortedChats;
          }
          return prevChats;
        });
      }
    } catch (err) {
      console.error("Error fetching chat:", err);
      toast.error("Failed to load chat details");
    }
  };

  const handleChatClick = async (chatId) => {
    try {
      await axios.post(`/chat/${chatId}/read`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setUnreadMessages(prev => ({
        ...prev,
        [chatId]: 0
      }));
      setLastSeen(prev => ({
        ...prev,
        [chatId]: new Date().toISOString()
      }));

      navigate(`/chat/${chatId}`);
    } catch (err) {
      console.error("Error marking messages as read:", err);
      toast.error("Failed to update message status");
    }
  };

  const handleStartNewChat = () => {
    navigate(`/admin/chat?role=${role}`);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchChats(false);
  };

  const formatLastSeen = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 h-full flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="text-gray-600 mt-2">Loading chats...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg p-6 h-full flex flex-col items-center justify-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <FiRefreshCw size={18} className={isRefreshing ? "animate-spin" : ""} />
          <span>Try Again</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {role.charAt(0).toUpperCase() + role.slice(1)}s
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {conversationCount} {conversationCount === 1 ? 'conversation' : 'conversations'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="p-2 text-gray-600 hover:text-indigo-600 transition-colors"
            disabled={isRefreshing}
          >
            <FiRefreshCw size={18} className={isRefreshing ? "animate-spin" : ""} />
          </button>
          <button
            onClick={handleStartNewChat}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
          >
            <FiMessageSquare size={18} />
            <span className="text-sm font-medium">New Chat</span>
          </button>
        </div>
      </div>
      
      {chats.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg">
          <div className="text-gray-400 mb-4">
            <FiMessageSquare size={48} />
          </div>
          <p className="text-gray-600 text-center mb-4">
            No active chats with {role}s
          </p>
          <button
            onClick={handleStartNewChat}
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <FiMessageSquare size={18} />
            <span>Start New Chat</span>
          </button>
        </div>
      ) : (
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto space-y-3 pr-2">
            {chats.map((chat) => {
              const otherParticipant = chat.participants.find(
                p => p._id !== currentUser._id
              );
              
              return (
                <div
                  key={chat._id}
                  className="group flex items-start p-4 border rounded-lg hover:bg-indigo-50 cursor-pointer transition-all"
                  onClick={() => handleChatClick(chat._id)}
                >
                  <div className="relative flex-shrink-0">
                    {otherParticipant.profilePic ? (
                      <img
                        src={otherParticipant.profilePic}
                        alt={`${otherParticipant.fname} ${otherParticipant.lname}`}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                        <FiUser className="text-indigo-600" size={24} />
                      </div>
                    )}
                    {otherParticipant.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0 ml-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">
                          {otherParticipant.fname} {otherParticipant.lname}
                        </h4>
                        <p className="text-sm text-gray-600 truncate mt-1">
                          {chat.lastMessage?.content || "No messages yet"}
                        </p>
                      </div>
                      <div className="ml-4 flex flex-col items-end">
                        {unreadMessages[chat._id] > 0 ? (
                          <span className="inline-flex items-center justify-center px-2 py-1 bg-indigo-600 text-white text-xs font-medium rounded-full min-w-[1.5rem]">
                            {unreadMessages[chat._id]}
                          </span>
                        ) : chat.lastMessage?.sender._id === currentUser._id && (
                          <div className="text-gray-400">
                            {lastSeen[chat._id] ? (
                              <FiCheckCircle size={16} className="text-green-500" />
                            ) : (
                              <FiCheck size={16} />
                            )}
                          </div>
                        )}
                        {chat.lastMessage && (
                          <div className="flex items-center gap-1 mt-1">
                            <FiClock className="text-gray-400" size={12} />
                            <span className="text-xs text-gray-500">
                              {new Date(chat.lastMessage.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    {otherParticipant.isOnline ? (
                      <p className="text-xs text-green-500 mt-1">Online</p>
                    ) : lastSeen[chat._id] && (
                      <p className="text-xs text-gray-500 mt-1">
                        Last seen {formatLastSeen(lastSeen[chat._id])}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardChatList; 