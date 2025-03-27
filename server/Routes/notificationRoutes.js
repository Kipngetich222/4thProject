import express from "express";
import Notification from "../models/notification.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// Get user notifications
// router.get("/", authenticate, async (req, res) => {
//   try {
//     const notifications = await Notification.find({
//       recipient: req.user._id,
//     })
//       .sort({ createdAt: -1 })
//       .limit(20)
//       .populate("sender", "fname lname profilePic")
//       .populate("chat");

//     res.status(200).json(notifications);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

router.get("/", authenticate, async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipient: req.user._id,
      isRead: false,
    });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark notification as read
router.patch("/:id/read", authenticate, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
        recipient: req.user._id,
      },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.status(200).json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark all notifications as read
router.patch("/read-all", authenticate, async (req, res) => {
  try {
    await Notification.updateMany(
      {
        recipient: req.user._id,
        isRead: false,
      },
      { isRead: true }
    );

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
