import mongoose from "mongoose";

const teacherAssignmentSchema = new mongoose.Schema({
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teachers", // Reference to the Teachers collection
    required: true,
  },
  subjects: [
    {
      subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subjects", // Reference to the Subjects collection
        required: true,
      },
      classes: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Classes", // Reference to the Classes collection
          required: true,
        }
      ]
    }
  ],
  academicYear: {
    type: String, // e.g., "2024/2025"
    required: true,
  },
  term: {
    type: String, // e.g., "Term 1", "Term 2", "Term 3"
    required: true,
  },
  assignedDate: {
    type: Date,
    default: Date.now, // Date when the teacher was assigned
  }
});

const TeacherAssignments = mongoose.model("TeacherAssignments", teacherAssignmentSchema);
export default TeacherAssignments;
