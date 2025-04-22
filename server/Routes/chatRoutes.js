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

    // Validate participant exists
    const participant = await User.findById(participantId);
    if (!participant) {
      return res.status(404).json({ error: "Participant not found" });
    }

    // Check for existing chat
    let chat = await Chat.findOne({
      participants: { $all: [userId, participantId] },
      isGroupChat: false
    }).populate("participants", "-password");

    if (!chat) {
      chat = await Chat.create({
        participants: [userId, participantId],
        isGroupChat: false
      });
      await chat.populate("participants", "-password");
    }

    res.status(200).json(chat);
  } catch (error) {
    console.error("Chat creation error:", error);
    res.status(500).json({ error: "Failed to create chat" });
  }
});

// Get all chats for a user
router.get("/", authenticate, async (req, res) => {
  try {
    console.log("User making request:", req.user);
    const chats = await Chat.find({
      participants: { $in: [req.user._id] },
    })
      .populate("participants", "fname lname profilePic")
      .populate("lastMessage")
      .sort({ lastMessageAt: -1 });

    res.status(200).json(chats);
  } catch (err) {
    console.error("Error fetching chats:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get messages for a chat
router.get("/:chatId/messages", authenticate, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId);
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    // Verify user is a participant
    if (!chat.participants.includes(req.user._id)) {
      return res.status(403).json({ error: "Not authorized to view this chat" });
    }

    const messages = await Message.find({
      chatId: req.params.chatId,
    })
      .populate("sender", "fname lname profilePic")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// Send a message
router.post("/:chatId/messages", authenticate, async (req, res) => {
  try {
    const { content } = req.body;
    const chatId = req.params.chatId;

    // Verify chat exists and user is a participant
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    if (!chat.participants.includes(req.user._id)) {
      return res.status(403).json({ error: "Not authorized to send messages in this chat" });
    }

    const newMessage = new Message({
      chatId,
      sender: req.user._id,
      content,
    });

    await newMessage.save();

    // Update chat's last message
    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: newMessage._id,
      lastMessageAt: new Date(),
    });

    // Emit socket event for real-time updates
    req.app.get('io').to(chatId).emit('newMessage', {
      ...newMessage.toObject(),
      sender: {
        _id: req.user._id,
        fname: req.user.fname,
        lname: req.user.lname,
        profilePic: req.user.profilePic,
      },
    });

    res.status(201).json(newMessage);
  } catch (err) {
    console.error("Error sending message:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
});

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