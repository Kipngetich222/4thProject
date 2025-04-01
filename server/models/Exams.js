import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    academicYear: {
      type: String, // Example: "2025"
      required: true,
      match: [/^\d{4}$/, "Invalid academic year format"], // Validates "YYYY" format
    },
    term: {
      type: String, // Example: "Term 1"
      required: true,
      enum: ["Term 1", "Term 2", "Term 3"], // Ensures only valid terms are entered
    },
    exam: {
      type: String, // Example: "MidTerm"
      required: true,
    },
    classes: [
      {
        type: String, // Example: "Form 2", "Form 4"
        required: true,
      },
    ],
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Prevent OverwriteModelError
const Exams = mongoose.models.GradesDocument || mongoose.model("GradesDocument", schema);

export default Exams;