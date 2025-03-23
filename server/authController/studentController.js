import Assignment from "../models/assignments.js";

export const fetchStudentAssignments = async (req, res) => {
    try {
        const studentId = req.user._id; // Get logged-in student's ID
        // const assignments = await Assignment.find({ classes: req.user.class }); // Filter by student's class
        const assignments = await Assignment.find(); // Filter by student's class
        res.status(200).json(assignments);
    } catch (error) {
        console.error("Error fetching assignments for student:", error);
        res.status(500).json({ error: "Failed to fetch assignments." });
    }
};


export const viewAssingment = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const assignment = await Assignment.findById(assignmentId);

        if (!assignment) {
            return res.status(404).json({ error: "Assignment not found." });
        }

        res.status(200).json({ assignment });
    } catch (error) {
        console.error("Error fetching assignment:", error);
        res.status(500).json({ error: "An error occurred while fetching the assignment." });
    }
};

