import mongoose, { model, mongo } from "mongoose";
import { Messages } from "./messages.js";

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
             ref  : Messages,
             default : []
        },
    ],
}, {timestamps: true})

const Conversations = mongoose.model("Conversations", consversationSchema);

export default Conversations;