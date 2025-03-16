import express from "express";
import Assignment from "../models/assignment.js";
import authenticateJWT from "../middleware/authenticateJWT.js";

const router = express.Router();

// Create a new assignment
router.post("/create", authenticateJWT, async (req, res) => {
  try {
    const { title, description, dueDate, courseId } = req.body;
    const newAssignment = new Assignment({
      title,
      description,
      dueDate,
      course: courseId,
      teacher: req.user.userId, // Teacher ID from JWT
    });
    await newAssignment.save();
    res.status(201).json({ success: "Assignment created successfully", assignment: newAssignment });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while creating the assignment" });
  }
});

// Get all assignments for a course
router.get("/course/:courseId", authenticateJWT, async (req, res) => {
  try {
    const assignments = await Assignment.find({ course: req.params.courseId });
    res.status(200).json({ assignments });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching assignments" });
  }
});

export default router;