// import mongoose from "mongoose";

// const sessionSchema = new mongoose.Schema({
//   academicYear: {
//     type: String,
//     required: true,
//   },
//   term: {
//     type: String,
//     required: true,
//     enum: ["Term 1", "Term 2", "Term 3"],
//   },
//   startDate: {
//     type: Date,
//     required: true,
//   },
//   endDate: {
//     type: Date,
//     required: true,
//   },
// });

// const Session = mongoose.model.Session || mongoose.model("Session", sessionSchema);

// export default Session;


import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  academicYear: {
    type: String,
    required: true,
  },
  term: {
    type: String,
    required: true,
    enum: ["Term 1", "Term 2", "Term 3"],
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
});

// Check if model already exists to prevent overwrite error
const Session = mongoose.models.Session || mongoose.model("Session", sessionSchema);

export default Session;
