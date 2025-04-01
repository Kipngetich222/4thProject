import express from 'express';
import User from '../Models/User.js';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import { generateToken } from '../Lib/libs.js';
import Counter from '../models/counter.js';
import Parent from '../models/parents.js';
import Teachers from '../models/teachers.js';
import TeacherAssignments from '../models/TeacherAssingment.js';
import Session from '../models/session.js';
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

// export const registerParent = async (req, res) => {
//     console.log(req.body);
//     const { studentNo, relationship, contactNo, fname, sname, lname, gender, email, password, role } = req.body;
//     let { profilePic } = req.body;

//     // ✅ Validate required fields
//     if (!studentNo) return res.status(400).json({ error: "Student number is required." });
//     if (!relationship) return res.status(400).json({ error: "Relationship with student is required." });
//     if (!contactNo) return res.status(400).json({ error: "Contact number is required." });
//     if (!fname) return res.status(400).json({ error: "First name is required." });
//     if (!lname) return res.status(400).json({ error: "Last name is required." });
//     if (!gender) return res.status(400).json({ error: "Gender is required." });
//     if (!email) return res.status(400).json({ error: "Email is required." });
//     if (!password) return res.status(400).json({ error: "Password is required." });
//     if (!role) return res.status(400).json({ error: "Role is required." });

//     console.log("✅ Passed Validation Checks");

//     try {
//         // ✅ Check if email already exists (case-insensitive)
//         const checkEmail = await User.findOne({ email: { $regex: `^${email}$`, $options: "i" } });
//         if (checkEmail) {
//             return res.status(409).json({ error: "Email is already registered" });
//         }

//         console.log("✅ Email is Unique");

//         // ✅ Generate a unique parent user number
//         const counter = await Counter.findByIdAndUpdate(
//             { _id: "parent" },
//             { $inc: { seq: 1 } },
//             { new: true, upsert: true }
//         );

//         const userNo = `prnt${counter.seq}`;
//         console.log("✅ Generated Parent User Number:", userNo);

//         // ✅ Set default profile picture if not provided
//         if (!profilePic) {
//             profilePic = gender === "male"
//                 ? "https://avatar.iran.liara.run/public/boy"
//                 : "https://avatar.iran.liara.run/public/girl";
//         }

//         // ✅ Hash password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // ✅ Create parent user
//         const newUser = await User.create({
//             userNo,
//             fname,
//             sname,
//             lname,
//             email,
//             password: hashedPassword,
//             role,
//             gender,
//             profilePic
//         });

//         console.log("✅ Parent User Created");

//         // ✅ Create parent details
//         const newParent = await Parent.create({
//             parentsId: userNo,
//             studentNo,
//             relationship,
//             contactNo
//         });

//         console.log("✅ Parent Details Created");

//         return res.status(201).json({
//             success: "Parent registered successfully",
//             userNo: newUser.userNo
//         });

//     } catch (error) {
//         console.error("❌ Error registering parent:", error);
//         return res.status(500).json({ error: "Internal server error" });
//     }
// };



// export const registerParent = async (req, res) => {
//   console.log(req.body);
//   const { studentNo, relationship, contactNo, fname, sname, lname, gender, email, password, role } = req.body;
//   let { profilePic } = req.body;

//   // ✅ Validate required fields
//   if (!studentNo) return res.status(400).json({ error: "Student number is required." });
//   if (!relationship) return res.status(400).json({ error: "Relationship with student is required." });
//   if (!contactNo) return res.status(400).json({ error: "Contact number is required." });
//   if (!fname) return res.status(400).json({ error: "First name is required." });
//   if (!lname) return res.status(400).json({ error: "Last name is required." });
//   if (!gender) return res.status(400).json({ error: "Gender is required." });
//   if (!email) return res.status(400).json({ error: "Email is required." });
//   if (!password) return res.status(400).json({ error: "Password is required." });
//   if (!role) return res.status(400).json({ error: "Role is required." });

//   console.log("✅ Passed Validation Checks");

//   try {
//     // ✅ Check if parent already exists
//     let existingParent = await Parent.findOne({ parentsId: email });

//     if (existingParent) {
//       console.log("✅ Parent already exists");

//       // Check if student is already in children array
//       if (!existingParent.children.includes(studentNo)) {
//         existingParent.children.push(studentNo);
//         await existingParent.save();
//         console.log("✅ Added studentNo to existing parent");
//       } else {
//         console.log("⚠️ Student already linked to this parent");
//       }

//       return res.status(200).json({ success: "Parent updated with new student" });
//     }

//     console.log("✅ Registering new parent");

//     // ✅ Check if email is already registered
//     const checkEmail = await User.findOne({ email: { $regex: `^${email}$`, $options: "i" } });
//     if (checkEmail) {
//       return res.status(409).json({ error: "Email is already registered" });
//     }

//     console.log("✅ Email is Unique");

//     // ✅ Generate a unique parent user number
//     const counter = await Counter.findByIdAndUpdate(
//       { _id: "parent" },
//       { $inc: { seq: 1 } },
//       { new: true, upsert: true }
//     );

//     const userNo = `prnt${counter.seq}`;
//     console.log("✅ Generated Parent User Number:", userNo);

//     // ✅ Set default profile picture if not provided
//     if (!profilePic) {
//       profilePic = gender === "male"
//         ? "https://avatar.iran.liara.run/public/boy"
//         : "https://avatar.iran.liara.run/public/girl";
//     }

//     // ✅ Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // ✅ Create parent user
//     const newUser = await User.create({
//       userNo,
//       fname,
//       sname,
//       lname,
//       email,
//       password: hashedPassword,
//       role,
//       gender,
//       profilePic
//     });

