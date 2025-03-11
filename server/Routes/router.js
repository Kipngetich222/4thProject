import express, { application } from 'express';
const router = express.Router();
import cors from 'cors';
import { registerUser ,loginUser, student , teacher, admin, parent, checkAuth, logout} from '../authController/authController.js'; // Ensure file extension is added
import protectRoute from '../Protected/protectRoute.js';
import {SendMessage } from '../authController/messageController.js';
import { getUsers } from '../authController/adminController.js';

router.use(cors({
    credentials: true,
    origin: 'http://localhost:5173' 
}));

router.post('/register', registerUser); 
router.post('/login', loginUser)
router.get('/teacher', teacher);
router.get('/parent', parent);
router.get('/student', student);
router.get('/admin', admin);
router.get('/check', protectRoute, checkAuth);
router.post("/logout", logout);
router.post("/send/:id",protectRoute ,SendMessage);
router.get("/admin/users", protectRoute, getUsers);

export default router;
