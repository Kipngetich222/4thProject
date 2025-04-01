import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

import router from "./Routes/router.js";
import chatRoutes from "./Routes/chatRoutes.js";
import eventRoutes from "./Routes/eventRoutes.js";
// import notificationRoutes from "./Routes/notificationRoutes.js";

import axios from "axios";
import multer from "multer";
import fs from "fs/promises";
import path from "path";
import schedule from "node-schedule";

import { extractTextFromFile } from "./utils/fileProcessor.js";
import Event from "./models/event.js";
import Message from "./models/message.js";
import Chat from "./models/chat.js";
import User from "./models/user.js";
// import Notification from "./models/notification.js";
import ChatReport from "./models/chatReport.js";
import Counter from "./models/counter.js";

import { authenticate } from "./middleware/auth.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);
app.use("/api", router);
app.use(cookieParser());

// Add timeout middleware
app.use((req, res, next) => {
  req.setTimeout(5000, () => {
    res.status(504).json({ error: "Request timeout" });
  });
  next();
});

// Create HTTP server
const server = http.createServer(app);

// Configure Socket.IO
// Add path to Socket.IO config
export const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
  path: "/socket.io" // Explicitly set path
});

// Socket.IO authentication middleware
// io.use((socket, next) => {
//   const token =
//     socket.handshake.auth?.token ||
//     socket.handshake.headers?.authorization?.split(" ")[1];

//   if (!token) {
//     return next(new Error("Authentication error"));
//   }

//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) return next(new Error("Authentication error"));
//     socket.userId = decoded._id;
//     next();
//   });
// });

// Update Socket.IO authentication
// io.use((socket, next) => {
//   const token = socket.handshake.auth?.token || 
//                socket.handshake.headers?.authorization?.split(" ")[1];
  
//   if (!token) return next(new Error("Authentication error"));
  
//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) return next(new Error("Authentication error"));
    
//     // Verify user exists in database
//     User.findById(decoded._id).then(user => {
//       if (!user) return next(new Error("User not found"));
//       socket.user = user;
//       next();
//     });
//   });
// });

// server.js - Socket.IO middleware
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error("Authentication error"));

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return next(new Error("Authentication error"));
    
    User.findById(decoded._id).then((user) => {
      if (!user) return next(new Error("User not found"));
      socket.user = user; // Attach full user object
      next();
    }).catch(err => next(err));
  });
});

// Track active users
const activeUsers = new Set();

// Socket.IO connection handler
io.on("connection", (socket) => {
  console.log(`User ${socket.user?._id} connected`);

  // Join user-specific room
  socket.join(socket.userId);

  // Handle chat messages
  socket.on("chatMessage", async (messageData) => {
    try {
      // Save message to database
      const newMessage = await Message.create({
        ...messageData,
        sender: socket.user._id,
      });

      // Find chat and populate participants
      const chat = await Chat.findById(messageData.chatId)
        .populate("participants")
        .populate("lastMessage");

      // Update last message in chat
      chat.lastMessage = newMessage._id;
      await chat.save();

      // Broadcast to all participants
      chat.participants.forEach((participant) => {
        io.to(participant._id.toString()).emit("newMessage", newMessage);
      });
    } catch (error) {
      console.error("Message handling error:", error);
    }
  });

  // Handle typing indicators
  socket.on("typing", ({ chatId, isTyping }) => {
    socket.to(chatId).emit("typing", {
      userId: socket.userId,
      isTyping,
    });
  });

  // Handle joining chat rooms
  socket.on("joinChat", (chatId) => {
    socket.join(chatId);
    console.log(`User ${socket.userId} joined chat ${chatId}`);
  });

  // Handle leaving chat rooms
  socket.on("leaveChat", (chatId) => {
    socket.leave(chatId);
    console.log(`User ${socket.userId} left chat ${chatId}`);
  });

  // Handle event creation notifications
  socket.on("subscribeToEvents", () => {
    socket.join("events");
    console.log(`User ${socket.userId} subscribed to events`);
  });

  activeUsers.add(socket.userId);
  io.emit("activeUsers", Array.from(activeUsers));

  // Handle disconnection
  socket.on("disconnect", () => {
    activeUsers.delete(socket.userId);
    io.emit("activeUsers", Array.from(activeUsers));
    console.log(`Client disconnected: ${socket.id} (User: ${socket.userId})`);
  });
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads/");
  },
  filename: (_, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// API Configuration
const DEEPSEEK_API_URL =
  process.env.DEEPSEEK_API_URL ||
  "https://openrouter.ai/api/v1/chat/completions";
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const NEWS_API_KEY = process.env.NEWS_API_KEY;

// Mount routes
app.use("/api", eventRoutes);
app.use("/", router);
app.use("/api/chat", chatRoutes);
// app.use("/api/notifications", notificationRoutes);

// Error handler middleware
app.use(errorHandler);

// API Endpoints

// Generate lesson plan
app.post("/api/generate-lesson-plan", async (req, res) => {
  const { topic } = req.body;
  try {
    const prompt = `Generate a detailed lesson plan for the topic: ${topic}. The lesson plan should include:
1. **Objective**: What will students learn?
2. **Introduction**: Explain the topic and its importance.
3. **Main Activity**: Describe an interactive activity.
4. **Conclusion**: Summarize key points.
5. **Homework**: Task to reinforce understanding.`;

    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        model: "openai/gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 600,
        temperature: 0.6,
      },
      {
        headers: {
          Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.CLIENT_URL || "http://localhost:5173",
          "X-Title": "School Management System",
        },
      }
    );

    const lessonPlan = response.data.choices[0].message.content;
    res.status(200).json({ lessonPlan });
  } catch (error) {
    console.error("Error generating lesson plan:", error);
    res.status(500).json({ error: "Failed to generate lesson plan" });
  }
});

