// import mongoose from "mongoose";

// const gradeSchema = new mongoose.Schema(
//   {
//     academicYear: {
//       type: String,
//       required: true,
//       default: () => new Date().getFullYear().toString(),
//       match: [/^\d{4}$/, "Invalid academic year format"], // Example: "2025"
//     },
//     classes: [
//       {
//         type: String, // Example: ["Form 1", "Form 2"]
//         required: true,
//       },
//     ],
//     stream: {
//       type: String, // Example: "Grade 1A"
//     },
//     term: {
//       type: String,
//       required: true,
//     },
//     exam: {
//       type: String,
//       required: true, // Example: "Midterm Exam", "End Term Exam"
//     },
//     subjects: [
//       {
//         subjectName: {
//           type: String,
//           required: true, // Example: "Mathematics"
//         },
//         grades: [
//           {
//             stdNo: {
//               type: String, 
//               required: true,
//             },
//             marks: {
//               type: Number,
//               min: 0,
//               max: 100,
//               default: null, // Marks are initially null
//             },
//           },
//         ],
//       },
//     ],
//   },
//   { timestamps: true }
// );

// const Grades =mongoose.model.Grades || mongoose.model("Grades", gradeSchema);
// export default Grades;


import mongoose from "mongoose";

const gradeSchema = new mongoose.Schema(
  {
    academicYear: {
      type: String,
      required: true,
      default: () => new Date().getFullYear().toString(),
      match: [/^\d{4}$/, "Invalid academic year format"], // Example: "2025"
    },
    classes: [
      {
        type: String, // Example: ["Form 1", "Form 2"]
        required: true,
      },
    ],
    stream: {
      type: String, // Example: "Grade 1A"
    },
    term: {
      type: String,
      required: true,
    },
    exam: {
      type: String,
      required: true, // Example: "Midterm Exam", "End Term Exam"
    },
    subjects: [
      {
        subjectName: {
          type: String,
          required: true, // Example: "Mathematics"
        },
        grades: [
          {
            stdNo: {
              type: String,
              required: true,
            },
            marks: {
              type: Number,
              min: 0,
              max: 100,
              default: null, // Marks are initially null
            },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

const Grades = mongoose.models.Grades || mongoose.model("Grades", gradeSchema);
export default Grades;
