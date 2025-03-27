
// const Counter = mongoose.models.Counter || mongoose.model("Counter", counterSchema);

// const userSchema = new mongoose.Schema({
//     userNo: { type: String, required: true, unique: true },
//     fname: { type: String, required: true },
//     sname: { type: String },
//     lname: { type: String, required: true },
//     gender : {type : String, required : true},
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true }, // Use only one password field
//     role: { type: String, enum: ["teacher", "parent", "student", "admin"], required: true },
//     profilePic: { type: String, default : "" }
// }, {timestamps : true});




// //const User = mongoose.model("User", userSchema);
// const User = mongoose.models.User || mongoose.model('User', userSchema);
// export default User;


import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Password must be at least 6 characters long"],
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
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Generate auth token
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign(
    { _id: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

// Remove sensitive data from JSON response
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
  delete userObject.resetPasswordToken;
  delete userObject.resetPasswordExpires;

  return userObject;
};

// Find user by credentials (for login)
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid login credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid login credentials");
  }

  return user;
};

// Generate password reset token
userSchema.methods.generatePasswordResetToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpires = Date.now() + 3600000; // 1 hour

  return resetToken;
};

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;