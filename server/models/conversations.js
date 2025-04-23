import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }],
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
    }],
    is_group: {
        type: Boolean,
        default: false
    },
    group_name: {
        type: String,
        trim: true
    },
    group_admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    last_message: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
    },
    unread_count: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Ensure at least 2 participants in a conversation
conversationSchema.pre('save', function(next) {
    if (this.participants.length < 2) {
        next(new Error('A conversation must have at least 2 participants'));
    }
    next();
});

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;
