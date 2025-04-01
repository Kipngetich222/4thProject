// import React, { createContext, useContext, useEffect, useState } from "react";
// import { io } from "socket.io-client";
// import { useAuth } from "./AuthContext";

// const SocketContext = createContext(null);

// export const SocketProvider = ({ children }) => {
//   const [socket, setSocket] = useState(null);
//   const { currentUser } = useAuth();

//   useEffect(() => {
//     try{    if (!currentUser?.token) return;

//     const newSocket = io("http://localhost:5000", {
//       // auth: {
//       //   token: localStorage.getItem("token"), // Use the stored token
//       // },
//       // reconnectionAttempts: 5,
//       // reconnectionDelay: 1000,
//       // withCredentials: true,
//       // transports: ["websocket"], // Force WebSocket transport
//       auth: {
//         token: currentUser.token,
//       },
//       reconnectionAttempts: 5,
//       extraHeaders: {
//         Authorization: `Bearer ${currentUser.token}`,
//       },
//       transports: ["websocket"], // Use WebSocket transport
//     });
    
  
//   } catch(error){
//       console.error("Socket connection error:", error);
//       toast.error("Failed to connect to real-time service");
//     }

//     socket.on("connect_error", (err) => {
//       if (err.message === "Authentication error") {
//         logout(); // Force re-auth
//       }
//     });

//     // Debugging listeners
//     newSocket.on("connect", () => {
//       console.log("Socket connected:", newSocket.id);
//     });

//     newSocket.on("disconnect", () => {
//       console.log("Socket disconnected");
//     });

//     newSocket.on("connect_error", (err) => {
//       console.error("Connection error:", err.message);
//     });

//     setSocket(newSocket);

//     return () => {
//       newSocket.off("connect");
//       newSocket.off("disconnect");
//       newSocket.off("connect_error");
//       newSocket.disconnect();
//     };
//   }, [currentUser?.token]);

//   return (
//     <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
//   );
// };

// export const useSocket = () => useContext(SocketContext);

import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { currentUser, logout } = useAuth();

  useEffect(() => {
    if (!currentUser?.token) return;

    let newSocket;

    try {
      newSocket = io("http://localhost:5000", {
        auth: {
          token: currentUser.token,
        },
        reconnectionAttempts: 5,
        transports: ["websocket"],
      });

      // Connection established
      newSocket.on("connect", () => {
        console.log("Socket connected:", newSocket.id);
      });

      // Connection error handling
      newSocket.on("connect_error", (err) => {
        console.error("Socket connection error:", err);
        if (err.message === "Authentication error") {
          toast.error("Session expired. Please login again.");
          logout();
        }
      });

      // Disconnection handling
      newSocket.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
        if (reason === "io server disconnect") {
          toast.error("Disconnected from server. Reconnecting...");
        }
      });

      setSocket(newSocket);
    } catch (error) {
      console.error("Socket initialization error:", error);
      toast.error("Failed to establish real-time connection");
      return;
    }

    // Cleanup function
    return () => {
      if (newSocket) {
        newSocket.off("connect");
        newSocket.off("connect_error");
        newSocket.off("disconnect");
        newSocket.disconnect();
      }
    };
  }, [currentUser?.token, logout]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);