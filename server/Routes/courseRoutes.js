import express from "express";
import Course from "../models/course.js";
import authenticateJWT from "../middleware/authenticateJWT.js";

const router = express.Router();

// Create a new course
router.post("/create", authenticateJWT, async (req, res) => {
  try {
    const { courseName, description } = req.body;
    const newCourse = new Course({
      courseName,
      description,
      teacher: req.user.userId, // Teacher ID from JWT
    });
    await newCourse.save();
    res.status(201).json({ success: "Course created successfully", course: newCourse });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while creating the course" });
  }
});

// Update a course
router.put("/update/:id", authenticateJWT, async (req, res) => {
  try {
    const { courseName, description } = req.body;
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { courseName, description, updatedAt: Date.now() },
      { new: true }
    );
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.status(200).json({ success: "Course updated successfully", course });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while updating the course" });
  }
});

// Delete a course
router.delete("/delete/:id", authenticateJWT, async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.status(200).json({ success: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while deleting the course" });
  }
});

// Get all courses for a teacher
router.get("/my-courses", authenticateJWT, async (req, res) => {
  try {
    const courses = await Course.find({ teacher: req.user.userId });
    res.status(200).json({ courses });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching courses" });
  }
});

export default router;