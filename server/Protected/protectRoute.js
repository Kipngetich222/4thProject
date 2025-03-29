// import jwt from "jsonwebtoken";
// import User from "../models/user.js";

// const protectRoute = async (req, res, next) => {
//     console.log("protected rout running");
//     try {
//         const token = req.cookies.jwt;

//         if (!token) {
//             return res.status(401).json({ error: "Unauthorized: No access token" });
//         }

//         // Verify the token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         if (!decoded) {
//             return res.status(402).json({ error: "Unauthorized: Invalid token" });
//         }

//         // Find the user
//         const user = await User.findById(decoded.userId).select("-password");

//         if (!user) {
//             return res.status(402).json({ error: "Unauthorized: User not found" });
//         }

//         // Attach user to the request
//         req.user = user;

//         // Generate a new token and set it in the cookies
//         const newToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
//             expiresIn: "10m" // Extend expiration time
//         });
//         res.cookie("jwt", newToken, {
//             maxAge: 1000 * 60 * 10, // 10 minutes
//             httpOnly: true,
//             sameSite: "strict",
//             secure: process.env.NODE_EN !== "development"
//         });

//         // Continue to the next middleware
//         next();
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({ error: "An error occurred" });
//     }
// };

// export default protectRoute;

import jwt from "jsonwebtoken";
import User from "../models/user.js";

const protectRoute = async (req, res, next) => {
    console.log("Protected route running...");

    try {
        // ✅ Correct cookie name
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ error: "Unauthorized: No access token" });
        }

        // ✅ Correct property name in decoded token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ error: "Unauthorized: Invalid token" });
        }

        // ✅ Correct user ID reference
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({ error: "Unauthorized: User not found" });
        }

        // ✅ Attach user to request for further processing
        req.user = user;

        // ✅ Renew token only if it's about to expire (less than 3 minutes remaining)
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp - currentTime < 180) { // 180 seconds = 3 minutes
            const newToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: "10m", // Keep extending expiration time
            });

            res.cookie("token", newToken, {
                maxAge: 1000 * 60 * 10, // 10 minutes
                httpOnly: true,
                sameSite: "strict",
                secure: process.env.NODE_ENV !== "development",
            });
        }

        // ✅ Proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error("Error in protectRoute middleware:", error);
        return res.status(500).json({ error: "An error occurred" });
    }
};

export default protectRoute;
