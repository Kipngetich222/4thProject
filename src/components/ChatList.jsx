import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import axios from "axios";
import { FiMessageSquare, FiUserPlus } from "react-icons/fi";
import { toast } from "react-hot-toast";

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const { socket } = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch chats
        const chatsResponse = await axios.get("/chat", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setChats(chatsResponse.data);

        // Fetch available users
        try {
          const usersResponse = await axios.get("/users/available", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          setUsers(usersResponse.data);
        } catch (usersError) {
          console.error("Error fetching users:", usersError);
          setUsers([]);
        }
      } catch (err) {
        console.error("Error fetching chats:", err);
        setChats([]);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchData();
    }
  }, [currentUser]);

  // Socket event handlers
  useEffect(() => {
    if (!socket || !currentUser) return;

    // Handle new messages
    const handleNewMessage = (message) => {
      setChats((prevChats) => {
        const updatedChats = prevChats.map((chat) => {
          if (chat._id === message.chatId) {
            return {
              ...chat,
              lastMessage: message,
              updatedAt: new Date(),
            };
          }
          return chat;
        });
        return updatedChats.sort((a, b) => 
          new Date(b.updatedAt) - new Date(a.updatedAt)
        );
      });
    };

    // Handle chat notifications
    const handleNotification = (notification) => {
      toast(`${notification.sender.fname} sent a new message`, {
        icon: "💬",
      });
    };

    // Handle user status changes
    const handleUserStatus = (data) => {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === data.userId
            ? { ...user, isOnline: data.status === "online" }
            : user
        )
      );
    };

    // Socket event listeners
    socket.on("newMessage", handleNewMessage);
    socket.on("newChatNotification", handleNotification);
    socket.on("userStatusChanged", handleUserStatus);

    // Cleanup
    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("newChatNotification", handleNotification);
      socket.off("userStatusChanged", handleUserStatus);
    };
  }, [socket, currentUser]);

  const startChat = async (userId) => {
    try {
      const response = await axios.post(
        "/api/chat",
        { participantId: userId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data && response.data._id) {
        navigate(`/chat/${response.data._id}`);
      }
    } catch (err) {
      console.error("Error starting chat:", err);
      toast.error("Failed to start chat");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-80 border-r p-4 h-full overflow-y-auto">
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Your Chats</h2>
        {chats.length === 0 ? (
          <p className="text-gray-500">No chats yet</p>
        ) : (
          <div className="space-y-2">
            {chats.map((chat) => (
              <div
                key={chat._id}
                className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer"
                onClick={() => navigate(`/chat/${chat._id}`)}
              >
                <FiMessageSquare className="mr-2" />
                <div>
                  <p className="font-medium">
                    {chat.participants
                      .filter((p) => p._id !== currentUser._id)
                      .map((p) => `${p.fname} ${p.lname}`)
                      .join(", ")}
                  </p>
                  <p className="text-sm text-gray-500">
                    {chat.lastMessage?.content || "No messages yet"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Available Users</h2>
        {users.length === 0 ? (
          <p className="text-gray-500">No users available</p>
        ) : (
          <div className="space-y-2">
            {users.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between p-2 hover:bg-gray-100 rounded"
              >
                <div>
                  <p className="font-medium">
                    {user.fname} {user.lname}
                  </p>
                  <p className="text-sm text-gray-500 capitalize">
                    {user.role}
                    {user.isOnline && (
                      <span className="ml-2 text-green-500">• Online</span>
                    )}
                  </p>
                </div>
                <button
                  onClick={() => startChat(user._id)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <FiUserPlus size={20} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;