import mongoose from "mongoose";

const ClassSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    grade: { type: String, required: true },
    section: { type: String },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    academicYear: { type: String, required: true },
    schedule: [{
      day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], required: true },
      subjects: [{
        name: { type: String, required: true },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true }
      }]
    }],
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
  },
  { timestamps: true }
);

const Class = mongoose.model("Class", ClassSchema);
export default Class;
