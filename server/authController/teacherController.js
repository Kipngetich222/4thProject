// Import the Grades model
import Grades from '../models/exam_grades.js';
import Submissions from '../models/AssingnemtSubmition.js';
import User from "../models/user.js";

export const getGrades = async (req, res) => {
  try {
    const grades = await Grades.find({})
      .lean()
      .then(async (grades) => {
        return Promise.all(
          grades.map(async (grade) => {
            for (const subject of grade.subjects) {
              for (const gradeEntry of subject.grades) {
                // Fetch student name from Users collection
                const user = await User.findOne(
                  { userNo: gradeEntry.stdNo },
                  { fname: 1, lname: 1, _id: 0 }
                );
                //console.log(user);
                // Fetch student class & stream from Students collection
                const student = await Students.findOne(
                  { stdNo: gradeEntry.stdNo },
                  { class: 1, stream: 1, _id: 0 }
                );
                //console.log(student);
                // Assign values to gradeEntry
                gradeEntry.studentName = user
                  ? `${user.fname} ${user.lname}`
                  : "Unknown";
                gradeEntry.class = student?.class || "Unknown Class";
                gradeEntry.stream = student?.stream || "Unknown Stream";
              }
            }
            return grade;
           // console.log(grade);
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


//import Grades from "../models/gradesModel.js";

// export const updateStudentGrade = async (req, res) => {
//   //console.log(req.body);
//   try {
//     const { stdNo, subjectName, marks } = req.body;

//     // Find the grade entry
//     const grades = await Grades.findOne({stdNo});
//     console.log(grades);
//     if (!grades) return res.status(404).json({ error: "Grade record not found" });

//     // Find the subject
//     const subject = grade.subjects.find((subj) => subj.subjectName === subjectName);
//     if (!subject) return res.status(404).json({ error: "Subject not found" });

//     // Find the student within the subject
//     const studentGrade = subject.grades.find((entry) => entry.stdNo === stdNo);
//     if (!studentGrade) return res.status(404).json({ error: "Student not found in this subject" });

//     // Update marks
//     studentGrade.marks = marks;

//     // Save updated grades
//     await grade.save();
//     res.status(200).json({ message: "Grade updated successfully", grade });

//   } catch (error) {
//     console.error("Error updating grades:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

export const updateStudentGrade = async (req, res) => {
  try {
    const { stdNo, updates } = req.body; // `updates` should be an array of { subjectName, marks }

    if (!stdNo || !updates || !Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({ error: "Invalid request data. Provide stdNo and valid updates." });
    }

    // Find the grade record for the student
    const grades = await Grades.findOne({ "subjects.grades.stdNo": stdNo });

    if (!grades) {
      return res.status(404).json({ error: "Grade record not found" });
    }

    let updated = false;

    updates.forEach(({ subjectName, marks }) => {
      const subject = grades.subjects.find((subj) => subj.subjectName === subjectName);
      if (!subject) return; // Skip if subject doesn't exist

      const studentGrade = subject.grades.find((entry) => entry.stdNo === stdNo);
      if (!studentGrade) return; // Skip if student grade not found

      if (studentGrade.marks !== marks) { // Update only if marks changed
        studentGrade.marks = marks;
        updated = true;
      }
    });

    if (!updated) {
      return res.status(200).json({ message: "No changes detected. Grades remain the same." });
    }

    await grades.save();
    res.status(200).json({ message: "Grades updated successfully", grades });

  } catch (error) {
    console.error("❌ Error updating grades:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
