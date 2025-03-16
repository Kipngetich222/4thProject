import express, { application } from 'express';
const router = express.Router();
import cors from 'cors';
import multer from 'multer';
import { registerUser ,loginUser, student , teacher, admin, parent, checkAuth, logout} from '../authController/authController.js'; // Ensure file extension is added
import protectRoute from '../Protected/protectRoute.js';
import {SendMessage } from '../authController/messageController.js';
import { getUsers, fetchClassTeachers , addTeachers } from '../authController/adminController.js';
import { getGrades , AssignmentUpload} from '../authController/teacherController.js';


router.use(cors({
    credentials: true,
    origin: 'http://localhost:5173' 
}));

const upload = multer({ dest: "uploads/" });

router.post('/admin/register', registerUser); 
router.post('/login', loginUser)
router.get('/teacher', teacher);
router.get('/parent', parent);
router.get('/student', student);
router.get('/admin', admin);
router.get('/check', protectRoute, checkAuth);
router.post("/logout", logout);
router.post("/send/:id",protectRoute ,SendMessage);
router.get("/admin/users", protectRoute, getUsers);
router.get("/teacher/grades", protectRoute, getGrades);
router.get("/admin/classTeachers", protectRoute, fetchClassTeachers);
router.post("/admin/teacher", protectRoute, addTeachers);
//router.post("/teacher/upload", protectRoute, AssignmentUpload);

router.post("/teacher/upload", protectRoute, upload.single("file"), AssignmentUpload);


export default router;
