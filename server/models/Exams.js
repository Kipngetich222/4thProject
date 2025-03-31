import mongoose from "mongoose";

const examSchema = new mongoose.Schema({
  academicYear: { type: String, required: true },
  term: { type: String, required: true },
  exam: { type: String, required: true },
  classes: [{ type: String, required: true }], // Example: ["Form 1", "Form 2"]
}, { timestamps: true });

const Exams = mongoose.model("Exams", examSchema);
export default Exams;
