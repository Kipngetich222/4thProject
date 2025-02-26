import mongoose from 'mongoose';

//this tables stored communication between parents and teachers
const messagesSchema = new mongoose.Schema({
    sender_id : {type : mongoose.Schema.Types.ObjectId, red : users},
    reciever_id : {type : mongoose.Schema.Types.ObjectId, ref : users},
    message_text : {type : String},
    send_at : {type : Date, default : Date.now()},
    read_status : {type : Boolean, required : true}
})