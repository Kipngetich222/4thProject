// import mongoose from "mongoose";

// const counterSchema = new mongoose.Schema({
//     _id: { type: String, required: true },
//     seq: { type: Number, default: 0 }
// });

// const Counter = mongoose.models.Counter || mongoose.model("Counter", counterSchema);

// export default Counter;

import mongoose from "mongoose";

const counterSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    seq: {
      type: Number,
      default: 0,
    },
  },
  {
    // Prevent automatic index creation
    autoIndex: false,
  }
);

// Create proper index manually
counterSchema.index({ _id: 1 }, { unique: true });

const Counter =
  mongoose.models.Counter || mongoose.model("Counter", counterSchema);
export default Counter;
