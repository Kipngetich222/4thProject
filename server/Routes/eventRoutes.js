// routes/eventRoutes.js
import express from "express";
// import { Router } from "express";
import Event from "../models/event.js";
// import { broadcastMessage } from "../server.js";
// In eventRoutes.js
import { io } from "../server.js";

const router = express.Router();

// Get all events
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ start: 1 });
    res.status(200).json({
      success: true,
      data: events
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ 
      success: false,
      error: "Failed to fetch events" 
    });
  }
});

// Add a new event
router.post("/", async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    
    // Broadcast new event to all connected clients
    io.emit("newEvent", event);
    
    res.status(201).json({
      success: true,
      data: event,
      message: "Event created successfully"
    });
  } catch (err) {
    console.error("Error creating event:", err);
    res.status(400).json({ 
      success: false,
      error: err.message 
    });
  }
});

// Delete an event
router.delete("/:id", async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ 
        success: false,
        error: "Event not found" 
      });
    }
    
    // Broadcast event deletion
    io.emit("eventDeleted", event._id);
    
    res.status(200).json({ 
      success: true,
      message: "Event deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ 
      success: false,
      error: "Failed to delete event" 
    });
  }
});

export default router;