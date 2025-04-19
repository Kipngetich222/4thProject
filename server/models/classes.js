<<<<<<< HEAD
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
=======
import mongoose from 'monogoose';

//this table stores information about all classes
const classesSchema = new mongoose.Schema({
    class_id : {type : String, index : true, unique : true},
    class : {type : string, required : true},
    stream : {type : String, required : true},
    teacher_id : {type : mongoose.Schema.Types.ObjectId, ref : classTeaches},
},{timestamps : true});
>>>>>>> teacher_edits
