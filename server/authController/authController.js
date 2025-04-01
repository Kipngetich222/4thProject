import express from 'express';
import User from '../models/user.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import { generateToken } from '../Lib/libs.js';
import Counter from '../models/counter.js';
import Parent from '../models/parents.js';
const app = express();
const secretKey = "My Screte";

app.use(bodyParser.json());



dotenv.config();



export const registerUser = async (req, res) => {
    console.log(req.body);
    const { fname, sname, lname, gender, email, password, role } = req.body;
    let { profilePic } = req.body;
    try {
        // Check if email already exists

        if (!fname) {
            console.error("Error: First name is required");
            return res.status(400).json({ error: "First name is required" });
        }

        if (!lname) {
            console.error("Error: Last name is required");
            return res.status(400).json({ error: "Last name is required" });
        }

        if (!gender) {
            console.error("Error: Gender is required");
            return res.status(400).json({ error: "Gender is required" });
        }

        if (!email) {
            console.error("Error: Email is required");
            return res.status(400).json({ error: "Email is required" });
        }

        if (!password) {
            console.error("Error: Password is required");
            return res.status(400).json({ error: "Password is required" });
        }

        if (!role) {
            console.error("Error: Role is required");
            return res.status(400).json({ error: "Role is required" });
        }

        const checkEmail = await User.findOne({ email });

        if (checkEmail) {
            console.error("Error: Email already registered");
            return res.status(409).json({ error: "Email already registered" });
        }

        // Generate a unique number sequence for the role
        let counter = await Counter.findByIdAndUpdate(
            { _id: role }, // Different counters for each role
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );

        // Define role-based prefixes
        const rolePrefixes = {
            admin: "adm",
            student: "std",
            parent: "prnt",
            teacher: "tchr"
        };

        // Format userNo (e.g., adm1, std2, prnt3)
        const userNo = `${rolePrefixes[role] || "usr"}${counter.seq}`;

        // Set default profile picture based on gender
        profilePic = gender === "male" ?
            "https://avatar.iran.liara.run/public/boy" :
            "https://avatar.iran.liara.run/public/girl";

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = await User.create({
            userNo, fname, sname, lname, email, password: hashedPassword, role, gender, profilePic
        });

        return res.status(201).json({
            success: "User registered successfully",
            userNo: newUser.userNo
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred" });
    }
};



export const registerParent = async (req, res) => {
    const session = await mongoose.startSession();
    try {
        await session.withTransaction(async () => {
            const { 
                studentNo, 
                relationship, 
                contactNo, 
                fname, 
                sname, 
                lname, 
                gender, 
                email, 
                password, 
                role 
            } = req.body;

            // Validate required fields
            const requiredFields = {
                studentNo: "Student number is required",
                relationship: "Relationship is required",
                contactNo: "Contact number is required",
                fname: "First name is required",
                lname: "Last name is required",
                gender: "Gender is required",
                email: "Email is required",
                password: "Password is required",
                role: "Role is required"
            };

            for (const [field, message] of Object.entries(requiredFields)) {
                if (!req.body[field]) {
                    return res.status(400).json({ error: message });
                }
            }

            // Case-insensitive email check
            const existingUser = await User.findOne({ email: { 
                $regex: new RegExp(`^${email}$`, 'i') 
            }}).session(session);

            if (existingUser) {
                return res.status(409).json({ error: "Email already registered" });
            }

            // Generate parent-specific user number
            const counter = await Counter.findByIdAndUpdate(
                { _id: "parent" },
                { $inc: { seq: 1 } },
                { new: true, upsert: true, session }
            );

            const userNo = `prnt${counter.seq.toString().padStart(4, '0')}`;
            
            // Hash password
            const hashedPassword = await bcrypt.hash(password.trim(), 10);

            // Create user
            const [newUser] = await User.create([{
                userNo,
                fname,
                sname,
                lname,
                gender,
                email: email.toLowerCase().trim(),
                password: hashedPassword,
                role,
                profilePic: gender === "male" 
                    ? "https://avatar.iran.liara.run/public/boy" 
                    : "https://avatar.iran.liara.run/public/girl"
            }], { session });

            // Create parent details
            await Parent.create([{
                userNo,
                studentNo,
                relationship,
                contactNo
            }], { session });

            res.status(201).json({
                success: "Parent registered successfully",
                userNo: newUser.userNo
            });
        });
    } catch (error) {
        await session.abortTransaction();
        console.error("Registration error:", error);

        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ error: errors.join(", ") });
        }

        res.status(500).json({ 
            error: error.message || "Registration failed" 
        });
    } finally {
        session.endSession();
    }
};



// authController.js
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt for:", email); // Debug log

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      console.log("User not found:", email);
      return res.status(401).json({ 
        success: false,
        error: "Invalid credentials" 
      });
    }

    console.log("Found user:", user.userNo); // Debug log
    console.log("Stored hash:", user.password); // Debug log

    const validPass = await bcrypt.compare(password.trim(), user.password);
    if (!validPass) {
      console.log("Password mismatch for:", email);
      return res.status(401).json({ 
        success: false,
        error: "Invalid credentials" 
      });
    }

    const token = jwt.sign(
      { _id: user._id, role: user.role, userNo: user.userNo },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("Generated token for:", user.userNo); // Debug log

    res.status(200).json({
      success: true,
      token,
      role: user.role,
      userNo: user.userNo,
      ObjectId: user._id,
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ 
      success: false,
      error: "Server error" 
    });
  }
};

//  // Set HTTP-only cookie (for server-side usage)
//     // Update login controller
//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "Strict",
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//       path: "/",
//     });

const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.json({ error: "Access denied" });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
        next();
    } catch (error) {
        return res.json({ error: "Invalid token" });
    }
};

export const teacher = (req, res) => {
    if (req.user.role !== 'teacher') {
        return res.json({ error: "Access denied" });
    }
    res.json({ message: "Welcome to the teacher's dashboard" });
};

export const student = (req, res) => {
    if (req.user.role !== 'student') {
        return res.json({ error: "Access denied" });
    }
    res.json({ message: "Welcome to the student's dashboard" });
};

export const admin = (req, res) => {
    if (req.res.role != admin) {
        return res.json({ error: "Acces denied" });
    }
    return res.json({ message: "Welcom to the Admin dashbord" });
}

export const parent = (req, res) => {
    if (req.res.role != parent) {
        return res.json({ error: "Acces denied" });
    }
    return res.json({ message: "Welcom to the parent dashbord" });
}

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        return res.status(200).json({ sucess: "Logout success" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

// Update checkAuth controller
export const checkAuth = (req, res) => {
  try {
    // Return basic user info
    res.status(200).json({
      user: {
        _id: req.user._id,
        email: req.user.email,
        role: req.user.role,
        userNo: req.user.userNo
      }
    });
  } catch (error) {
    console.error("Error in authController", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Add to authController.js
export const getGuestUser = async (req, res) => {
  try {
    const guest = await User.findOne({ role: "guest" });
    if (!guest) {
      return res.status(404).json({ error: "No guest user configured" });
    }
    res.status(200).json(guest);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
