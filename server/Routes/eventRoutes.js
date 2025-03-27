// routes/eventRoutes.js
import express from "express";
// import { Router } from "express";
import Event from "../models/event.js";
// import { broadcastMessage } from "../server.js";
// In eventRoutes.js
import { io } from "../server.js";

const router = express.Router();

// Add a new event
router.post("/", async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    io.emit({ type: "newEvent", event });
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all events
router.get("/events", async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// Delete an event
router.delete("/events/:id", async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete event" });
  }
});

export default router;