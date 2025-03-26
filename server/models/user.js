// import mongoose from "mongoose";


// const counterSchema = new mongoose.Schema({
//     _id: { type: String, required: true },
//     seq: { type: Number, default: 0 }
// });

// const Counter = mongoose.model('Counter', counterSchema);

// const userSchema = new mongoose.Schema({
//     userNo: { type: String, required: true, unique: true },
//     fname: { type: String, required: true },
//     sname: { type: String },
//     lname: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true }, // Use only one password field
//     role: { type: String, enum: ["teacher", "parent", "student", "admin"], required: true },
//     profileImage: { type: String },
//     createdAt: { type: Date, default: Date.now },
//     updatedAt: { type: Date, default: Date.now },
// });

// userSchema.pre('save', async function(next) {
//     const doc = this;
//     const counter = await Counter.findByIdAndUpdate(
//         { _id: 'userNo' },
//         { $inc: { seq: 1 } },
//         { new: true, upsert: true }
//     );
//     doc.userNo = counter.seq;
//     next();
// });


// const User = mongoose.model("User", userSchema);
// export default User;
