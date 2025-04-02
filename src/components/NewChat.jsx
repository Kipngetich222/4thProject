// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import axios from "axios";
// import { toast } from "react-hot-toast";
// import { FiSearch, FiUser, FiArrowLeft } from "react-icons/fi";

// const NewChat = () => {
//   const { currentUser } = useAuth();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();


//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         setLoading(true);
//         let url = "/api/users";

//         if (currentUser) {
//           switch (currentUser.role) {
//             case "teacher":
//               url += "?role=student,parent";
//               break;
//             case "parent":
//               url += "?role=teacher";
//               break;
//             case "student":
//               url += "?role=teacher,student";
//               break;
//             default:
//               url += "?role=teacher,student,parent";
//           }
//         }

//         const response = await axios.get(url, { timeout: 5000 });
//         setUsers(response.data.filter((user) => user._id !== currentUser?._id));
//       } catch (error) {
//         toast.error("Failed to load users");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, [currentUser]);

//   const filteredUsers = users.filter((user) =>
//     `${user.fname} ${user.lname}`
//       .toLowerCase()
//       .includes(searchTerm.toLowerCase())
//   );

//   const startChat = async (participantId) => {
//     try {
//       const response = await axios.post("/api/chat", { participantId });
//       navigate(`/chat/${response.data._id}`);
//     } catch (error) {
//       toast.error("Failed to start chat");
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto p-4">
//       {/* Header with back button */}
//       <div className="flex items-center mb-6">
//         <button
//           onClick={() => navigate(-1)}
//           className="flex items-center gap-2 text-blue-600 hover:text-blue-900 cursor-pointer font-medium transition-colors"
//         >
//           <FiArrowLeft className="w-5 h-5" />
//           <span>Back</span>
//         </button>
//         <h2 className="text-xl font-bold ml-4">New Chat</h2>
//       </div>

//       {/* Search bar */}
//       <div className="relative mb-6">
//         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//           <FiSearch className="text-gray-400" />
//         </div>
//         <input
//           type="text"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           placeholder="Search users..."
//           className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//         />
//       </div>

//       {/* User list */}
//       {loading ? (
//         <div className="flex justify-center items-center h-40">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
//         </div>
//       ) : filteredUsers.length === 0 ? (
//         <p className="text-center text-gray-500 py-4">
//           {searchTerm ? "No matching users found" : "No users available"}
//         </p>
//       ) : (
//         <ul className="space-y-2">
//           {filteredUsers.map((user) => (
//             <li
//               key={user._id}
//               className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
//               onClick={() => startChat(user._id)}
//             >
//               <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-3">
//                 {user.profilePic ? (
//                   <img
//                     src={user.profilePic}
//                     alt={`${user.fname} ${user.lname}`}
//                     className="h-full w-full object-cover"
//                   />
//                 ) : (
//                   <FiUser className="text-gray-500" />
//                 )}
//               </div>
//               <div className="flex-1 min-w-0">
//                 <p className="text-sm font-medium text-gray-900 truncate">
//                   {user.fname} {user.lname}
//                 </p>
//                 <p className="text-sm text-gray-500 capitalize">{user.role}</p>
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default NewChat;


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FiSearch, FiUser, FiArrowLeft } from "react-icons/fi";

const NewChat = () => {
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("NewChat mounted - Current user role:", currentUser?.role);

    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Starting user fetch...");

        // Build role-based query parameters
        let params = {
          exclude: currentUser?._id,
          debug: true,
        };

        if (currentUser) {
          console.log("Applying role filters for:", currentUser.role);

          switch (currentUser.role) {
            case "teacher":
              params.role = "parent,student";
              break;
            case "parent":
              params.role = "teacher";
              break;
            case "student":
              params.role = "teacher"; // Students only chat with teachers
              break;
            case "admin":
              params.role = "teacher,parent,student"; // Admins can chat with all
              break;
            default:
              console.warn("Unknown role - no filters applied");
          }
        }

        console.log("Fetching users with params:", params);
        const response = await axios.get("/api/users", {
          params,
        });

        console.log("Users received:", response.data.length);
        setUsers(response.data);
      } catch (error) {
        console.error("User fetch failed:", error);
        setError(error.response?.data?.error || error.message);
        toast.error(error.response?.data?.error || "Failed to load users");
      } finally {
        setLoading(false);
        console.log("User fetch completed");
      }
    };

    fetchUsers();

    return () => {
      console.log("NewChat unmounted");
    };
  }, [currentUser]);

  const filteredUsers = users.filter((user) =>
    `${user.fname} ${user.lname} ${user.role}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const startChat = async (participantId) => {
    console.log("Starting chat with:", participantId);
    try {
      const response = await axios.post(
        "/api/chat",
        {
          participantId,
        },
        {
          timeout: 3000,
        }
      );

      console.log("Chat created:", response.data._id);
      navigate(`/chat/${response.data._id}`);
    } catch (error) {
      console.error("Chat creation failed:", error);
      toast.error(error.response?.data?.error || "Failed to start chat");
    }
  };

  const renderUserList = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (error) {
      return <div className="text-red-500 p-4 text-center">Error: {error}</div>;
    }

    if (filteredUsers.length === 0) {
      return (
        <p className="text-center text-gray-500 py-4">
          {searchTerm
            ? "No matching users found"
            : `No ${getRoleLabel(currentUser?.role)} available`}
        </p>
      );
    }

    return (
      <ul className="space-y-2">
        {filteredUsers.map((user) => (
          <li
            key={user._id}
            className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => startChat(user._id)}
          >
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-3">
              {user.profilePic ? (
                <img
                  src={user.profilePic}
                  alt={`${user.fname} ${user.lname}`}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.parentElement.innerHTML =
                      '<FiUser className="text-gray-500" />';
                  }}
                />
              ) : (
                <FiUser className="text-gray-500" size={18} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.fname} {user.lname}
              </p>
              <div className="flex items-center">
                <p className="text-xs text-gray-500 capitalize mr-2">
                  {user.role}
                </p>
                {user.isOnline && (
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case "teacher":
        return "parents or students";
      case "parent":
        return "teachers";
      case "student":
        return "teachers";
      case "admin":
        return "users";
      default:
        return "available users";
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      {/* Header with back button */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-900 cursor-pointer font-medium transition-colors"
        >
          <FiArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <h2 className="text-xl font-bold ml-4">New Chat</h2>
      </div>

      {/* Search bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={`Search ${getRoleLabel(currentUser?.role)}...`}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      {/* User list */}
      {renderUserList()}
    </div>
  );
};

export default NewChat;