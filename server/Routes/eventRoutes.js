// routes/eventRoutes.js
import express from "express";
import Event from "../models/event.js";
// import { sendNotification } from "../../src/services/notificationService.js";
import { broadcastMessage } from "../server.js";

const router = express.Router();

// Add a new event
router.post("/events", async (req, res) => {
  const { title, start, end, description } = req.body;
  try {
    const newEvent = await Event.create({ title, start, end, description });
    // Send notification to parents
    await sendNotification(`New event added: ${title}`);

    // Broadcast the new event to all connected clients
    broadcastMessage({
        type: "newEvent",
        content: `New event added: ${title}`,
      });
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ error: "Failed to add event" });
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