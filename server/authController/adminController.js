import User from "../models/User.js";
import ClassTeachers from "../models/classTeachers.js";
import Teacher from "../models/teaches.js";

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


// router.post("/teachers", async 
export const addTeachers = async (req, res) => {
  try {
    const { userNo, department, subjects, contactNo } = req.body;
    if(!userNo){
      return res.json({error : "userNo required"});
    } if(!department){
      return res.json({error : "Department required"});
    } if(!subjects){
      return res.json("Subjects required");
    } if(!contactNo){
      return res.json({error : "Contact number required"});
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

