import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FiUsers, FiArchive, FiAlertTriangle } from "react-icons/fi";

const AdminChatTools = ({ chatId }) => {
  const { currentUser } = useAuth();
  const [isArchiving, setIsArchiving] = useState(false);
  const [isReporting, setIsReporting] = useState(false);

  const archiveChat = async () => {
    if (
      !window.confirm(
        "Archive this chat? Admins can still access it but users won't see it."
      )
    )
      return;

    try {
      setIsArchiving(true);
      await axios.patch(`/api/chat/${chatId}/archive`);
      toast.success("Chat archived");
    } catch (error) {
      toast.error("Failed to archive chat");
    } finally {
      setIsArchiving(false);
    }
  };

  const reportChat = async () => {
    const reason = prompt("Enter reason for reporting this chat:");
    if (!reason) return;

    try {
      setIsReporting(true);
      await axios.post(`/api/chat/${chatId}/report`, { reason });
      toast.success("Chat reported to system administrators");
    } catch (error) {
      toast.error("Failed to report chat");
    } finally {
      setIsReporting(false);
    }
  };

  if (currentUser.role !== "admin") return null;

  return (
    <div className="flex justify-end space-x-2 mb-4">
      <button
        onClick={archiveChat}
        disabled={isArchiving}
        className="flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50"
      >
        <FiArchive className="mr-1" />
        {isArchiving ? "Archiving..." : "Archive"}
      </button>
      <button
        onClick={reportChat}
        disabled={isReporting}
        className="flex items-center px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50"
      >
        <FiAlertTriangle className="mr-1" />
        {isReporting ? "Reporting..." : "Report"}
      </button>
    </div>
  );
};

export default AdminChatTools;
