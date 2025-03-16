import express from "express";
import Grade from "../models/grade.js";
import authenticateJWT from "../middleware/authenticateJWT.js";

const router = express.Router();

// Grade an assignment
router.post("/create", authenticateJWT, async (req, res) => {
  try {
    const { assignmentId, studentId, grade, feedback } = req.body;
    const newGrade = new Grade({
      assignment: assignmentId,
      student: studentId,
      grade,
      feedback,
    });
    await newGrade.save();
    res.status(201).json({ success: "Grade submitted successfully", grade: newGrade });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while submitting the grade" });
  }
});

// Get grades for an assignment
router.get("/assignment/:assignmentId", authenticateJWT, async (req, res) => {
  try {
    const grades = await Grade.find({ assignment: req.params.assignmentId }).populate("student");
    res.status(200).json({ grades });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching grades" });
  }
});

export default router;