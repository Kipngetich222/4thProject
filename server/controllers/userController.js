// controllers/userController.js
const User = require("../models/user"); // or your User model import

const getUsers = async (req, res) => {
  try {
    let query = { _id: { $ne: req.user._id } };

    // Handle role filtering
    if (req.query.role) {
      const roles = req.query.role.split(",");
      query.role = { $in: roles };
    }

    // Handle exclude parameter
    if (req.query.exclude) {
      query._id.$ne = req.query.exclude;
    }

    const users = await User.find(query)
      .select("fname lname email role profilePic")
      .lean();

    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export { getUsers };
// ... other exported controller functions

