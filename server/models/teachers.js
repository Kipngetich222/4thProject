import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
  userNo: {
    type : String,
    // type: mongoose.Schema.Types.ObjectId,
    // ref: "Users", // Reference to the Users schema
    required: true,
    unique: true, // Ensure each teacher has a unique userNo
  },
  department: {
    type: String, // Department the teacher belongs to
    required: true,
  },
  subjects: [
    {
      type: String, // List of subjects the teacher teaches
      required: true,
    },
  ],
  contactNumber: {
    type: String, // Optional field for contact information
    default: "",
  },
  hireDate: {
    type: Date, // Date when the teacher was hired
    default: Date.now,
  },
});

const Teachers = mongoose.model("Teachers", teacherSchema);
export default Teachers;
