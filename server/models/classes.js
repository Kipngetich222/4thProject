import mongoose from 'monogoose';

//this table stores information about all classes
const classesSchema = new mongoose.Schema({
    class_id : {type : String, index : true, unique : true},
    class : {type : string, required : true},
    stream : {type : String, required : true},
    teacher_id : {type : mongoose.Schema.Types.ObjectId, ref : classTeaches},
},{timestamps : true});