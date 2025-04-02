import mongoose from "mongoose";

const gradeSchema = new mongoose.Schema({
  academicYear: {
    type: String,
    required: true,
    default: () => new Date().getFullYear().toString(), // Auto-set to current year
    match: [/^\d{4}$/, "Invalid academic year format"], // Example: "2025"
  },
  class: {
    type: String,
    required: true, // Example: "Grade 1"
  },
  stream: {
    type: String,
    //required: true, // Example: "Grade 1A"
  },
  term: {
    type: String,
    required: true, 
    enum: ["Term 1", "Term 2", "Term 3"], // Restricts valid terms
  },
  exam: {
    type: String,
    required: true, // Example: "Midterm Exam 1", "Final Exam"
  },
  subjects: [
    {
      subjectName: {
        type: String,
        required: true, // Example: "Mathematics"
      },
      grades: [
        {
          stdNo: {
            type: mongoose.Schema.Types.stdNo,
            ref: "Student", // Reference to the Student model
            required: true,
          },
          marks: {
            type: Number,
            min: 0, // Minimum marks
            max: 100, // Maximum marks
          },
        },
      ],
    },
  ],
}, { timestamps: true }); // Adds createdAt & updatedAt fields automatically

const Grades = mongoose.model("Grades", gradeSchema);
export default Grades;
