// import express, { application } from 'express';
// const router = express.Router();
// import cors from 'cors';
// import multer from 'multer';
// import { registerUser ,loginUser, student , teacher, admin, parent, checkAuth, logout} from '../authController/authController.js'; // Ensure file extension is added
// import protectRoute from '../Protected/protectRoute.js';
// import {SendMessage } from '../authController/messageController.js';
// import { getUsers, fetchClassTeachers , addTeachers } from '../authController/adminController.js';
// import { getGrades , AssignmentUpload, AssignmentLoad} from '../authController/teacherController.js';


// router.use(cors({
//     credentials: true,
//     origin: 'http://localhost:5173' 
// }));

// const upload = multer({ dest: "uploads/" });

// router.post('/admin/register', registerUser); 
// router.post('/login', loginUser)
// router.get('/teacher', teacher);
// router.get('/parent', parent);
// router.get('/student', student);
// router.get('/admin', admin);
// router.get('/check', protectRoute, checkAuth);
// router.post("/logout", logout);
// router.post("/send/:id",protectRoute ,SendMessage);
// router.get("/admin/users", protectRoute, getUsers);
// router.get("/teacher/grades", protectRoute, getGrades);
// router.get("/admin/classTeachers", protectRoute, fetchClassTeachers);
// router.post("/admin/teacher", protectRoute, addTeachers);
// //router.post("/teacher/upload", protectRoute, AssignmentUpload);

// router.post("/teacher/upload", protectRoute, upload.single("file"), AssignmentUpload);
// router.get("/teacher/assignments", AssignmentLoad);


// export default router;


import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import { registerUser, loginUser, student, teacher, admin, parent, checkAuth, logout } from "../authController/authController.js";
import protectRoute from "../Protected/protectRoute.js";
import { SendMessage } from "../authController/messageController.js";
import { getUsers, fetchClassTeachers, addTeachers } from "../authController/adminController.js";
import { getGrades, AssignmentUpload, AssignmentLoad } from "../authController/teacherController.js";

const router = express.Router();

router.use(cors({
    credentials: true,
    origin: "http://localhost:5173",
}));

// ✅ Configure Multer to Preserve File Extensions
const storage = multer.diskStorage({
  destination: "uploads/", // ✅ Store files in the uploads/ folder
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // ✅ Get the correct extension
    const nameWithoutExt = path.basename(file.originalname, ext); // ✅ Remove existing extension
    cb(null, `${Date.now()}-${nameWithoutExt}${ext}`); // ✅ Ensure only one extension is added
  },
});

const upload = multer({ storage });

router.post("/admin/register", registerUser);
router.post("/login", loginUser);
router.get("/teacher", teacher);
router.get("/parent", parent);
router.get("/student", student);
router.get("/admin", admin);
router.get("/check", protectRoute, checkAuth);
router.post("/logout", logout);
router.post("/send/:id", protectRoute, SendMessage);
router.get("/admin/users", protectRoute, getUsers);
router.get("/teacher/grades", protectRoute, getGrades);
router.get("/admin/classTeachers", protectRoute, fetchClassTeachers);
router.post("/admin/teacher", protectRoute, addTeachers);

// ✅ Fix: Multer now correctly saves the file with an extension
router.post("/teacher/upload", protectRoute, upload.single("file"), AssignmentUpload);

// ✅ Fix: Fetch uploaded assignments
router.get("/teacher/assignments", AssignmentLoad);

export default router;

