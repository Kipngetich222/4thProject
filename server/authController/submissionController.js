import Submissions from "../models/AssingnemtSubmition.js";

// ✅ Student Submission Controller
export const submitAssignment = async (req, res) => {
    try {
        const { assignmentId, studentId, remarks } = req.body;

        // Validate required fields
        if (!assignmentId || !studentId || !req.file) {
            console.log("Error: All fields are required.");
            return res.status(400).json({ error: "Assignment ID, student ID, and file are required." });
        }

        const fileUrl = `uploads/${req.file.filename}`; // Path to the uploaded file

        // Save the submission
        const newSubmission = new Submissions({
            assignmentId,
            studentId,
            fileUrl,
            remarks,
        });

        const savedSubmission = await newSubmission.save();
        console.log("Submission saved:", savedSubmission);
        res.status(201).json({ success: "Assignment submitted successfully.", submission: savedSubmission });
    } catch (error) {
        console.error("Error saving submission:", error);
        res.status(500).json({ error: "An error occurred during submission." });
    }
};

// ✅ Teacher View Submissions Controller
export const viewSubmissions = async (req, res) => {
    try {
        const { assignmentId } = req.params;

        // Fetch all submissions for the specific assignment
        const submissions = await Submission.find({ assignmentId })
            .populate("studentId", "fname lname email") // Populate student details
            .populate("assignmentId", "title"); // Populate assignment details

        console.log("Fetched submissions:", submissions);

        if (submissions.length === 0) {
            return res.status(404).json({ message: "No submissions found for this assignment." });
        }

        res.status(200).json({ submissions });
    } catch (error) {
        console.error("Error fetching submissions:", error);
        res.status(500).json({ error: "An error occurred while fetching submissions." });
    }
};
