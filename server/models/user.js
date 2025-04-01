import mongoose from "mongoose";


const counterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
});

<<<<<<< HEAD
//const Counter = mongoose.model('Counter', counterSchema);
=======
const Counter = mongoose.model('Counter', counterSchema);
>>>>>>> f52d277c6a5cefe4e45ca931faec25f772d61095

const userSchema = new mongoose.Schema({
    userNo: { type: String, required: true, unique: true },
    fname: { type: String, required: true },
    sname: { type: String },
    lname: { type: String, required: true },
<<<<<<< HEAD
    gender : {type : String, required : true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Use only one password field
    role: { type: String, enum: ["teacher", "parent", "student", "admin"], required: true },
    profilePic: { type: String, default : "" }
}, {timestamps : true});
=======
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Use only one password field
    role: { type: String, enum: ["teacher", "parent", "student", "admin"], required: true },
    profileImage: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});
>>>>>>> f52d277c6a5cefe4e45ca931faec25f772d61095

userSchema.pre('save', async function(next) {
    const doc = this;
    const counter = await Counter.findByIdAndUpdate(
        { _id: 'userNo' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );
    doc.userNo = counter.seq;
    next();
});


<<<<<<< HEAD
//const User = mongoose.model("User", userSchema);
const User = mongoose.models.User || mongoose.model('User', userSchema);
=======
const User = mongoose.model("User", userSchema);
>>>>>>> f52d277c6a5cefe4e45ca931faec25f772d61095
export default User;
