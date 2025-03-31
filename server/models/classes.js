// import mongoose from 'mongoose';
// import Teacher from "./teachers.js";

// //this table stores information about all classes
// const classesSchema = new mongoose.Schema({
//     //class : {type : string/*, required : true*/},
//     stream : {type : String , required : true},
//     teacher_id : {type : mongoose.Schema.Types.userNo, ref : Teacher},
// },{timestamps : true});

// const Classes = model.Schema("classes", classesSchema);
// export default Classes;

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
