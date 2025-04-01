import User from "../models/user.js";
import ClassTeachers from "../models/classTeachers.js";
import Teacher from "../models/teaches.js";
import toast from "react-hot-toast";
import Students from "../models/students.js";
import  Parent from "../models/parents.js";


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
      userNo: user._id, // Use the ObjectId from the Users collection
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
      stdNo : userNo,
      class : stdClass, 
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
