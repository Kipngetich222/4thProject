import mongoose, { model, mongo } from "mongoose";
import  Message  from "./message.js";

const consversationSchema = mongoose.Schema({
    participants : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        },
    ],
    messages : [
        {
            type  : mongoose.Schema.Types.ObjectId,
             ref  : Message,
             default : []
        },
    ],
}, {timestamps: true})

const Conversations = mongoose.model("Conversations", consversationSchema);

export default Conversations;