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
