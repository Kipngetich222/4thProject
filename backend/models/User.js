import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["teacher", "parent", "student", "admin"], required: true },
});

const User = mongoose.model("User", userSchema); // Create the model

export default User; // Export the model as a default export
// or
// export {User}; // Named export