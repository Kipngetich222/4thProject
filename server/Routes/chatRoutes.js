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
router.post("/", authenticate, async (req, res) => {
  try {
    const { participantId } = req.body;

    // Check if chat already exists
    let chat = await Chat.findOne({
      participants: { $all: [req.user._id, participantId] },
      isGroupChat: false,
    }).populate("participants", "fname lname profilePic");

    if (!chat) {
      chat = new Chat({
        participants: [req.user._id, participantId],
        isGroupChat: false,
      });
      await chat.save();

      // Populate participants for response
      chat = await Chat.findById(chat._id).populate(
        "participants",
        "fname lname profilePic"
      );
    }

    res.status(200).json(chat);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
      let fileUrl, fileType;

      if (req.file) {
        fileUrl = `/uploads/chat_files/${req.file.filename}`;
        const ext = path.extname(req.file.originalname).toLowerCase();

        if ([".jpg", ".jpeg", ".png", ".gif"].includes(ext)) {
          fileType = "image";
        } else if ([".mp4", ".mov", ".avi"].includes(ext)) {
          fileType = "video";
        } else if ([".pdf", ".doc", ".docx", ".txt"].includes(ext)) {
          fileType = "document";
        } else {
          fileType = "other";
        }
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
