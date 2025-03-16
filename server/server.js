import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "./models/user.js";
import cors from 'cors';
import dotenv from 'dotenv';
import router from "./Routes/router.js";
import courseRoutes from "./Routes/courseRoutes.js";
import assignmentRoutes from "./Routes/assignmentRoutes.js";
import gradeRoutes from "./Routes/gradeRoutes.js";
dotenv.config();
const app = express();
app.use(express.json()); // Middleware to parse JSON request body
app.use(cors({
    origin: "http://localhost:5174",
    credentials: true
}));


app.use("/api/course", courseRoutes);
// Mount the assignment routes
app.use("/api/assignment", assignmentRoutes);
// Mount the grade routes
app.use("/api/grade", gradeRoutes);


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