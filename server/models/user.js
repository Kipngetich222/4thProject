import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userNo: {
      type: String,
      required: true,
      unique: true,
    },
    fname: {
      type: String,
      required: true,
    },
    sname: {
      type: String,
    },
    lname: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["teacher", "parent", "student", "admin"],
      required: true,
    },
    profilePic: {
      type: String,
      default: "",
    },
    lastSeen: Date,
    isOnline: Boolean,
  },
  {
    timestamps: true,
  }
);

userSchema.virtual("fullName").get(function () {
  return `${this.fname} ${this.lname}`;
});

// Remove all pre-save hooks - counter logic is handled in auth controller
const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;