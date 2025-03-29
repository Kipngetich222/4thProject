// Create a new file fixPasswords.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/user.js";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.DB).then(async () => {
  const users = await User.find({});

  for (const user of users) {
    if (user.email === "testuser@gmail.com") {
      // Re-hash the password properly
      user.password = await bcrypt.hash("123", 10);
      await user.save();
      console.log(`Updated password for ${user.email}`);
    }
  }

  mongoose.disconnect();
});
