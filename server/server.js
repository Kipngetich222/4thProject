import express from "express";
import mongoose from "mongoose";
import cors from 'cors';
import dotenv from 'dotenv';
import http from "http";
import { WebSocketServer } from "ws";
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
import mammoth from 'mammoth';
import { extractTextFromFile } from './utils/fileProcessor.js';

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

// Configure multer for file uploads
// const upload = multer({ dest: "uploads/" }); // Temporary storage for uploaded files
// Configure file upload storage
// const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');  // Ensure 'uploads/' exists
    },
    filename: (req, file, cb) => {
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

app.get('/process-pdf', async (req, res) => {
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

// Create HTTP server
const server = http.createServer(app);

// Create WebSocket server
const wss = new WebSocketServer({ server });

// WebSocket connection handler
wss.on("connection", (ws) => {
  console.log("New client connected");

  // Send a welcome message to the client
  ws.send(JSON.stringify({ type: "message", content: "Welcome to the WebSocket server!" }));

  // Handle incoming messages from the client
  ws.on("message", (message) => {
    console.log(`Received: ${message}`);
  });

  // Handle client disconnection
  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

// Function to broadcast messages to all connected clients
export const broadcastMessage = (message) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
};

// Start server
mongoose.connect(process.env.DB)
  .then(() => {
    console.log("MongoDB connected");
    server.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
  })
  .catch((err) => console.error("Database connection error:", err));