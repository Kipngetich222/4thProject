import mongoose from 'mongoose';


//this table stored information about class submitions for assingents
const submissionSchema = new mongoose.Schema({
    submission_id: { type: String, index: true, unique: true, required: true }, // Added required: true
    assignment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true }, // Corrected ref and added required
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true }, // Corrected ref and added required
    submission: { type: Date }, // Corrected typo: submition to submission
    file_path: { type: String }, // Specify the type for file_path (e.g., String)
    grade: { type: String, default: null }, // Use default: null for optional fields
    feedback: { type: String, default: null }, // Use default: null for optional fields
    created_at: { type: Date, default: Date.now() },
    updated_at: { type: Date, default: Date.now() }
});