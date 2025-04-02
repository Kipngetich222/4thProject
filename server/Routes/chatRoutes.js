import express from "express";
import Chat from "../models/chat.js";
import Message from "../models/message.js";
import User from "../models/user.js";
import { authenticate } from "../middleware/auth.js";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import { upload, handleUploadErrors } from "../middleware/fileUpload.js";

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Get or create a chat between two users
// In chatRoutes.js
// router.post("/", authenticate, async (req, res) => {
//   try {
//     const { participantId } = req.body;
//     const userId = req.user._id;

//     // Check if participant exists and is allowed to chat
//     const participant = await User.findById(participantId);
//     if (!participant) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     // Role-based chat validation
//     const currentUser = await User.findById(userId);
//     if (currentUser.role === "parent" && participant.role !== "teacher") {
//       return res.status(403).json({ error: "Parents can only message teachers" });
//     }
//     if (currentUser.role === "student" && !["teacher", "student"].includes(participant.role)) {
//       return res.status(403).json({ error: "Students can only message teachers or other students" });
//     }

//     // Check for existing chat
//     let chat = await Chat.findOne({
//       isGroupChat: false,
//       participants: { $all: [userId, participantId] }
//     }).populate("participants", "-password");

//     if (!chat) {
//       chat = await Chat.create({
//         participants: [userId, participantId],
//         isGroupChat: false,
//       });
//       await chat.populate("participants", "-password");
//     }

//     res.status(200).json(chat);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// Update the chat creation endpoint
router.post("/", authenticate, async (req, res) => {
  try {
    const { participantId } = req.body;
    const userId = req.user._id;

    // Add validation for existing chat
    let chat = await Chat.findOne({
      participants: { $all: [userId, participantId] },
      isGroupChat: false,
    }).populate("participants", "-password");

    if (!chat) {
      chat = await Chat.create({
        participants: [userId, participantId],
        isGroupChat: false,
      });
      await chat.populate("participants", "-password");
    }

    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all chats for a user
router.get("/", authenticate, async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: { $in: [req.user._id] },
    })
      .populate("participants", "fname lname profilePic")
      .populate("lastMessage")
      .sort({ lastMessageAt: -1 });

    res.status(200).json(chats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get messages for a chat
router.get("/:chatId/messages", authenticate, async (req, res) => {
  try {
    const messages = await Message.find({
      chatId: req.params.chatId,
    })
      .populate("sender", "fname lname profilePic")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Send a message (with optional file upload)
router.post(
  "/:chatId/messages",
  authenticate,
  upload.single("file"),
  async (req, res) => {
    try {
      const { content } = req.body;
      let fileUrl;

      let fileType = "other";
      if (req.file) {
        const mimeType = req.file.mimetype;
        if (mimeType.startsWith("image/")) fileType = "image";
        else if (mimeType.startsWith("video/")) fileType = "video";
        else if (
          mimeType === "application/pdf" ||
          mimeType.includes("document")
        )
          fileType = "document";
      }

      const newMessage = new Message({
        chatId: req.params.chatId,
        sender: req.user._id,
        content,
        fileUrl,
        fileType,
      });

      await newMessage.save();

      // Update chat last message
      await Chat.findByIdAndUpdate(req.params.chatId, {
        lastMessage: content || "File shared",
        lastMessageAt: new Date(),
      });

      // Broadcast to WebSocket clients
      const chat = await Chat.findById(req.params.chatId).populate(
        "participants"
      );

      chat.participants.forEach((participant) => {
        // In a real implementation, this would be handled by WebSocket
        // For now we just return the message
      });

      res.status(201).json(newMessage);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Add to chatRoutes.js message endpoint
// router.post("/:chatId/messages", authenticate, async (req, res) => {
//   try {
//     // Verify user is chat participant
//     const chat = await Chat.findById(req.params.chatId);
//     if (!chat.participants.includes(req.user._id)) {
//       return res.status(403).json({ error: "Not a chat participant" });
//     }

//     // Rest of existing code...
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

export default router;
