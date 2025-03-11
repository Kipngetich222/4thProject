import mongoose from "mongoose";

const gradeSchema = new mongoose.Schema({
  academicYear: {
    type: String,
    required: true, // Example: "2025"
  },
  class: {
    type: String,
    required: true, // Example: "Grade 1"
  },
  stream: {
    type: String,
    required: true, // Example: "Grade 1A"
  },
  term: {
    type: String,
    required: true, // Example: "Term 1"
    enum: ["Term 1", "Term 2", "Term 3"], // Restricts valid terms
  },
  exam: {
    type: String,
    required: true, // Example: "Midterm Exam 1"
  },
  subjects: [
    {
      subjectName: {
        type: String,
        required: true, // Example: "Math"
      },
      grades: [
        {
          studentId: {
            type: mongoose.Schema.Types.ObjectId, // Reference to the student
            ref: "Student",
            required: true,
          },
          marks: {
            type: Number,
            required: true, // Marks for this subject
          },
        },
      ],
    },
  ],
});

const Grades = mongoose.model("Grades", gradeSchema);
export default Grades;
