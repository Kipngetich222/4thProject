import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema(
  {
    student_id: {
      type: mongoose.Schema.Types.String, // Use String to match userNo type
      ref: "User", // Reference Users collection
      required: true,
      unique: true, // Ensure it's unique
    },
    userNo: { type: String, required: true },
    class: { type: String, required: true },
    stream: { type: String },
    subjects: { type: [String], required: true },
    enrollmentDate: { type: Date, required: true },
    parentContact: { type: String, required: true },
    performance: { type: String },
  },
  { timestamps: true }
);

const Students = mongoose.model("Students", StudentSchema);
export default Students;


// export default Students;