import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const SocketContext = createContext({
  socket: null,
  isConnected: false,
  emit: () => {},
  on: () => {},
  off: () => {},
});

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const { currentUser, logout } = useAuth();

  // Helper functions to safely interact with socket
  const emit = (event, data) => {
    if (socket?.connected) {
      socket.emit(event, data);
    } else {
      console.warn("Socket not connected, cannot emit event:", event);
    }
  };

  const on = (event, callback) => {
    if (socket) {
      socket.on(event, callback);
    }
  };

  const off = (event, callback) => {
    if (socket) {
      socket.off(event, callback);
    }
  };

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
        setIsConnected(true);
        toast.success("Connected to server");
      });

      // Connection error handling
      newSocket.on("connect_error", (err) => {
        console.error("Socket connection error:", err);
        setIsConnected(false);
        if (err.message === "Authentication error") {
          toast.error("Session expired. Please login again.");
          logout();
        } else {
          toast.error("Failed to connect to server. Retrying...");
        }
      });

      // Disconnection handling
      newSocket.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
        setIsConnected(false);
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

  const value = {
    socket,
    isConnected,
    emit,
    on,
    off,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};