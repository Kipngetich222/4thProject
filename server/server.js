import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/user.js";
import cors from 'cors';
import dotenv from 'dotenv';
import router from "./Routes/router.js";
dotenv.config();
const app = express();
app.use(express.json()); // Middleware to parse JSON request body
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));




// Middleware to parse JSON
app.use(express.json());
// app.post("/register", (req, res) => {
//     res.json({ message: "Registration successful" });
// });


// Start server
mongoose.connect(process.env.db)
    .then(() => {
        console.log("MongoDB connected");
        app.listen(process.env.PORT, () => console.log(`server running on port ${process.env.PORT} `));
    })
    .catch(err => console.error("Database connection error:", err));

app.use('/', router);