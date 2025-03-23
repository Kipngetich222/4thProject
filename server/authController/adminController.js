import User from "../models/user.js";
import ClassTeachers from "../models/classTeachers.js";
import Teacher from "../models/teaches.js";
import toast from "react-hot-toast";
import Students from "../models/students.js";

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

// export const AddStudents = async (req, res) => {
//   try {
//       // Destructure the data sent from the frontend
//       const { userNo, class: studentClass, stream, subjects, enrollmentDate, parentContact, performance } = req.body;

//       // Validate required fields
//       if (!userNo || !studentClass || !subjects || subjects.length === 0 || !parentContact) {
//           return res.status(400).json({ error: "All required fields must be filled." });
//       }

//       // Check if student details already exist for the given userNo
//       const existingDetails = await Students.findOne({ userNo });
//       if (existingDetails) {
//           return res.status(409).json({ error: "Details for this user number already exist." });
//       }

//       // Create a new document in the StudentDetails collection
//       const newStudentDetails = new StudentDetails({
//           userNo,
//           class: studentClass,
//           stream,
//           subjects,
//           enrollmentDate,
//           parentContact,
//           performance,
//       });

//       // Save to the database
//       const savedDetails = await newStudentDetails.save();

//       // Return a success response
//       res.status(201).json({ success: "Student details added successfully.", studentDetails: savedDetails });
//   } catch (error) {
//       console.error("Error saving student details:", error);
//       res.status(500).json({ error: "An internal server error occurred." });
//   }
// };

//import Students from "../models/students.js"; // ✅ Ensure correct model is used

export const AddStudents = async (req, res) => {
  console.log(req.body);
  try {
    const { userNo, StdClass , stream, subjects, enrollmentDate, parentContact, performance } = req.body;

    // ✅ Convert subjects to array if it's a string
    console.log("Competed 1");
    const subjectsArray = Array.isArray(subjects) ? subjects : subjects.split(",").map(sub => sub.trim());
    console.log("Completed 2");
    // ✅ Validate required fields
    //console.log(subjectsArray);
    // if (!userNo || !studentClass || /*subjectsArray.length === 0 ||*/ !parentContact) {
    //   return res.status(400).json({ error: "All required fields must be filled." });
    // }
    // if(!userNo){
    //   return res.status(400).json({ error: "User number is required." });
    // } if(!StdClass){
    //   return res.status(400).json({ error: "Student class is required." });
    // } if(!stream){
    //   return res.status(400).json({ error: "Stream is required." });
    // } if(!enrollmentDate){
    //   return res.status(400).json({ error: "Enrollment date is required." });
    // } if(!parentContact){
    //   return res.status(400).json({ error: "Parent contact is required." });
    // } if(!performance){
    //   return res.status(400).json({ error: "Performance is required." });
    // }
    if (!userNo) {
      console.log("Error: User number is required."); // Log the error to the console
      return res.status(400).json({ error: "User number is required." });
  }
  if (!StdClass) {
      console.log("Error: Student class is required."); // Log the error to the console
      return res.status(400).json({ error: "Student class is required." });
  }
  if (!stream) {
      console.log("Error: Stream is required."); // Log the error to the console
      return res.status(400).json({ error: "Stream is required." });
  }
  if (!enrollmentDate) {
      console.log("Error: Enrollment date is required."); // Log the error to the console
      return res.status(400).json({ error: "Enrollment date is required." });
  }
  if (!parentContact) {
      console.log("Error: Parent contact is required."); // Log the error to the console
      return res.status(400).json({ error: "Parent contact is required." });
  }
  if (!performance) {
      console.log("Error: Performance is required."); // Log the error to the console
      return res.status(400).json({ error: "Performance is required." });
  }
  
    console.log("Completed 3");
    // ✅ Check if student details already exist
    const existingDetails = await Students.findOne({ userNo });
    if (existingDetails) {
      return res.status(409).json({ error: "Details for this user number already exist." });
    }

    // ✅ Create and save new student details
    const newStudentDetails = new Students({
      userNo,
      class : StdClass, // Ensure consistency
      stream,
      //subjects: subjectsArray,
      enrollmentDate,
      parentContact,
      performance,
    });

    const savedDetails = await newStudentDetails.save();

    // ✅ Success response
    res.status(201).json({ success: "Student details added successfully.", studentDetails: savedDetails });
  } catch (error) {
    console.error("❌ Error saving student details:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
};
