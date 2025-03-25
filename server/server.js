import express from "express";
import mongoose from "mongoose";
import cors from 'cors';
import dotenv from 'dotenv';
import http from "http";
import { initializeWebSocket, broadcastEvent, configureAI, cleanupWebSocket } from "./utils/websocket.js";
import router from "./Routes/router.js";
import courseRoutes from "./Routes/courseRoutes.js";
import assignmentRoutes from "./Routes/assignmentRoutes.js";
import gradeRoutes from "./Routes/gradeRoutes.js";
import eventRoutes from "./Routes/eventRoutes.js";
import axios from "axios"; // Import axios for making API requests
import WebSocket from "ws"; // Import WebSocket
import multer from "multer"; // Import multer for file uploads
import { readFile } from 'fs/promises';
import fs from 'fs/promises';
import path from 'path';
import pdfParse from 'pdf-parse';
import schedule from 'node-schedule';
import { extractTextFromFile } from './utils/fileProcessor.js';

import Event from './models/event.js'; // Import the Event model

dotenv.config();
const app = express();

// const upload = multer({ dest: 'uploads/' });

// Middleware to parse JSON request body
app.use(express.json());

// Enable CORS
app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from this origin
    credentials: true,
  })
);

// Create HTTP server
const server = http.createServer(app);
initializeWebSocket(server);


// Configure AI if credentials exist
if (process.env.DEEPSEEK_API_URL && process.env.DEEPSEEK_API_KEY) {
  configureAI(process.env.DEEPSEEK_API_URL, process.env.DEEPSEEK_API_KEY);
} else {
  console.log('AI features disabled - missing API configuration');
}

// Graceful shutdown
process.on('SIGTERM', () => {
  cleanupWebSocket();
  server.close();
});

// Configure multer for file uploads
// const upload = multer({ dest: "uploads/" }); // Temporary storage for uploaded files
// Configure file upload storage
// const multer = require('multer');
const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads/');  // Ensure 'uploads/' exists
    },
    filename: (_, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

// Mount routes
app.use("/api/course", courseRoutes);
app.use("/api/assignment", assignmentRoutes);
app.use("/api/grade", gradeRoutes);
app.use("/api", eventRoutes);
app.use("/", router);

// DeepSeek R1 API endpoint and API key
const DEEPSEEK_API_URL = "https://openrouter.ai/api/v1/chat/completions"; // Correct OpenRouter endpoint
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY; // Use environment variable for the API key
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY; // YouTube API key
const NEWS_API_KEY = process.env.NEWS_API_KEY; // NewsAPI key

// Generate lesson plan endpoint
app.post("/api/generate-lesson-plan", async (req, res) => {
  const { topic } = req.body;

  try {
    // Prepare the prompt for DeepSeek R1
    const prompt = `Generate a detailed lesson plan for the topic: ${topic}. The lesson plan should include the following sections:

1. **Objective**: What will students learn by the end of the lesson?
2. **Introduction**: Briefly explain the topic and its importance.
3. **Main Activity**: Describe a hands-on or interactive activity to help students understand the topic. Include materials and steps.
4. **Conclusion**: Summarize the key points and discuss real-world applications.
5. **Homework Assignment**: Provide a task for students to reinforce their understanding.

Write the lesson plan in a professional and educational tone, suitable for high school students.`;

    // Call the OpenRouter API
    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        model: "openai/gpt-3.5-turbo", // Use a valid model name
        messages: [{ role: "user", content: prompt }],
        max_tokens: 600, // Adjust based on the desired length
        temperature: 0.6, // Lower temperature for more focused output
      },
      {
        headers: {
          Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5173", // Required by OpenRouter
          "X-Title": "Your App Name", // Optional but recommended
        },
      }
    );

    // Log the entire response for debugging
    console.log("OpenRouter API Response:", response.data);

    // Extract the generated lesson plan
    const lessonPlan = response.data.choices[0].message.content;
    res.status(200).json({ lessonPlan });
  } catch (error) {
    console.error("Error generating lesson plan:", error);
    res.status(500).json({ error: "Failed to generate lesson plan" });
  }
});



// Update the generate-questions endpoint
/**
 * Extract text from the uploaded file based on its mimetype.
 * Supports text, PDF, and Word documents.
 */


