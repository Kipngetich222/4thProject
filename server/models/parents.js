import mongoose from "mongoose";

// Define Parent Schema
const parentSchema = new mongoose.Schema(
  {
    parentsId: {
      type: String,
      required: true,
      unique: true,
    },
    children: [
      {
        type: String, // Stores stdNo instead of ObjectId
        ref: "Student", // Reference to the Student collection
      },
    ],
    relationship: {
      type: String,
      required: true,
    },
    contactNo: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Parent = mongoose.model("Parent", parentSchema);
export default Parent;
