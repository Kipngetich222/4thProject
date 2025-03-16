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


import Assignment from "../models/assignments.js"; // Import the Mongoose model
// export const AssignmentUpload = async (req, res) => {
//   try {
//     console.log("📩 Received request body:", req.body);
//     console.log("📂 Received file:", req.file);

//     // ✅ Check missing fields
//     if (!req.file || !req.body.title || !req.body.description) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     // ✅ Ensure `classes` is an array
//     let classesArray = req.body.classes;
//     if (!Array.isArray(classesArray)) {
//       classesArray = req.body.classes ? req.body.classes.split(",").map((cls) => cls.trim()) : [];
//     }

//     // ✅ Create and Save Assignment
//     const newAssignment = new Assignment({
//       title: req.body.title,
//       description: req.body.description,
//       due_date: req.body.due_date,
//       classes: classesArray, // Ensure it's always an array
//       subject: req.body.subject,
//       file_path: req.file.path, // Save file path
//     });

//     await newAssignment.save();
//     res.status(201).json({ message: "✅ Assignment uploaded successfully!", assignment: newAssignment });
//   } catch (error) {
//     console.error("❌ Error uploading assignment:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };


export const AssignmentUpload = async (req, res) => {
    try {
      console.log("📩 Received request body:", req.body);
      console.log("📂 Received file:", req.file);
  
      // ✅ Check missing fields
      if (!req.file || !req.body.title || !req.body.description) {
        return res.status(400).json({ error: "Missing required fields" });
      }
  
      // ✅ Ensure `classes` is an array
      let classesArray = req.body.classes;
      if (!Array.isArray(classesArray)) {
        classesArray = req.body.classes ? req.body.classes.split(",").map((cls) => cls.trim()) : [];
      }
  
      // ✅ Fix: Store relative file path
      const filePath = `/uploads/${req.file.filename}`;
  
      // ✅ Create and Save Assignment
      const newAssignment = new Assignment({
        title: req.body.title,
        description: req.body.description,
        due_date: req.body.due_date,
        classes: classesArray,
        subject: req.body.subject,
        file_path: filePath, // ✅ Save relative file path
      });
  
      await newAssignment.save();
      res.status(201).json({ message: "✅ Assignment uploaded successfully!", assignment: newAssignment });
    } catch (error) {
      console.error("❌ Error uploading assignment:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
// ✅ Get All Assignments
// export const AssignmentLoad = async (req, res) => {
//   try {
//     const assignments = await Assignment.find();
//     res.status(200).json(assignments);
//   } catch (error) {
//     console.error("❌ Error fetching assignments:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };


export const AssignmentLoad = async (req, res) => {
    try {
      const assignments = await Assignment.find();
  
      // ✅ Append `http://localhost:5000` to file paths
      const updatedAssignments = assignments.map((assignment) => ({
        ...assignment._doc,
        file_url: `http://localhost:5000${assignment.file_path}`,
      }));
  
      res.status(200).json(updatedAssignments);
    } catch (error) {
      console.error("❌ Error fetching assignments:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
