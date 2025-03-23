import jwt from "jsonwebtoken";
import User from "../models/user.js";

const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ error: "Unauthorized: No access token" });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(402).json({ error: "Unauthorized: Invalid token" });
        }

        // Find the user
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(402).json({ error: "Unauthorized: User not found" });
        }

        // Attach user to the request
        req.user = user;

        // Generate a new token and set it in the cookies
        const newToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "10m" // Extend expiration time
        });
        res.cookie("jwt", newToken, {
            maxAge: 1000 * 60 * 10, // 10 minutes
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_EN !== "development"
        });

        // Continue to the next middleware
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "An error occurred" });
    }
};

export default protectRoute;
