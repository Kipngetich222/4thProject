import mongoose from 'mongoose';

//this table tracks student atendance

const atendanceSchema = new mongoose.Schema({
    student_id : {type : mongoose.Schema.Types.ObjectId, ref : users},
    class_id : {type : mongoose.Schema.Types,ObjectId, ref : classes},
    date : {type :Date},
    status_report : {type : String, required : true, enum : ['present','Absent','Late']},
    notes : {type : String , default : null}
})