// Endpoint to generate dynamic questions based on uploaded file
app.post('/api/generate-questions', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    // Extract text from the uploaded file
    const text = await extractTextFromFile(req.file.path, req.file.mimetype);

    // Build a dynamic prompt instructing the AI to generate questions
    const prompt = `
Analyze the following document and generate exactly 5 dynamic multiple-choice questions that reflect its content. 
Each question must have 4 answer options labeled A), B), C), and D). Provide the correct answer in the format:
Answer: <choice letter>

Document Name: ${req.file.originalname}

Document Content:
${text}
    `;

    // Call DeepSeek (or OpenRouter) API
    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        model: 'openai/gpt-3.5-turbo',
        messages: [{
          role: 'user',
          content: prompt
        }],
        max_tokens: 1200,
        temperature: 0.3
      },
      {
        headers: {
          Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:5173'
        },
        timeout: 30000
      }
    );

    // Validate response structure
    if (!response.data?.choices?.[0]?.message?.content) {
      throw new Error('AI response missing expected content');
    }
    const content = response.data.choices[0].message.content;

    // Parse the questions
    const questionBlocks = content
      .split(/\n\s*\n/)
      .filter(block =>
        block.trim().startsWith('Q') &&
        block.includes('Answer:')
      );

    if (questionBlocks.length < 1) {
      throw new Error('No properly formatted questions found in response');
    }

    // Clean up the uploaded file (async)
    try {
      await fs.unlink(req.file.path);
    } catch (unlinkError) {
      console.error('File deletion error:', unlinkError);
      // Continue even if deletion fails
    }

    res.json({
      success: true,
      questions: questionBlocks,
      rawResponse: content
    });

  } catch (error) {
    console.error('Question generation failed:', {
      error: error.message,
      stack: error.stack,
      response: error.response?.data
    });

    // Attempt to clean up file even in error case
    try {
      if (req.file?.path) {
        await fs.unlink(req.file.path);
      }
    } catch (cleanupError) {
      console.error('Cleanup failed:', cleanupError);
    }

    res.status(500).json({
      error: 'Failed to generate questions',
      details: error.message,
      solution: 'Please try again with a different file or contact support'
    });
  }
});

app.get('/process-pdf', async (_, res) => {
  try {
    const uploadDir = path.join(__dirname, 'uploads');
    
    // Check if upload directory exists
    try {
      await fs.access(uploadDir);
    } catch (err) {
      return res.status(404).send('Uploads directory not found');
    }

    // Get the first uploaded file
    const files = await fs.readdir(uploadDir);
    if (files.length === 0) {
      return res.status(404).send('No PDF files found.');
    }

    const filePath = path.join(uploadDir, files[0]);
    
    // Check if file exists
    try {
      await fs.access(filePath);
    } catch (err) {
      return res.status(404).send('PDF file not found');
    }

    // Read and process the PDF
    const dataBuffer = await readFile(filePath);
    const data = await pdfParse(dataBuffer);
    
    // Delete the file after processing
    try {
      await fs.unlink(filePath);
    } catch (err) {
      console.error('Error deleting file:', err);
      // Continue even if deletion fails
    }

    res.send(data.text);
  } catch (err) {
    console.error('PDF processing error:', err);
    res.status(500).send('Error processing PDF: ' + err.message);
  }
});



// Endpoint for content recommendations
app.post("/api/search-content", async (req, res) => {
  const { query } = req.body;

  try {
    // Fetch YouTube videos
    const youtubeResponse = await axios.get(
      `https://www.googleapis.com/youtube/v3/search`,
      {
        params: {
          part: "snippet",
          q: query,
          type: "video",
          maxResults: 5,
          key: YOUTUBE_API_KEY,
        },
      }
    );

    // Fetch articles from NewsAPI
    const newsResponse = await axios.get(
      `https://newsapi.org/v2/everything`,
      {
        params: {
          q: query,
          pageSize: 5,
          apiKey: NEWS_API_KEY,
        },
      }
    );

    // Combine results
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



// // Create WebSocket server
// const wss = new WebSocketServer({ server });

// // WebSocket connection handler
// // In server.js, modify the WebSocket handler:
// wss.on("connection", (ws) => {
//   console.log("New client connected");
  
//   ws.on("message", (message) => {
//     try {
//       const { type, data } = JSON.parse(message);
      
//       if (type === "subscribe") {
//         // Store user subscription info
//         ws.userType = data.userType;
//         ws.userId = data.userId;
//       }
//     } catch (err) {
//       console.error("Error parsing WebSocket message:", err);
//     }
//   });

//   ws.on("close", () => {
//     console.log("Client disconnected");
//   });
// });


// Schedule daily summary at 7pm
schedule.scheduleJob('0 19 * * *', async () => {
  try {
    const events = await Event.find({
      start: { 
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        $lte: new Date(new Date().setHours(23, 59, 59, 999))
      }
    });
    
    const response = await axios.post("http://localhost:5000/api/generate-parent-summary", {
      events,
      frequency: "daily"
    });
    
    const summary = response.data.summary;
    
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN && client.userType === "parent") {
        client.send(JSON.stringify({
          type: "dailySummary",
          content: summary
        }));
      }
    });
  } catch (err) {
    console.error("Failed to send daily summary:", err);
  }
});


