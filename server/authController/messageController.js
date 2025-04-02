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
  console.log("\n===== START getUsersForSidebar =====");

  // Add role validation at the start of getUsersForSidebar
  const validRoles = ["teacher", "parent", "student", "admin"];
  if (!validRoles.includes(currentUser.role)) {
    console.error("Invalid role detected:", currentUser.role);
    return res.status(400).json({ error: "Invalid user role" });
  }

  try {
    // 1. Log incoming request and user info
    console.log("Request received from user ID:", req.user?._id);
    console.log("Request headers:", JSON.stringify(req.headers, null, 2));

    // 2. Verify current user exists
    console.log("\n[1/5] Fetching current user...");
    const currentUser = await User.findById(req.user._id).lean();

    if (!currentUser) {
      console.error("❌ Current user not found in database");
      console.log("===== END getUsersForSidebar =====\n");
      return res.status(404).json({ error: "User not found" });
    }

    console.log("✅ Current user found:", {
      id: currentUser._id,
      role: currentUser.role,
      name: `${currentUser.fname} ${currentUser.lname}`,
    });

    // 3. Build filter
    console.log("\n[2/5] Building filter...");
    const filter = {
      _id: { $ne: new mongoose.Types.ObjectId(req.user._id) },
    };

    // 4. Apply role-based filtering
    console.log("\n[3/5] Applying role filters...");
    switch (currentUser.role) {
      case "teacher":
        filter.role = { $in: ["parent", "student"] };
        break;
      case "parent":
        filter.role = { $in: ["teacher"] };
        break;
      case "student":
        filter.role = { $in: ["teacher", "student"] };
        break;
      case "admin":
        filter.role = { $in: ["teacher", "parent", "student", "admin"] };
        break;
      default:
        filter.role = { $exists: true };
    }

    console.log(
      "🔍 Final MongoDB query filter:",
      JSON.stringify(filter, null, 2)
    );

    // 5. Execute query
    console.log("\n[4/5] Executing database query...");
    const users = await User.find(filter)
      .select("_id fname lname role profilePic email")
      .lean();

    console.log(`📊 Database returned ${users.length} users`);

    if (users.length === 0) {
      console.warn("⚠️ No users found matching filter. Possible causes:");
      console.warn("- No users exist with these roles in database");
      console.warn("- Database connection issues");
      console.warn("- Incorrect role assignments");

      // Diagnostic query to count users by role
      const roleCounts = await User.aggregate([
        { $group: { _id: "$role", count: { $sum: 1 } } },
      ]);
      console.log("ℹ️ Existing users by role:", roleCounts);
    } else {
      console.log(
        "✅ Users found:",
        users.map((u) => ({
          id: u._id,
          name: `${u.fname} ${u.lname}`,
          role: u.role,
        }))
      );
    }

    // 6. Format response
    console.log("\n[5/5] Formatting response...");
    const formattedUsers = users.map((user) => ({
      ...user,
      id: user._id.toString(),
      name: `${user.fname} ${user.lname}`.trim(),
    }));

    console.log("📤 Sending response with users:", formattedUsers.length);
    console.log("===== END getUsersForSidebar =====\n");
    res.status(200).json(formattedUsers);
  } catch (error) {
    console.error("🔥 Critical error:", error);

    // Detailed error diagnostics
    if (error instanceof mongoose.Error.CastError) {
      console.error("❌ MongoDB CastError - Invalid ID format:", error.value);
    }

    if (error instanceof mongoose.Error.ValidationError) {
      console.error("❌ MongoDB ValidationError:", error.errors);
    }

    console.log("===== END getUsersForSidebar (ERROR) =====\n");
    res.status(500).json({
      error: "Internal server error",
      ...(process.env.NODE_ENV === "development" && {
        details: error.message,
        stack: error.stack,
      }),
    });
  }
};

// // messageController.js - Update getUsersForSidebar
// export const getUsersForSidebar = async (req, res) => {
//   try {
//     const currentUser = await User.findById(req.user?._id);
//     let filter = { _id: { $ne: req.user?._id } }; // Exclude current user

//     if (currentUser) {
//       switch (currentUser.role) {
//         case "teacher":
//           filter.role = { $in: ["student", "parent"] }; // Teachers see students & parents
//           break;
//         case "parent":
//           filter.role = "teacher"; // Parents see only teachers
//           break;
//         case "student":
//           filter.role = { $in: ["teacher", "student"] }; // Students see teachers & students
//           break;
//         case "admin":
//           // Admins see everyone (no role filter)
//           break;
//         default:
//           filter.role = "user"; // Fallback
//       }
//     }

//     const users = await User.find(filter).select("-password");
//     res.status(200).json(users);
//   } catch (error) {
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

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