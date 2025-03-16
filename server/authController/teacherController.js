// Import the Grades model
import Grades from '../models/exam_grades.js';

export const getGrades = async (req, res) => {
  try {
    // Fetch all grades from the database
    const grades = await Grades.find({});
    res.status(200).json(grades); // Return the grades as JSON
  } catch (error) {
    console.error("Error fetching grades:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


import express from "express";
import Assignment from "../models/assignments.js"; // Import the Mongoose model

const router = express.Router();

// Route to handle assignment data submission
export const AssignmentUpload =  async (req, res) => {
    console.log(req.body);
    try {
        // Extract assignment data from the request body
        const {title, description, due_date, classes, subject } = req.body;

        // Validate required fields (you can customize this validation further)
        if (!title || !description || !due_date || !classes || !subject) {
            return res.status(400).json({ error: "Assignment ID, title, and description are required." });
        }

        // Check for duplicate assignment_id
        const existingAssignment = await Assignment.findOne({ assignment_id });
        if (existingAssignment) {
            return res.status(409).json({ error: "An assignment with this ID already exists." });
        }

        // Create a new assignment document
        const newAssignment = new Assignment({
            assignment_id,
            title,
            description,
            due_date, // Ensure the frontend sends the date in ISO format
            classes,
            subject,
        });

        // Save the assignment to the database
        const savedAssignment = await newAssignment.save();

        // Respond with the saved assignment
        res.status(201).json({
            message: "Assignment saved successfully!",
            assignment: savedAssignment,
        });
    } catch (error) {
        console.error("Error saving assignment:", error);
        res.status(500).json({ error: "An internal server error occurred." });
    }
};

