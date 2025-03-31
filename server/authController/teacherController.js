// Import the Grades model
import Grades from '../models/exam_grades.js';
import Submissions from '../models/AssingnemtSubmition.js';
import User from "../models/user.js";

// export const getGrades = async (req, res) => {
//   try {
//     // Fetch all grades from the database
//     const grades = await Grades.find({});
//     res.status(200).json(grades); // Return the grades as JSON
//   } catch (error) {
//     console.error("Error fetching grades:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

export const getGrades = async (req, res) => {
  try {
    // Fetch grades and populate student details from the User schema
    const grades = await Grades.find({})
      .lean() // Converts Mongoose documents to plain objects
      .then(async (grades) => {
        return Promise.all(
          grades.map(async (grade) => {
            for (const subject of grade.subjects) {
              for (const gradeEntry of subject.grades) {
                const student = await User.findOne(
                  { userNo: gradeEntry.stdNo },
                  { fname: 1, lname: 1, _id: 0 }
                );

                if (student) {
                  gradeEntry.studentName = `${student.fname} ${student.lname}`;
                } else {
                  gradeEntry.studentName = "Unknown"; // Handle missing users
                }
              }
            }
            return grade;
          })
        );
      });

    res.status(200).json(grades);
  } catch (error) {
    console.error("Error fetching grades:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


import Assignment from "../models/assignments.js"; // Import the Mongoose model


export const AssignmentUpload = async (req, res) => {
    try {
  
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
  
import Attendance from "../models/attendance.js";
import Students from "../models/students.js";

// ✅ Fetch students in a class
export const getStudentsByClass = async (req, res) => {
  try {
    const students = await Student.find({ classId: req.params.classId });
    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Submit attendance
export const markAttendance = async (req, res) => {
  try {
    const { classId, records } = req.body;

    const attendanceRecords = records.map((record) => ({
      classId,
      studentId: record.studentId,
      status: record.status,
      date: new Date(),
    }));

    await Attendance.insertMany(attendanceRecords);
    res.status(201).json({ message: "Attendance recorded successfully!" });
  } catch (error) {
    console.error("Error submitting attendance:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const markSubmission = async (req, res) => {
    try {
        const { submissionId } = req.params;
        const { marks, teacherRemarks } = req.body;

        // Validate input
        if (!marks || isNaN(marks) || marks < 0 || marks > 100) {
            return res.status(400).json({ error: "Marks must be between 0 and 100." });
        }

        // Find submission and update with marks & remarks
        const updatedSubmission = await Submissions.findByIdAndUpdate(
            submissionId,
            { marks, teacherRemarks },
            { new: true }
        );

        if (!updatedSubmission) {
            return res.status(404).json({ error: "Submission not found." });
        }

        res.status(200).json({ success: "Marks awarded successfully!", updatedSubmission });
    } catch (error) {
        console.error("Error marking submission:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



export const fetchSubmission = async (req, res) => {
  try {
      const { submissionId } = req.params; // ✅ Correct parameter
      const submission = await Submissions.findById(submissionId).populate("studentId assignmentId");

      if (!submission) {
          return res.status(404).json({ error: "Submission not found." });
      }

      res.status(200).json(submission);
  } catch (error) {
      console.error("Error fetching submission:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
};


