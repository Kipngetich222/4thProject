import User from "../models/User.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password",);
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}