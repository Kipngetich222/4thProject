//import { parent } from "../authController/authController";

//const mongoose = require("mongoose");
import mongoose from "mongoose";

// Define Parent Schema
const parentSchema = new mongoose.Schema({
    parentsId: {
        type: String,
        required: true,
        unique: true // Ensures the ID is unique
    },
    studentNo: {
        type: String,
        required: true // Represents the student's unique ID
    },
    relationship: {
        type: String,
        required: true // Example: "Mother", "Father", "Guardian"
    },
    contactNo: {
        type: String,
        required: true // Contact number of the parent/guardian
    }
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps automatically

// Compile the schema into a model
const Parent = mongoose.model("Parent", parentSchema);

export default Parent;