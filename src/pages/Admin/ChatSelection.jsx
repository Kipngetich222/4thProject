import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { FiUser, FiMessageSquare } from "react-icons/fi";
import { toast } from "react-hot-toast";

const ChatSelection = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const role = new URLSearchParams(location.search).get("role");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/users?role=${role}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUsers(response.data);
      } catch (err) {
        console.error("Error fetching users:", err);
        toast.error("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    if (currentUser && role) {
      fetchUsers();
    }
  }, [currentUser, role]);

  const handleStartChat = async (userId) => {
    try {
      const response = await axios.post(
        "/chat",
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

  const filteredUsers = users.filter(
    (user) =>
      user._id !== currentUser?._id &&
      (user.fname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lname.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Chat with {role.charAt(0).toUpperCase() + role.slice(1)}s
        </h1>
        <p className="text-gray-600">
          Select a user to start a conversation
        </p>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            className="border rounded-lg p-6 hover:bg-indigo-50 cursor-pointer transition-colors"
            onClick={() => handleStartChat(user._id)}
          >
            <div className="flex items-center mb-4">
              {user.profilePic ? (
                <img
                  src={user.profilePic}
                  alt={`${user.fname} ${user.lname}`}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                  <FiUser className="text-indigo-600" size={24} />
                </div>
              )}
              <div>
                <h3 className="text-lg font-medium">
                  {user.fname} {user.lname}
                </h3>
                <p className="text-gray-600 capitalize">{user.role}</p>
              </div>
            </div>
            <div className="flex items-center text-indigo-600">
              <FiMessageSquare className="mr-2" />
              <span>Start Chat</span>
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">
            No {role}s found matching your search
          </p>
        </div>
      )}
    </div>
  );
};

export default ChatSelection; 