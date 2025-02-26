import express from 'express';
import User from '../models/user.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';

const app = express();
const secretKey = "My Screte";

app.use(bodyParser.json());



dotenv.config(); // Add this line to load environment variables
const today = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = d.getMonth();
    const date = d.getDate();
    const hour = d.getHours();
    const min = d.getMinutes();
    const sec = d.getSeconds();

    const thisTime = `${year}/${month}/${date}  ${hour}:${min}:${sec}`
    return thisTime;
}
export const registerUser = async (req, res) => {
    console.log(req.body);
    const { user_id, fname, sname, lname, email, password, role } = req.body;
    var createdAt = today();
    var updatedAt = today();
    try {
        if (!user_id) {
            return res.json({ error: "User number is required" });
            
        }
        if (!fname) {
            return res.json({ error: "First name is required" });
           
        }
        if (!lname) {
            return res.json({ error: "Last name is required" });
            c
        }
        if (!email) {
            return res.json({ error: "Email is required" });
            console.log(email)
        }
        if (!password) {
            return res.json({ error: "Password is required" });
            console.log("error 1")
        } if (!role) {
            return res.json({ error: "Role is required" })
        }

        const checkEmail = await User.findOne({ email}); // Corrected find query
        if (checkEmail) {
            console.log(process.env.db)
            return res.json({ error: "Email is already registered" });
        }
        const hashedPassword = await bcrypt.hash(password , 10);
        await User.create({
            user_id, fname, sname, lname, email, password : hashedPassword, role, createdAt, updatedAt
        });

        return res.json({ success: "User registered successfully" });
    } catch (error) {
        console.log(error);
        return res.json({ error: "An error occurred" });
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
        
        const token = jwt.sign({userId : checkUser._id, role : checkUser.role}, secretKey, {expiresIn : '1h'});
        return res.json({success : "login succes", role : checkUser.role});
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