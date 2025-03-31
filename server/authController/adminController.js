import User from "../models/user.js";
import ClassTeachers from "../models/classTeachers.js";
import Teacher from "../models/teachers.js";
import toast from "react-hot-toast";
import Students from "../models/students.js";
import Parent from "../models/parents.js";
import Session from "../models/session.js";
import Grades from "../models/exam_grades.js";
import Exams from "../models/Exams.js";
import Classes from "../models/Classes.js";


export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password",);
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}


export const fetchClassTeachers = async (req, res) => {
  try {
    const classTeachers = await ClassTeachers.find({}).populate("userNo", "userNo name"); // Fetch userNo and name
    res.status(200).json(classTeachers);
  } catch (error) {
    console.error("Error fetching class teachers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}




export const addTeachers = async (req, res) => {
  try {

    const { userNo, department, subjects, contactNo } = req.body;
    if (!userNo) {
      return res.json({ error: "userNo required" });
    } if (!department) {
      return res.json({ error: "Department required" });
    } if (!subjects) {
      return res.json("Subjects required");
    } if (!contactNo) {
      return res.json({ error: "Contact number required" });
    }

    // Find the user by userNo to get the corresponding ObjectId (_id)
    const user = await User.findOne({ userNo }); // Assuming userNo is a field in the Users schema
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Check if the teacher already exists
    const existingTeacher = await Teacher.findOne({ userNo: user._id });
    if (existingTeacher) {
      return res.status(400).json({ error: "Teacher already exists." });
    }

    // Create a new teacher
    const newTeacher = new Teacher({
      userNo, // Use the ObjectId from the Users collection
      department,
      subjects,
      contactNo,
    });

    await newTeacher.save(); // Save the teacher to the database
    res.status(201).json({ message: "Teacher added successfully!" });
  } catch (error) {
    console.error("Error adding teacher:", error);
    res.status(500).json({ error: "Failed to add teacher." });
  }
};

export const AddStudents = async (req, res) => {
  console.log("Incoming request body:", req.body);
  try {
    const { userNo, stdClass, stream, subjects } = req.body;

    // ✅ Validate required fields
    if (!userNo) {
      console.log("❌ Error: User number is required.");
      return res.status(400).json({ error: "User number is required." });
    }
    if (!stdClass) {
      console.log("❌ Error: Student class is required.");
      return res.status(400).json({ error: "Student class is required." });
    }
    if (!stream) {
      console.log("❌ Error: Stream is required.");
      return res.status(400).json({ error: "Stream is required." });
    }
    if (!subjects || !Array.isArray(subjects)) {
      console.log("❌ Error: Subjects must be provided as an array.");
      return res.status(400).json({ error: "Subjects are required and must be an array." });
    }

    // ✅ Check if student details already exist
    const existingDetails = await Students.findOne({ userNo });
    if (existingDetails) {
      console.log("⚠️ User already exists:", userNo);
      return res.status(409).json({ error: "Details for this user number already exist." });
    }

    // ✅ Create and save new student details
    const newStudentDetails = new Students({
      stdNo: userNo,
      class: stdClass,
      stream,
      subjects
    });

    const savedDetails = await newStudentDetails.save();

    console.log("✅ Student details saved:", savedDetails);

    // ✅ Success response
    return res.status(201).json({
      success: "Student details added successfully.",
      studentDetails: savedDetails
    });
  } catch (error) {
    console.error("❌ Error saving student details:", error);
    return res.status(500).json({ error: "An internal server error occurred." });
  }
};


export const createExam = async (req, res) => {
  try {
    const { exam, classes } = req.body;

    if (!exam) {
      return res.status(400).json({ message: "Exam name is required" });
    }
    if (!classes || classes.length === 0) {
      return res.status(400).json({ message: "At least one class must be selected" });
    }

    // Fetch the latest session
    const currentSession = await Session.findOne().sort({ createdAt: -1 });

    if (!currentSession) {
      return res.status(404).json({ message: "No active session found." });
    }

    const { academicYear, term } = currentSession;

    // Check if the exam already exists for this session
    const existingExam = await Exams.findOne({ exam, academicYear, term });
    if (existingExam) {
      return res.status(400).json({ message: "This exam already exists for the current session." });
    }

    // Save the exam in the Exams table
    const newExam = new Exams({
      exam,
      academicYear,
      term,
      classes,
    });
    await newExam.save();

    // Fetch students from selected classes
    const students = await Students.find({ class: { $in: classes } });

    if (students.length === 0) {
      return res.status(404).json({ message: "No students found in the selected classes." });
    }

    // Subjects with initial null marks for all students
    const subjects = [
      { subjectName: "Mathematics", grades: students.map(student => ({ stdNo: student.stdNo, marks: null })) },
      { subjectName: "English", grades: students.map(student => ({ stdNo: student.stdNo, marks: null })) },
      { subjectName: "Science", grades: students.map(student => ({ stdNo: student.stdNo, marks: null })) }
    ];

    // Save student grades in the Grades table
    const newGrades = new Grades({
      academicYear,
      term,
      exam,
      classes,
      subjects,
    });
    await newGrades.save();

    res.status(201).json({ message: "Exam created successfully!", exam: newExam, grades: newGrades });
  } catch (error) {
    console.error("Error creating exam:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};




//import Session from "../models/Session.js";

// ✅ Create a new academic session

export const CreateSession = async (req, res) => {
  try {
    const { academicYear, term, startDate, endDate } = req.body;

    if (!academicYear || !term || !startDate || !endDate) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newSession = new Session({
      academicYear,
      term,
      startDate,
      endDate,
    });

    await newSession.save();
    res.status(201).json({ message: "Session created successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};


// ✅ Get all academic sessions
export const getSessions = async (req, res) => {
  try {
    const sessions = await Session.find();
    res.json(sessions);
  } catch (error) {
    console.error("Error fetching sessions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ Get the current academic session
export const getCurrentSession = async (req, res) => {
  try {
    const session = await Session.findOne().sort({ academicYear: -1 }); // Get latest session
    if (!session) return res.status(404).json({ error: "No academic session found" });

    res.json(session);
  } catch (error) {
    console.error("Error fetching current session:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


//import Classes from "./models/classes.js"; // Import your Classes schema

// export const addClasses = async (req, res) =>
// {
//   try {
//     const newClass = new Classes(req.body);
//     const savedClass = await newClass.save();
//     res.status(201).json(savedClass);
//   } catch (error) {
//     console.error("Error adding class:", error);
//     res.status(500).json({ error: "Failed to add class." });
//   }
// };

export const addClasses = async (req, res) => {
  console.log(req.body);
  try {
    const { class: className, stream, ClassTeacherNo } = req.body;
    console.log(req.body);
    // Check if the class and stream combination already exists
    let existingClass = await Classes.findOne({ class: className, stream });
   
    if (existingClass) {
      return res.status(400).json({ error: "Class already exists" });
    }

    // Create a new class if it doesn't exist
    const newClass = new Classes({ class: className, stream, ClassTeacherNo });
    const savedClass = await newClass.save();

    res.status(201).json({ message: "Class added successfully", savedClass });
  } catch (error) {
    console.error("Error adding/updating class:", error);
    res.status(500).json({ error: "Failed to add/update class." });
  }
};
