import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema(
  {
    stdNo: { type: String, required: true },
    class: { type: String, required: true },
    stream: { type: String },
    subjects: { type: [String], required: true }
    // enrollmentDate: { type: Date, required: true },
    // parentContact: { type: String, required: true },
    // performance: { type: String },
  },
  { timestamps: true }
);

const Students = mongoose.model("Students", StudentSchema);
export default Students;


// export default Students;