//     console.log("✅ Parent User Created");

//     // ✅ Create parent details
//     const newParent = await Parent.create({
//       parentsId: userNo,
//       children: [studentNo], // Store the studentNo in an array
//       relationship,
//       contactNo
//     });

//     console.log("✅ Parent Details Created");

//     return res.status(201).json({
//       success: "Parent registered successfully",
//       userNo: newUser.userNo
//     });

//   } catch (error) {
//     console.error("❌ Error registering parent:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };


export const registerParent = async (req, res) => {
    console.log(req.body);
    const { studentNo, relationship, contactNo, fname, sname, lname, gender, email, password, role } = req.body;
    let { profilePic } = req.body;
  
    // ✅ Validate required fields
    if (!studentNo) return res.status(400).json({ error: "Student number is required." });
    if (!relationship) return res.status(400).json({ error: "Relationship with student is required." });
    if (!contactNo) return res.status(400).json({ error: "Contact number is required." });
    if (!fname) return res.status(400).json({ error: "First name is required." });
    if (!lname) return res.status(400).json({ error: "Last name is required." });
    if (!gender) return res.status(400).json({ error: "Gender is required." });
    if (!email) return res.status(400).json({ error: "Email is required." });
    if (!password) return res.status(400).json({ error: "Password is required." });
    if (!role) return res.status(400).json({ error: "Role is required." });
  
    console.log("✅ Passed Validation Checks");
  
    try {
      // ✅ Check if email is already registered in User table
      const existingUser = await User.findOne({ email: { $regex: `^${email}$`, $options: "i" } });
  
      if (existingUser) {
        console.log("✅ Email is already registered, updating Parent table");
  
        // ✅ Check if the parent record exists
        let existingParent = await Parent.findOne({ parentsId: existingUser.userNo });
  
        if (existingParent) {
          // ✅ If parent exists, add studentNo to children array if not already present
          if (!existingParent.children.includes(studentNo)) {
            existingParent.children.push(studentNo);
            await existingParent.save();
            console.log("✅ Added studentNo to existing parent record");
            return res.status(200).json({ success: "Parent updated with new student" });
          } else {
            console.log("⚠️ Student already linked to this parent");
            return res.status(200).json({ success: "Student already linked to parent" });
          }
        } else {
          // ✅ If no parent record, create a new one
          console.log("⚠️ Parent record missing, creating new one");
          await Parent.create({
            parentsId: existingUser.userNo,
            children: [studentNo], // Store student numbers in an array
            relationship,
            contactNo
          });
  
          return res.status(201).json({ success: "Parent record created and linked to student" });
        }
      }
  
      console.log("✅ Registering new parent");
  
      // ✅ Generate a unique parent user number
      const counter = await Counter.findByIdAndUpdate(
        { _id: "parent" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
  
      const userNo = `prnt${counter.seq}`;
      console.log("✅ Generated Parent User Number:", userNo);
  
      // ✅ Set default profile picture if not provided
      if (!profilePic) {
        profilePic = gender === "male"
          ? "https://avatar.iran.liara.run/public/boy"
          : "https://avatar.iran.liara.run/public/girl";
      }
  
      // ✅ Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // ✅ Create parent user
      const newUser = await User.create({
        userNo,
        fname,
        sname,
        lname,
        email,
        password: hashedPassword,
        role,
        gender,
        profilePic
      });
  
      console.log("✅ Parent User Created");
  
      // ✅ Create parent details
      await Parent.create({
        parentsId: userNo,
        children: [studentNo], // Store the studentNo in an array
        relationship,
        contactNo
      });
  
      console.log("✅ Parent Details Created");
  
      return res.status(201).json({
        success: "Parent registered successfully",
        userNo: newUser.userNo
      });
  
    } catch (error) {
      console.error("❌ Error registering parent:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };


export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }
        if (!password) {
            return res.status(400).json({ error: "Password is required" });
        }

        // Check if user exists
        const checkUser = await User.findOne({ email });
        if (!checkUser) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, checkUser.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: "Invalid username or password" });
        }



        //getting the session
        const lastSession = await Session.findOne().sort({ _id: -1 });
        const academicYear = lastSession.academicYear;
        const term = lastSession.term;
        //get the teachers role
        let subjects = [];
        let tassignments = [];
        if (checkUser.role === "teacher") {
            tassignments = await TeacherAssignments.find({ userNo: checkUser.userNo, academicYear, term })
                .populate("subjects.subject subjects.classes teacher");
            const teacher = await Teachers.findOne(
                { userNo: checkUser.userNo },
                { subjects: 1, _id: 0 }
            );
            console.log(tassignments);
            subjects = teacher?.subjects || []; // Default to empty array if no subjects found
        }
        const token = jwt.sign(
            { id: checkUser._id, role: checkUser.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // ✅ Set token in an HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,   // Prevent client-side access
            secure: process.env.NODE_ENV === "production", // Use HTTPS in production
            sameSite: "Strict", // Prevent CSRF attacks
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        // Send response with user details and token
        return res.status(200).json({
            success: "Login successful",
            token,  // ✅ Include token for storage
            role: checkUser.role,
            fname: checkUser.fname,
            lname: checkUser.lname,
            userNo: checkUser.userNo,
            ObjectId: checkUser._id,
            subjects,
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "An error occurred" });
    }
};


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

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user); // Use req.user, not res.user
    } catch (error) {
        console.error("Error in authController", error); // Fix typo in "authCOntroleer"
        return res.status(500).json({ error: "Internal server error" }); // Fix typo in "internal server errror"
    }
};
