import mongoose from "mongoose";

const classesSchema = new mongoose.Schema(
  {
    class : {
        type : String
    },
    stream: {
      type: String,
      required: true,
    },
    ClassTeacherNo: {
      type: String,
      ref: "Teachers", // Reference to the `userNo` field in the Teachers collection
      required: true,
    },
  },
  { timestamps: true }
);

const Classes = mongoose.model("Classes", classesSchema);
export default Classes;
