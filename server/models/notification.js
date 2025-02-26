import mongoose  from "mongoose";

const notificationSchema = new mongoose.Schema({
    user_id : {type : mongoose.Schema.Types.ObjectId, ref : users},
    message : {type : String},
    read_status : {type : Boolean, default : false},
    created_at : {type : Date, default : Date.now()}
});