// Generate questions from file
app.post("/api/generate-questions", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    const text = await extractTextFromFile(req.file.path, req.file.mimetype);
    const prompt = `Analyze this document and generate 5 multiple-choice questions with 4 options each. Format each as:
Q1) Question text
A) Option A
B) Option B
C) Option C
D) Option D
Answer: <letter>

Document Content:
${text}`;

    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        model: "openai/gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1200,
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.CLIENT_URL || "http://localhost:5173",
        },
        timeout: 30000,
      }
    );

    const content = response.data.choices[0].message.content;
    const questionBlocks = content
      .split(/\n\s*\n/)
      .filter(
        (block) => block.trim().startsWith("Q") && block.includes("Answer:")
      );

    if (questionBlocks.length < 1) {
      throw new Error("No properly formatted questions found");
    }

    await fs.unlink(req.file.path);
    res.json({ success: true, questions: questionBlocks });
  } catch (error) {
    console.error("Question generation failed:", error);
    try {
      if (req.file?.path) await fs.unlink(req.file.path);
    } catch (cleanupError) {
      console.error("Cleanup failed:", cleanupError);
    }
    res.status(500).json({ error: "Failed to generate questions" });
  }
});

// Process PDF
app.post("/api/process-pdf", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    const text = await extractTextFromFile(req.file.path, req.file.mimetype);
    res.json({ text });
  } catch (err) {
    console.error("PDF processing failed:", err);
    res.status(500).json({ error: "Failed to process PDF" });
  } finally {
    try {
      await fs.unlink(req.file.path);
    } catch (cleanupErr) {
      console.error("File cleanup error:", cleanupErr);
    }
  }
});

// Content recommendations
app.post("/api/search-content", async (req, res) => {
  const { query } = req.body;
  try {
    const [youtubeResponse, newsResponse] = await Promise.all([
      axios.get(`https://www.googleapis.com/youtube/v3/search`, {
        params: {
          part: "snippet",
          q: query,
          type: "video",
          maxResults: 5,
          key: YOUTUBE_API_KEY,
        },
      }),
      axios.get(`https://newsapi.org/v2/everything`, {
        params: {
          q: query,
          pageSize: 5,
          apiKey: NEWS_API_KEY,
        },
      }),
    ]);

    const videos = youtubeResponse.data.items.map((item) => ({
      type: "video",
      title: item.snippet.title,
      link: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      thumbnail: item.snippet.thumbnails.default.url,
    }));

    const articles = newsResponse.data.articles.map((article) => ({
      type: "article",
      title: article.title,
      link: article.url,
      description: article.description,
    }));

    res.status(200).json({ content: [...videos, ...articles] });
  } catch (error) {
    console.error("Error fetching content:", error);
    res.status(500).json({ error: "Failed to fetch content recommendations" });
  }
});