// Update the event creation endpoint with better validation and error handling
// app.post("/api/events", async (req, res) => {
//   let newEvent;
//   try {
//     const { title, description, start, end } = req.body;

//     // 1. Enhanced Validation
//     if (!title?.trim()) {
//       return res.status(400).json({ error: "Event title is required" });
//     }
//     if (!start || !end) {
//       return res.status(400).json({ error: "Both start and end times are required" });
//     }

//     // 2. Date Validation with Timezone Handling
//     const startDate = new Date(start);
//     const endDate = new Date(end);
    
//     if (isNaN(startDate.getTime())) {
//       return res.status(400).json({ error: "Invalid start date format. Use ISO format (YYYY-MM-DDTHH:MM:SS)" });
//     }
//     if (isNaN(endDate.getTime())) {
//       return res.status(400).json({ error: "Invalid end date format. Use ISO format (YYYY-MM-DDTHH:MM:SS)" });
//     }
//     if (startDate >= endDate) {
//       return res.status(400).json({ error: "End time must be after start time" });
//     }
//     if (startDate < new Date()) {
//       return res.status(400).json({ error: "Start time cannot be in the past" });
//     }

//     // 3. Event Data Preparation
//     const eventData = {
//       title: title.trim(),
//       description: description?.trim() || "",
//       start: new Date(start),
//       end: new Date(end),
//       createdBy: req.user?._id || "system" // Now accepts strings
//     };

//     // Create and save
//     newEvent = new Event(eventData);
//     await newEvent.save();

//     // 4. AI Summary Generation (with timeout)
//     try {
//       const summaryResponse = await axios.post(
//         DEEPSEEK_API_URL,
//         {
//           model: "openai/gpt-3.5-turbo",
//           messages: [{
//             role: "system",
//             content: `Create a 1-sentence summary (max 15 words) for a school event:
//             Title: ${eventData.title}
//             Description: ${eventData.description || "None"}`
//           }],
//           temperature: 0.3,
//           max_tokens: 30
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
//             "Content-Type": "application/json"
//           },
//           timeout: 3000 // 3-second timeout
//         }
//       );
//       eventData.aiSummary = summaryResponse.data.choices[0].message.content.trim();
//     } catch (aiError) {
//       console.error("AI summary generation failed:", aiError);
//       // Fallback summary
//       eventData.aiSummary = `${eventData.title}: ${eventData.description.substring(0, 50)}${eventData.description.length > 50 ? '...' : ''}`;
//     }

//     // 5. Database Operation
// try {
//   const newEvent = new Event(eventData);
//   await newEvent.save(); // Alternative to Event.create()
  
//   // Broadcast to all parents
//   broadcastEvent(newEvent);

//   res.status(201).json({
//     success: true,
//     data: newEvent,
//     message: "Event created successfully"
//   });
// } catch (dbError) {
//   console.error("Database operation failed:", dbError);
//   res.status(500).json({ 
//     error: "Failed to save event to database",
//     details: dbError.message
//   });
// }
    
//     // 6. Broadcast with Error Handling
//     try {
//       await broadcastEvent(newEvent);
//     } catch (broadcastError) {
//       console.error("Broadcast failed:", broadcastError);
//       // Don't fail the request, just log the error
//     }

//     // 7. Response with Additional Headers
//     res.setHeader('Location', `/api/events/${newEvent._id}`);
//     res.status(201).json({
//       success: true,
//       data: newEvent,
//       message: "Event created successfully"
//     });

//   } catch (err) {
//     console.error("Event creation error:", err);
    
//     // Handle Mongoose validation errors specifically
//     if (err.name === 'ValidationError') {
//       const errors = Object.values(err.errors).map(e => e.message);
//       return res.status(400).json({ 
//         error: "Validation failed",
//         details: errors 
//       });
//     }
    
//     // Handle duplicate key errors
//     if (err.code === 11000) {
//       return res.status(400).json({ 
//         error: "Event with similar details already exists" 
//       });
//     }
    
//     res.status(500).json({ 
//       error: "Internal server error",
//       details: process.env.NODE_ENV === 'development' ? err.message : undefined
//     });
//   }
// });

