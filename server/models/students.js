import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema(
  {
    stdNo: { type: String, required: true },
    class: { type: String, required: true },
    stream: { type: String },
    subjects: { type: [String], required: true }
  },
  { timestamps: true }
);

const Students = mongoose.model("Students", StudentSchema);
export default Students;
