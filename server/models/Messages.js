import mongoose, { model, mongo } from 'mongoose';

//this tables stored communication between parents and teachers
const messagesSchema = new mongoose.Schema({
    sender_id : {type : mongoose.Schema.Types.ObjectId, ref : "users", required : true},
    reciever_id : {type : mongoose.Schema.Types.ObjectId, ref : "users", required : true},
    message : {type : String},
    image : {type : String},
},{timestamps : true});

export const Messages = mongoose.model("Messages", messagesSchema);