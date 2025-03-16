// import mongoose from 'mongoose';
import mongoose from "mongoose";

const AssignmentSchema = new mongoose.Schema(
  {
    assignment_id: { type: String, unique: true }, // ❌ No longer required
    title: { type: String, required: true },
    description: { type: String, required: true },
    due_date: { type: String },
    classes: [{ type: String }], // ✅ Stored as an array
    subject: { type: String },
    file_path: { type: String, required: true },
  },
  { timestamps: true }
);

const Assignment = mongoose.model("Assignment", AssignmentSchema);
export default Assignment;


//export default Assignment;
