import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import { registerUser, loginUser, student, teacher, admin, parent, checkAuth, logout, registerParent } from "../authController/authController.js";
import protectRoute from "../Protected/protectRoute.js";
import { SendMessage , getUsersForSidebar,getMessages} from "../authController/messageController.js";
import { getUsers, fetchClassTeachers, addTeachers, AddStudents } from "../authController/adminController.js";
import { getGrades, AssignmentUpload, AssignmentLoad } from "../authController/teacherController.js";
import { viewSubmissions, submitAssignment } from "../authController/submissionController.js";
//import { fetchStudentAssignments, viewAssignment } from "../authController/studentController.js"; // ✅ Fixed naming
import { fetchStudentAssignments } from "../authController/studentController.js";
import { viewAssingment } from "../authController/studentController.js";
import {markSubmission, fetchSubmission } from "../authController/teacherController.js";
import { getMaxListeners } from "events";
//import fetchAssingment from "../authController/teacherController.js";

const router = express.Router();
const app = express();

router.use(cors({
    credentials: true,
    origin: "http://localhost:5173",
}));
app.use("/api", router);

// ✅ Multer Storage for Assignments
const assignmentStorage = multer.diskStorage({
  destination: "uploads/", // ✅ Store teacher-uploaded assignments in "uploads/"
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    cb(null, `${Date.now()}-${nameWithoutExt}${ext}`); // ✅ Preserve extension
  },
});

// ✅ Multer Storage for Student Submissions
const submissionStorage = multer.diskStorage({
  destination: "uploads/submissions/", // ✅ Store student submissions separately
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    cb(null, `${Date.now()}-${nameWithoutExt}${ext}`); // ✅ Preserve extension
  },
});

// ✅ Initialize Multer for Different Uploads
const uploadAssignments = multer({ storage: assignmentStorage });
const uploadSubmissions = multer({ storage: submissionStorage });

// ✅ Authentication & General Routes
router.post("/admin/register", registerUser);
router.post("/login", loginUser);
router.get("/teacher", teacher);
router.get("/parent", parent);
router.get("/student", student);
//router.get("/admin", admin);
router.get("/check", /*protectRoute,*/ checkAuth);
router.post("/logout", logout);
router.post("/send/:id", /*protectRoute,*/ SendMessage);

// ✅ Admin Routes
router.get("/admin/users",protectRoute, getUsers);
router.get("/admin/classTeachers", /*protectRoute,*/ fetchClassTeachers);
router.post("/admin/teacher", /*protectRoute,*/ addTeachers);
router.post("/admin/student", /*protectRoute,*/ AddStudents);
router.post("/admin/register/parent", /*protectRoute,*/ registerParent);


// ✅ Teacher Routes
router.get("/teacher/grades", /*protectRoute,*/ getGrades);
router.post("/teacher/upload", /*protectRoute,*/ uploadAssignments.single("file"), AssignmentUpload);
router.get("/teacher/assignments", /*protectRoute,*/AssignmentLoad);
// router.get("/teacher/assignments/submissions/:assingnemtId", protectRoute, viewSubmissions); // ✅ View all submissions for a given assignment
router.get("/teacher/assignments/submissions/:assignmentId", /*protectRoute,*/ viewSubmissions);
router.post("/teacher/assignments/submissions/mark/:submissionId", /*protectRoute,*/ markSubmission);
//http://localhost:5173/teacher/assingments/submissions/mark/67e1121bbc670c65b189e2d3
// router.get(`/teacher/assignments/submissions/:submissionId`, protectRoute, fetchAssingment);
// router.get(`/teacher/assignments/submissions/:submissionId`, protectRoute, fetchAssingment);
router.get(`/teacher/assignments/submissions/mark/:submissionId`, /*protectRoute,*/ fetchSubmission);





// ✅ Student Routes
router.get("/student/assignments", /*protectRoute,*/ fetchStudentAssignments);
router.get("/student/assignments/:assignmentId", /*protectRoute,*/ viewAssingment);
router.post("/student/assignment/submit", /*protectRoute,*/ uploadSubmissions.single("file"), submitAssignment); // ✅ Store submissions separately

//routes for everyone
router.post("/message/send/:Id", /*protectRoute,*/ SendMessage);
router.get("/message/users", /*protectRoute,*/ getUsersForSidebar);
router.get("/message/getmessage/:Id", /*protectRoute,*/ getMessages);


export default router;


