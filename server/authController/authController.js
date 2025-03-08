import express from 'express';
import User from '../models/user.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import { generateToken } from '../Lib/libs.js';
const app = express();
const secretKey = "My Screte";

app.use(bodyParser.json());



dotenv.config(); // Add this line to load environment variables
// const today = () => {
//     const d = new Date();
//     const year = d.getFullYear();
//     const month = d.getMonth();
//     const date = d.getDate();
//     const hour = d.getHours();
//     const min = d.getMinutes();
//     const sec = d.getSeconds();

//     const thisTime = `${year}/${month}/${date}  ${hour}:${min}:${sec}`
//     return thisTime;
// }
export const registerUser = async (req, res) => {
    console.log(req.body);
    const { userNo, fname, sname, lname, gender, email, password, role } = req.body; // Removed profilePic
    let { profilePic } = req.body; // Declare profilePic separately with let
    // const createdAt = today();
    // const updatedAt = today();

    try {
        if (!userNo) {
            return res.json({ error: "User number is required" });
        }
        if (!fname) {
            return res.json({ error: "First name is required" });
        }
        if (!lname) {
            return res.json({ error: "Last name is required" });
        }
        if (!gender) {
            return res.json({ error: "Gender is required" });
        }
        if (!email) {
            return res.json({ error: "Email is required" });
        }
        if (!password) {
            return res.json({ error: "Password is required" });
        }
        if (!role) {
            return res.json({ error: "Role is required" });
        }

        const checkEmail = await User.findOne({ email });
        if (checkEmail) {
            console.log(process.env.db);
            return res.json({ error: "Email is already registered" });
        }
        const checkUserNo = await User.findOne({ userNo });
        if (checkUserNo) {
            console.log(`User no is ${userNo}`);
            return res.status(400).json({
                error: `A user exists with no ${userNo}`
            });
        }

        const boyPic = "https://avatar.iran.liara.run/public/boy";
        const girlPic = "https://avatar.iran.liara.run/public/girl";

        if (gender === "male") {
            profilePic = boyPic;
        } else if (gender === "female") {
            profilePic = girlPic;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            userNo, fname, sname, lname, email, password: hashedPassword, role, gender, profilePic
        });

        return res.json({ success: "User registered successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "An error occurred" });
    }
};



export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email) {
            return res.json({
                error: "Emai required"
            })
        } if (!password) {
            return res.json({
                error: "password required"
            })
        }
       
        const checkUser = await User.findOne({ email})
        if(!checkUser){
            return res.json({error : "invalid username or passsword"});
        } 

        const hashedPassword = await bcrypt.compare(password, checkUser.password);
        if(!hashedPassword){
            return res.json({error : "invalid username or passsword"});
        }
        generateToken(checkUser._id, res);
        return res.json({
                success : "login succes",
                role : checkUser.role,
                fname : checkUser.fname,
                lname : checkUser.lname
            });
    } catch(err){
        console.log(err);
        return res.json({error : "An error occured"})
    }
}

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
    if(req.res.role != admin){
        return res.json({error : "Acces denied"});
    }
    return res.json({message : "Welcom to the Admin dashbord"});
}

export const parent = (req, res) => {
    if(req.res.role != parent){
        return res.json({error : "Acces denied"});
    }
    return res.json({message : "Welcom to the parent dashbord"});
}

export const logout = (req, res) =>{
    try{
        res.cookie("jwt", "", {maxAge : 0});
        return res.status(200).json({sucess : "Logout success"});
    } catch(error){
        console.log(error);
        return res.status(500).json({error : "Internal server error"});
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
