// import mongoose from 'mongoose';

// //this table tracks student atendance

// const atendanceSchema = new mongoose.Schema({
//     student_id : {type : mongoose.Schema.Types.ObjectId, ref : users},
//     class_id : {type : mongoose.Schema.Types,ObjectId, ref : classes},
//     date : {type :Date},
//     status_report : {type : String, required : true, enum : ['present','Absent','Late']},
//     notes : {type : String , default : null}
// })

import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema({
  classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  status: { type: String, enum: ["Present", "Absent"], required: true },
  date: { type: Date, default: Date.now },
});

export default mongoose.model("Attendance", AttendanceSchema);
