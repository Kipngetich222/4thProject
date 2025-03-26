import mongoose from "mongoose";

const classTeacherSchema = new mongoose.Schema({
  userNo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference the User model
    required: true,
  },
  classAssigned: {
    type: String,
    required: true, // Example: "Grade 1"
  },
  stream: {
    type: String, // Example: "A" (optional, if streams exist)
  },
});

const ClassTeachers = mongoose.model("ClassTeachers", classTeacherSchema);
export default ClassTeachers;