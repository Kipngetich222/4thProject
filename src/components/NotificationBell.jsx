import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FiBell, FiCheck } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const NotificationBell = () => {
  const { currentUser, loading: authLoading } = useAuth();
  const socket = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch notifications when component mounts or currentUser changes
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!currentUser) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await axios.get("/api/notifications");
        setNotifications(response.data);
        setUnreadCount(response.data.filter((n) => !n.isRead).length);
      } catch (error) {
        toast.error("Failed to load notifications");
      } finally {
        setIsLoading(false);
      }
    };

    // Request notification permission
    if (
      Notification.permission !== "granted" &&
      Notification.permission !== "denied"
    ) {
      Notification.requestPermission();
    }

    fetchNotifications();
  }, [currentUser]);

  // Socket.IO event listeners
  useEffect(() => {
    if (!socket || !currentUser?.id) return;

    const handleNewNotification = (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);

      // Show desktop notification if permission is granted
      if (Notification.permission === "granted") {
        new Notification("New Notification", {
          body: notification.content,
          icon: notification.sender?.profilePic || "/logo.png",
        });
      }
    };

    const handleNotificationRead = (notificationId) => {
      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    };

    const handleAllNotificationsRead = () => {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    };

    socket.on("newNotification", handleNewNotification);
    socket.on("notificationRead", handleNotificationRead);
    socket.on("allNotificationsRead", handleAllNotificationsRead);

    // Join user's notification room
    socket.emit("joinNotificationRoom", currentUser._id);

    return () => {
      socket.off("newNotification", handleNewNotification);
      socket.off("notificationRead", handleNotificationRead);
      socket.off("allNotificationsRead", handleAllNotificationsRead);
      socket.emit("leaveNotificationRoom", currentUser._id);
    };
  }, [socket, currentUser?._id]);

  const markAsRead = async (id) => {
    try {
      await axios.patch(`/api/notifications/${id}/read`);
      socket?.emit("markNotificationRead", id);
    } catch (error) {
      toast.error("Failed to mark notification as read");
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.patch("/api/notifications/read-all");
      socket?.emit("markAllNotificationsRead");
    } catch (error) {
      toast.error("Failed to mark notifications as read");
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification._id);
    }

    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    } else if (notification.chat) {
      navigate(`/chat/${notification.chat._id}`);
    }

    setIsOpen(false);
  };

  // Don't show notification bell if user isn't logged in
  if (!currentUser) {
    return null;
  }

  // Loading state
  if (authLoading || isLoading) {
    return (
      <div className="p-2">
        <FiBell size={20} className="text-gray-400" />
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-gray-200 relative transition-colors"
        aria-label="Notifications"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <FiBell size={20} className="text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center transform translate-x-1 -translate-y-1">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50 border border-gray-200">
          <div className="p-3 border-b flex justify-between items-center bg-gray-50 rounded-t-md">
            <h3 className="font-semibold text-gray-800">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-gray-500 text-center">
                No notifications yet
              </p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-3 border-b cursor-pointer transition-colors ${
                    !notification.isRead
                      ? "bg-blue-50 hover:bg-blue-100"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex gap-3">
                    {notification.sender?.profilePic && (
                      <img
                        src={notification.sender.profilePic}
                        alt={notification.sender.fname}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <p className="font-medium text-gray-900">
                          {notification.sender?.fname || "System"}
                        </p>
                        {!notification.isRead && (
                          <span className="inline-block w-2 h-2 bg-blue-500 rounded-full ml-2"></span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.content}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(notification.createdAt).toLocaleString([], {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
