//import User from "../models/user";
import protectRoute from "../Protected/protectRoute.js";
import { Messages } from "../models/messages.js";
import Conversations from "../models/consversations.js";
import User from "../models/user.js";
import { Await } from "react-router-dom";


export const SendMessage = async (req, res) => {
    console.log("Params", req.params)
    try {
        const { message } = req.body;
        const { Id: receiverId } = req.params; // Changed to receiverId
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
            reciever_id: receiverId, // Ensure field names match schema
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

// export const getUsersForSidebar = async (req, res) => {
//   try {
//     const currentUser = await User.findById(req.user._id);
//     let filter = { _id: { $ne: req.user._id } };

//     // Role-based filtering
//     switch (currentUser.role) {
//       case "student":
//         filter.role = { $in: ["student", "teacher"] };
//         break;
//       case "parent":
//         filter.role = "teacher";
//         break;
//       case "teacher":
//         filter.role = { $in: ["student", "parent"] };
//         break;
//       case "admin":
//         // Admin can message everyone
//         break;
//       default:
//         filter.role = "user";
//     }

//     const users = await User.find(filter).select("-password");
//     res.status(200).json(users);
//   } catch (error) {
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

export const getUsersForSidebar = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user?._id);
    let filter = { _id: { $ne: req.user?._id } };

    if (currentUser) {
      switch (currentUser.role) {
        case "teacher":
          filter.role = { $in: ["student", "parent"] };
          break;
        case "parent":
          filter.role = "teacher";
          break;
        case "student":
          filter.role = { $in: ["teacher", "student"] };
          break;
        case "admin":
          // No filter for admin
          break;
      }
    }

    const users = await User.find(filter).select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async(req, res) => {
    try{
        const {Id : userToChatWith} = req.params;
        const sender_id = req.user._id; 
        const conversation = await Conversations.findOne({
            participants : {$all : [sender_id, userToChatWith]},
        }).populate("messages");

        if(!conversation) return res.status(200).json([]);

        const messages = conversation.messages;
        res.status(200).json(messages);
    } catch(error){
        console.log("error in getting messages", error);
        res.status(500).json({error : "Internal server error"})
    }
}