// Event management
app.post("/api/events", async (req, res) => {
  try {
    const { title, description, start, end } = req.body;

    if (!title?.trim())
      return res.status(400).json({ error: "Event title is required" });
    if (!start || !end)
      return res
        .status(400)
        .json({ error: "Both start and end times are required" });

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (isNaN(startDate.getTime()))
      return res.status(400).json({ error: "Invalid start date format" });
    if (isNaN(endDate.getTime()))
      return res.status(400).json({ error: "Invalid end date format" });
    if (startDate >= endDate)
      return res
        .status(400)
        .json({ error: "End time must be after start time" });
    if (startDate < new Date())
      return res
        .status(400)
        .json({ error: "Start time cannot be in the past" });

    const eventData = {
      title: title.trim(),
      description: description?.trim() || "",
      start: startDate,
      end: endDate,
      createdBy: req.user?._id || "system",
    };

    const newEvent = await Event.create(eventData);
    io.to("events").emit("newEvent", newEvent);

    res.status(201).json({
      success: true,
      data: newEvent,
      message: "Event created successfully",
    });
  } catch (err) {
    console.error("Event creation error:", err);

    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((e) => e.message);
      return res
        .status(400)
        .json({ error: "Validation failed", details: errors });
    }

    if (err.code === 11000) {
      return res
        .status(400)
        .json({ error: "Event with similar details already exists" });
    }

    res.status(500).json({
      error: "Internal server error",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

// AI Event Suggestions
app.post("/api/generate-ai-suggestions", async (req, res) => {
  try {
    const { currentEvents } = req.body;

    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `Generate 5 creative school event suggestions different from these: ${currentEvents.join(
              ", "
            )}.
          For each suggestion, provide a title and 1-2 sentence description in JSON format:
          [{"title": "...", "description": "..."}]`,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      },
      {
        headers: {
          Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const suggestions = JSON.parse(response.data.choices[0].message.content);
    res.json({ suggestions });
  } catch (err) {
    res.status(500).json({ error: "Failed to generate suggestions" });
  }
});

// User management
app.get("/api/users", authenticate, async (req, res) => {
  try {
    let query = { _id: { $ne: req.user._id } };

    if (req.query.role) {
      const roles = Array.isArray(req.query.role)
        ? req.query.role
        : [req.query.role];
      query.role = { $in: roles };
    }

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, "i");
      query.$or = [
        { fname: searchRegex },
        { lname: searchRegex },
        { email: searchRegex },
      ];
    }

    const projection =
      req.user.role === "admin"
        ? "fname lname email role profilePic subjects"
        : "fname lname email role profilePic";

    const users = await User.find(query)
      .select(projection)
      .sort({ role: 1, fname: 1 })
      .lean();

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/users", authenticate, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const { fname, lname, email, role, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const counter = await Counter.findOneAndUpdate(
      { name: "userNo" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const userNo = `U${counter.seq.toString().padStart(4, "0")}`;

    const newUser = new User({
      userNo,
      fname,
      lname,
      email,
      role,
      password,
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Scheduled jobs
schedule.scheduleJob("0 19 * * *", async () => {
  try {
    const today = new Date();
    const events = await Event.find({
      start: {
        $gte: new Date(today.setHours(0, 0, 0, 0)),
        $lte: new Date(today.setHours(23, 59, 59, 999)),
      },
    });

    const response = await axios.post(
      "http://localhost:5000/api/generate-parent-summary",
      {
        events,
        frequency: "daily",
      }
    );

    const summary = response.data.summary;
    io.emit("dailySummary", { content: summary });
  } catch (err) {
    console.error("Failed to send daily summary:", err);
  }
});

// File cleanup job (runs daily at 2am)
schedule.scheduleJob("0 2 * * *", async () => {
  try {
    const uploadDir = path.join(process.cwd(), "uploads");
    const now = new Date();
    const cutoff = new Date(now.setDate(now.getDate() - 30));

    const files = await fs.readdir(uploadDir);

    for (const file of files) {
      const filePath = path.join(uploadDir, file);
      const stats = await fs.stat(filePath);

      if (stats.mtime < cutoff) {
        await fs.unlink(filePath);
        console.log(`Deleted old file: ${file}`);

        await Message.updateMany(
          { fileUrl: `/uploads/${file}` },
          { $unset: { fileUrl: 1, fileType: 1 } }
        );
      }
    }
  } catch (err) {
    console.error("File cleanup error:", err);
  }
});


app.get("/api/guest-user", async (req, res) => {
  try {
    const guestUser = await User.findOne({ email: "guest@example.com" });
    res.json(guestUser);
  } catch (error) {
    res.status(500).json({ error: "Guest user not configured" });
  }
});

// Static files
app.use("/", router);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Database connection and server start
mongoose
  .connect(process.env.DB)
  .then(() => {
    console.log("MongoDB connected");
    server.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
      console.log(`Socket.IO connected on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => console.error("Database connection error:", err));
