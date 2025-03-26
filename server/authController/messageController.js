//import User from "../models/user";
import protectRoute from "../Protected/protectRoute.js";
import { Messages } from "../models/messages.js";
import Conversations from "../models/consversations.js";

// export const SendMessage = async (req, res) => {
//     try {
//         const { message } = req.body;
//         const { id: receiverId } = req.params;
//         const senderId = req.user._id;

//         // Check for an existing conversation
//         let conversation = await Conversations.findOne({
//             participants: { $all: [senderId, receiverId] },
//         });

//         // If no conversation exists, create a new one
//         if (!conversation) {
//             conversation = await Conversations.create({
//                 participants: [senderId, receiverId]
//             });
//         }

//         // Create a new message
//         const newMessage = new Messages({
//             senderId,
//             receiverId,  // Typo fixed: receiverId instead of recieverId
//             message
//         });

//         // Add the new message to the conversation
//         if (newMessage) {
//             conversation.messages.push(newMessage._id); // Ensure field is 'messages'
//         }

//         // Save both the conversation and the new message
//         await Promise.all([conversation.save(), newMessage.save()]);
//         res.status(201).json(newMessage);

//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({ error: "Internal server error" });
//     }
// }

export const SendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params; // Changed to receiverId
        const senderId = req.user._id;

        // Check for an existing conversation
        let conversation = await Conversations.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        // If no conversation exists, create a new one
        if (!conversation) {
            conversation = await Conversations.create({
                participants: [senderId, receiverId]
            });
        }

        // Create a new message
        const newMessage = new Messages({
            sender_id: senderId, // Ensure field names match schema
            reciever_id : receiverId, // Ensure field names match schema
            message
        });

        // Add the new message to the conversation
        if (newMessage) {
            conversation.messages.push(newMessage._id); // Ensure field is 'messages'
        }

        // Save both the conversation and the new message
        await Promise.all([conversation.save(), newMessage.save()]);
        res.status(201).json(newMessage);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}