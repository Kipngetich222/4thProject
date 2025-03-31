// // authMiddleware.js - Updated version
// import jwt from "jsonwebtoken";
// import User from "../models/user.js";

// // const authenticate = async (req, res, next) => {
// //   try {
// //     // Try to get token from Authorization header first
// //     let token = req.headers.authorization?.split(" ")[1];

// //     // If not in header, try cookies
// //     if (!token) {
// //       token = req.cookies?.token;
// //     }

// //     if (!token) {
// //       return res.status(401).json({ error: "Authentication required" });
// //     }

// //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
// //     const user = await User.findById(decoded._id).select("-password");

// //     if (!user) {
// //       return res.status(401).json({ error: "Invalid token" });
// //     }

// //     req.user = user;
// //     next();
// //   } catch (error) {
// //     console.error("Authentication error:", error);
// //     res.status(401).json({ error: "Invalid or expired token" });
// //   }
// // };

// const authenticate = async (req, res, next) => {
//   try {
//     const token =
//       req.headers.authorization?.split(" ")[1] || req.cookies?.token;

//     if (!token) {
//       return res.status(401).json({ error: "Authentication required" });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded._id).select("-password");

//     if (!user) {
//       return res.status(401).json({ error: "Invalid token" });
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     console.error("Authentication error:", error);
//     res.status(401).json({ error: "Invalid or expired token" });
//   }
// };

// export default authenticate;


import jwt from "jsonwebtoken";
import User from "../models/user.js";

const authenticate = async (req, res, next) => {
  try {
    // Get token from header or cookie
    const token =
      req.headers.authorization?.split(" ")[1] || req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        error: "Authentication required",
        code: "NO_TOKEN",
      });
    }

    // Verify token with server secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get fresh user data from database
    const user = await User.findById(decoded._id).select("-password");

    if (!user) {
      return res.status(401).json({
        error: "User not found",
        code: "USER_NOT_FOUND",
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);

    const response = {
      error: "Invalid or expired token",
      code: "INVALID_TOKEN",
    };

    if (error.name === "TokenExpiredError") {
      response.code = "TOKEN_EXPIRED";
      response.expiredAt = error.expiredAt;
    }

    res.status(401).json(response);
  }
};

export default authenticate;