import mongoose from "mongoose";

const subjectsSchema = new mongoose.Schema({
    subjectName : {type  : String, index, unique : true},
    description : {type : String, default : null},
    teacher_id : {type : mongoose.Schema.Types.ObjectId, ref : users},
    createdat : {type : Date, default : Date.now()},
    updatedat : {type : Date, default : Date.now()}
})