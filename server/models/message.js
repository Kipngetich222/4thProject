import mongoose from "mongoose";
const { Schema } = mongoose; // Destructure Schema from mongoose

const messageSchema = new Schema(
  {
    chatId: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
    },
    fileUrl: {
      type: String,
    },
    fileType: {
      type: String,
      enum: ["image", "video", "document", "other"],
    },
    readBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
); // This automatically adds createdAt and updatedAt fields

const Message =
  mongoose.models.Message || mongoose.model("Message", messageSchema);

export default Message;
