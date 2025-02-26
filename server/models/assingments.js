import mongoose from 'mongoose';

//this table stores the assingnment information given to students
const assingmentSchema = new mongoose.Schema({
    assinment_id : {type : String, index: true ,  uniquie : true},
    class_id : {type : mongoose.Schema.Typed.ObjectId},
    title : {type : String, reauired : true},
    description : {type : String, required : true},
    due_date : {type : Date},
    created_at : {type : Date, default : Date.now()},
    updated_at : {type : Date, default : Date.now()}
})