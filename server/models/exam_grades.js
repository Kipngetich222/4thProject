import mongoose from 'mongoose';

const examgradesSchema = new mongoose.Schema({
    student_id : {type : mongoose.Schema.Types.ObjectId, ref : users},
    assingmment_id : {type : mongoose.Schema.Types.ObjectId, ref :users },
    score : {type : Int},
    grade : {type : String},
    comments  : {type : String , default : null},
    created_at : {type : Date , default :  Date.now()},
    update_at : {type : Date, default : Date.now()}
})