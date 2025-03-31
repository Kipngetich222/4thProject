import express from "express";
import TeacherAssignments from "../models/TeacherAssingment.js";
import Teachers from "../models/teachers.js";
import Classes from "../models/Classes.js";
import Session from "../models/Session.js";
import User from "../models/user.js";

const router = express.Router();

// Assign subjects and classes to a teacher
export const asignTeacher = async (req, res) => {
  try {
    const { teacherId, subjects } = req.body;

    if (!teacherId || !subjects || subjects.length === 0) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Get the latest academic session
    const currentSession = await Session.findOne().sort({ startDate: -1 });
    if (!currentSession) {
      return res.status(404).json({ message: "No active session found" });
    }

    const { academicYear, term } = currentSession;

    // Check if the teacher exists
    const teacher = await Teachers.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Check if classes exist
    for (const subject of subjects) {
      for (const classId of subject.classes) {
        const classExists = await Classes.findById(classId);
        if (!classExists) {
          return res.status(404).json({ message: `Class with ID ${classId} not found` });
        }
      }
    }

    // Save the assignment
    const newAssignment = new TeacherAssignments({
      teacher: teacherId,
      subjects,
      academicYear,
      term,
    });

    await newAssignment.save();

    res.status(201).json({ message: "Teacher assigned successfully!", assignment: newAssignment });
  } catch (error) {
    console.error("Error assigning teacher:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



export const getTeachers = async (req, res) => {
  try {
    const teachersList = await Teachers.aggregate([
      {
        $lookup: {
          from: "users", // Collection name in MongoDB
          localField: "userNo",
          foreignField: "userNo",
          as: "userDetails"
        }
      },
      {
        $unwind: "$userDetails" // Flatten the user details array
      },
      {
        $project: {
          _id: 0, // Hide _id if not needed
          userNo: 1,
          fullName: { $concat: ["$userDetails.fname", " ", "$userDetails.lname"] },
          subjects: 1,
          department: 1
        }
      }
    ]);

    console.log("Fetched teachers:", teachersList);
    res.json({ teachersList });
  } catch (error) {
    console.log("Error fetching teachers:", error);
    res.status(500).json({ error: "An error occurred while fetching teachers" });
  }
};

export const getClasses = async(req, res) => {
  try{
    const classes = await Classes.find();
    return res.status(200).json({classes});
    console.log(classes)
  } catch(error){
    console.error(error);
      return res.status(500).json({error : 'Internal server error'})
  }
}
