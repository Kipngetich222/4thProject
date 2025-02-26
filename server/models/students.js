import mongoose from 'mongoose';

//the table stores information about all students
const studentSchema = new mongoose.Schema({
    student_id : {type : String, required : true, index : true , unique : true},
    fname : {type : String, required : true},
    sname : {type : String},
    lname : {type : String, required : true},
    DOB : {type : Date},
    parent_id : {type : mongoose.Schema.Types.ObjectId, ref : 'teachers'},
    teacher_id : {type : mongoose.Schema.Types.ObjectId, ref : 'parents'},
    created_at : {type : date, default : Date.now()},
    updated_at : {type : Date , default : Date.now()}
})