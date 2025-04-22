import jwt from "jsonwebtoken";
import User from "../models/user.js";

const authenticate = async (req, res, next) => {
  try {
    // Get token from header or cookie
    const token = req.header("Authorization")?.replace("Bearer ", "") || req.cookies?.token;
    
    if (!token) {
      console.log("No token found in request");
      return res.status(401).json({ error: "Please authenticate" });
    }

    console.log("Token found, verifying...");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token decoded:", decoded);

    const user = await User.findById(decoded.id);
    if (!user) {
      console.log("User not found for ID:", decoded.id);
      return res.status(401).json({ error: "User not found" });
    }

    console.log("User found:", user);
    req.user = user;
    next();
  } catch (err) {
    console.error("Authentication error:", err);
    res.status(401).json({ error: "Please authenticate" });
  }
};

export { authenticate };
// export default authenticate;