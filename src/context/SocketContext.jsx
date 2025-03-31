import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser?.token) return;

    const newSocket = io("http://localhost:5000", {
      // auth: {
      //   token: localStorage.getItem("token"), // Use the stored token
      // },
      // reconnectionAttempts: 5,
      // reconnectionDelay: 1000,
      // withCredentials: true,
      // transports: ["websocket"], // Force WebSocket transport
      auth: {
        token: currentUser.token,
      },
      reconnectionAttempts: 5,
      extraHeaders: {
        Authorization: `Bearer ${currentUser.token}`,
      },
      transports: ["websocket"], // Use WebSocket transport
    });

    socket.on("connect_error", (err) => {
      if (err.message === "Authentication error") {
        logout(); // Force re-auth
      }
    });

    // Debugging listeners
    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    newSocket.on("connect_error", (err) => {
      console.error("Connection error:", err.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.off("connect");
      newSocket.off("disconnect");
      newSocket.off("connect_error");
      newSocket.disconnect();
    };
  }, [currentUser?.token]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);