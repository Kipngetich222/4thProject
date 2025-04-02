// import jwt from "jsonwebtoken";
// import User from "../models/user.js";

// const authenticate = async (req, res, next) => {
//   try {
//     // Get token from header or cookie
//     const token =
//       req.headers.authorization?.split(" ")[1] || req.cookies?.token;

//     if (!token) {
//       return res.status(401).json({
//         error: "Authentication required",
//         code: "NO_TOKEN",
//       });
//     }

//     // Verify token with server secret
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Get fresh user data from database
//     const user = await User.findById(decoded._id).select("-password");

//     if (!user) {
//       return res.status(401).json({
//         error: "User not found",
//         code: "USER_NOT_FOUND",
//       });
//     }

//     // Attach user to request
//     req.user = user;
//     next();
//   } catch (error) {
//     console.error("Authentication error:", error);

//     const response = {
//       error: "Invalid or expired token",
//       code: "INVALID_TOKEN",
//     };

//     if (error.name === "TokenExpiredError") {
//       response.code = "TOKEN_EXPIRED";
//       response.expiredAt = error.expiredAt;
//     }

//     res.status(401).json(response);
//   }
// };

// export default authenticate;

import jwt from "jsonwebtoken";
import User from "../models/user.js";

const authenticate = async (req, res, next) => {
  try {
    // Get token from header, cookie, or socket handshake
    const token =
      req.headers?.authorization?.split(" ")[1] ||
      req.cookies?.token ||
      (req.connection && req.connection._query?.token); // For Socket.IO

    if (!token) {
      return res.status(401).json({
        error: "Authentication required",
        code: "NO_TOKEN",
      });
    }

    // Verify token with server secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get fresh user data from database with additional fields needed for chat
    const user = await User.findById(decoded._id).select("-password").lean();

    if (!user) {
      return res.status(401).json({
        error: "User not found",
        code: "USER_NOT_FOUND",
      });
    }

    // Attach full user object to request
    req.user = {
      ...user,
      _id: user._id.toString(), // Ensure consistent ID format
      fullName: `${user.fname} ${user.lname}`, // Add computed field
    };

    // For Socket.IO connections, attach to the socket
    if (req.connection && req.connection.socket) {
      req.connection.socket.user = req.user;
    }

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

    // Special handling for WebSocket connections
    if (req.connection && req.connection.socket) {
      req.connection.socket.emit("auth_error", response);
      req.connection.socket.disconnect();
      return;
    }

    res.status(401).json(response);
  }
};

// Socket.IO specific middleware
export const socketAuth = async (socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.split(" ")[1];

    if (!token) {
      throw new Error("Authentication error: NO_TOKEN");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id).select("-password");

    if (!user) {
      throw new Error("Authentication error: USER_NOT_FOUND");
    }

    // Attach full user object to socket
    socket.user = {
      ...user.toObject(),
      _id: user._id.toString(),
      fullName: `${user.fname} ${user.lname}`,
    };

    // Add to active users list
    if (!socket.server.activeUsers) {
      socket.server.activeUsers = new Map();
    }
    socket.server.activeUsers.set(user._id.toString(), socket);

    next();
  } catch (error) {
    console.error("Socket authentication failed:", error.message);
    socket.emit("auth_error", {
      error: "Authentication failed",
      code: error.message.includes("expired")
        ? "TOKEN_EXPIRED"
        : "INVALID_TOKEN",
    });
    socket.disconnect(true);
  }
};

export default authenticate;