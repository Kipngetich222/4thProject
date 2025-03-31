import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import {
  registerUser,
  loginUser,
  checkAuth,
  logout,
  registerParent,
} from "../authController/authController.js";
import protectRoute from "../Protected/protectRoute.js";
import {
  SendMessage,
  getUsersForSidebar,
  getMessages,
} from "../authController/messageController.js";
import {
  getUsers,
  fetchClassTeachers,
  addTeachers,
  AddStudents,
} from "../authController/adminController.js";
import {
  getGrades,
  AssignmentUpload,
  AssignmentLoad,
  markSubmission,
  fetchSubmission,
} from "../authController/teacherController.js";
import {
  viewSubmissions,
  submitAssignment,
} from "../authController/submissionController.js";
import {
  fetchStudentAssignments,
  viewAssingment,
} from "../authController/studentController.js";

const router = express.Router();

// Middleware
router.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

// Add this route
router.get("/auth/check", protectRoute, checkAuth);



// File upload configurations
const assignmentStorage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    cb(null, `${Date.now()}-${nameWithoutExt}${ext}`);
  },
});

const submissionStorage = multer.diskStorage({
  destination: "uploads/submissions/",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    cb(null, `${Date.now()}-${nameWithoutExt}${ext}`);
  },
});

const uploadAssignments = multer({ storage: assignmentStorage });
const uploadSubmissions = multer({ storage: submissionStorage });

// ======================
// Authentication Routes
// ======================
router.post("/login", loginUser);
router.post("/admin/register", registerUser);
router.post("/admin/register/parent", registerParent);
router.get("/check", protectRoute, checkAuth);
router.post("/logout", protectRoute, logout);

// ======================
// Admin Routes
// ======================
router.get("/admin/users", protectRoute, getUsers);
router.get("/admin/classTeachers", protectRoute, fetchClassTeachers);
router.post("/admin/teacher", protectRoute, addTeachers);
router.post("/admin/student", protectRoute, AddStudents);

// ======================
// Teacher Routes
// ======================
router.get("/teacher/grades", protectRoute, getGrades);
router.post(
  "/teacher/upload",
  protectRoute,
  uploadAssignments.single("file"),
  AssignmentUpload
);
router.get("/teacher/assignments", protectRoute, AssignmentLoad);
router.get(
  "/teacher/assignments/submissions/:assignmentId",
  protectRoute,
  viewSubmissions
);
router.post(
  "/teacher/assignments/submissions/mark/:submissionId",
  protectRoute,
  markSubmission
);
router.get(
  "/teacher/assignments/submissions/mark/:submissionId",
  protectRoute,
  fetchSubmission
);

// ======================
// Student Routes
// ======================
router.get("/student/assignments", protectRoute, fetchStudentAssignments);
router.get("/student/assignments/:assignmentId", protectRoute, viewAssingment);
router.post(
  "/student/assignment/submit",
  protectRoute,
  uploadSubmissions.single("file"),
  submitAssignment
);

// ======================
// Messaging Routes
// ======================
router.post("/message/send/:Id", protectRoute, SendMessage);
router.get("/message/users", protectRoute, getUsersForSidebar);
router.get("/message/getmessage/:Id", protectRoute, getMessages);

export default router;