app.post("/api/events", async (req, res) => {
  try {
    const { title, description, start, end } = req.body;

    // 1. Enhanced Validation
    if (!title?.trim()) {
      return res.status(400).json({ error: "Event title is required" });
    }
    if (!start || !end) {
      return res.status(400).json({ error: "Both start and end times are required" });
    }

    // 2. Date Validation with Timezone Handling
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    if (isNaN(startDate.getTime())) {
      return res.status(400).json({ error: "Invalid start date format. Use ISO format (YYYY-MM-DDTHH:MM:SS)" });
    }
    if (isNaN(endDate.getTime())) {
      return res.status(400).json({ error: "Invalid end date format. Use ISO format (YYYY-MM-DDTHH:MM:SS)" });
    }
    if (startDate >= endDate) {
      return res.status(400).json({ error: "End time must be after start time" });
    }
    if (startDate < new Date()) {
      return res.status(400).json({ error: "Start time cannot be in the past" });
    }

    // 3. Event Data Preparation
    const eventData = {
      title: title.trim(),
      description: description?.trim() || "",
      start: startDate,
      end: endDate,
      createdBy: req.user?._id || "system" // Now accepts strings
    };

    // 4. Database Operation
    const newEvent = await Event.create(eventData);
    
    // 5. Broadcast with Error Handling
    try {
      broadcastEvent(newEvent);
    } catch (broadcastError) {
      console.error("Broadcast failed:", broadcastError);
      // Continue even if broadcast fails
    }

    // 6. Response
    return res.status(201).json({
      success: true,
      data: newEvent,
      message: "Event created successfully"
    });

  } catch (err) {
    console.error("Event creation error:", err);
    
    // Handle specific error types
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ 
        error: "Validation failed",
        details: errors 
      });
    }
    
    if (err.code === 11000) {
      return res.status(400).json({ 
        error: "Event with similar details already exists" 
      });
    }
    
    return res.status(500).json({ 
      error: "Internal server error",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Add these new endpoints to server.js

// AI Event Suggestions Endpoint
app.post("/api/generate-ai-suggestions", async (req, res) => {
  try {
    const { currentEvents } = req.body;
    
    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        model: "openai/gpt-3.5-turbo",
        messages: [{
          role: "system",
          content: `Generate 5 creative school event suggestions different from these: ${currentEvents.join(", ")}. 
          For each suggestion, provide a title and 1-2 sentence description in JSON format like:
          [{"title": "...", "description": "..."}]`
        }],
        temperature: 0.7,
        max_tokens: 500
      },
      {
        headers: {
          Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const content = response.data.choices[0].message.content;
    const suggestions = JSON.parse(content);
    res.json({ suggestions });
  } catch (err) {
    res.status(500).json({ error: "Failed to generate suggestions" });
  }
});

// Notification Importance Assessment Endpoint
app.post("/api/assess-notification", async (req, res) => {
  try {
    const { content, settings } = req.body;
    
    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        model: "openai/gpt-3.5-turbo",
        messages: [{
          role: "system",
          content: `Analyze this school notification and determine if it's important enough to show as an alert (not just in notifications list).
          Consider these user settings: Daily Summary ${settings.dailySummary ? "ON" : "OFF"}, 
          Event Reminders ${settings.eventReminders ? "ON" : "OFF"}.
          Notification: "${content}".
          Respond with JSON: {"isImportant": boolean, "message": string}`
        }],
        temperature: 0.3,
        max_tokens: 100
      },
      {
        headers: {
          Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const assessment = JSON.parse(response.data.choices[0].message.content);
    res.json(assessment);
  } catch (err) {
    res.status(500).json({ 
      isImportant: false,
      message: "Error assessing notification importance"
    });
  }
});

// Daily/Weekly Summary Endpoint
app.post("/api/generate-parent-summary", async (req, res) => {
  try {
    const { events, frequency } = req.body; // 'daily' or 'weekly'
    
    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        model: "openai/gpt-3.5-turbo",
        messages: [{
          role: "system",
          content: `Create a ${frequency} parent summary for these school events: ${events.map(e => e.title).join(", ")}.
          Include key dates, important reminders, and a friendly tone.
          Keep it under 200 words.`
        }],
        temperature: 0.5,
        max_tokens: 300
      },
      {
        headers: {
          Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({ summary: response.data.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: "Failed to generate summary" });
  }
});

// Start server
mongoose.connect(process.env.DB)
  .then(() => {
    console.log("MongoDB connected");
    server.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
  })
  .catch((err) => console.error("Database connection error:", err));