// import Grades from "../models/exam_grades.js"; // Assuming Grades schema is already defined
// import User from "../models/user.js"; // Assuming User model exists with parent-child relationship

// // API route to get the student's grades for a parent
// export const getStudentGrades = async (req, res) => {
//   try {
//     // Get parentId from authenticated user
//     const parentId = req.user.id; // Assuming this is added in the auth middleware

//     // Find the children associated with this parent (assuming there is a 'children' field in the parent schema)
//     const parent = await User.findById(parentId) /*.populate('studentNo'); */ // Parent has many children
//     console.log("parent",parent)
//     if (!parent) {
//       return res.status(404).json({ error: "Parent not found" });
//     }

//     const studentIds = parent.children.map(child => child._id); // Get all child ids

//     // Fetch grades for all children of the parent
//     const grades = await Grades.find({ 'subjects.grades.stdNo': { $in: studentIds } });

//     if (!grades || grades.length === 0) {
//       return res.status(404).json({ error: "No grades found for this parent’s children" });
//     }

//     res.status(200).json(grades); // Send the grades to the parent
//   } catch (error) {
//     console.error("Error fetching student grades:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

import Grades from "../models/exam_grades.js";
import Parent from "../models/parents.js"; // Import Parent model

// API route to get the student's grades for a parent
export const getStudentGrades = async (req, res) => {
  try {
    // ✅ Get parentId from authenticated user
    const parentId = req.user.userNo; // Since parentsId is a string (same as userNo)

    // ✅ Find the parent using parentsId
    const parent = await Parent.findOne({ parentsId: parentId });

    if (!parent) {
      return res.status(404).json({ error: "Parent not found" });
    }

    // ✅ Extract student numbers from `children` array
    const studentNumbers = parent.children; // Since `children` already holds stdNo values

    if (studentNumbers.length === 0) {
      return res.status(404).json({ error: "No students associated with this parent" });
    }

    // ✅ Fetch grades for all children of the parent
    const grades = await Grades.find({ "subjects.grades.stdNo": { $in: studentNumbers } });

    if (!grades || grades.length === 0) {
      return res.status(404).json({ error: "No grades found for this parent’s children" });
    }
    console.log(grades);
    res.status(200).json(grades); // ✅ Send grades to the parent

  } catch (error) {
    console.error("❌ Error fetching student grades:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

