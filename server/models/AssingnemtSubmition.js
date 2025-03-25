import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
    assignmentId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Assignment", // Reference the assignment 
        required: true 
    },
    studentId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", // Reference the student (User with role 'student') 
        required: true 
    },
    fileUrl: { 
        type: String, 
        required: true // URL or path to the submitted file 
    },
    submittedAt: { 
        type: Date, 
        default: Date.now // Automatically capture the time of submission 
    },
    remarks: { 
        type: String // Optional field for any additional comments or notes 
    },
    marks: { 
        type: Number, 
        min: 0, 
        max: 100 // Marks awarded to the submission 
    },
    status : {
        type :String,
        default : "Unmarked",
        enum : ["Unmarked", "Marked"]
    }
}, { timestamps: true });

const Submissions = mongoose.model("Submission", submissionSchema);

export default Submissions