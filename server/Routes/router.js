<<<<<<< HEAD
import express, { application } from 'express';
const router = express.Router();
import cors from 'cors';
import { registerUser ,loginUser, student , teacher, admin, parent, checkAuth, logout} from '../authController/authController.js'; // Ensure file extension is added
import protectRoute from '../Protected/protectRoute.js';
import {SendMessage } from '../authController/messageController.js';
import { getUsers } from '../authController/adminController.js';
=======
import express from 'express';
const router = express.Router();
import cors from 'cors';
import { registerUser ,loginUser, student , teacher, admin, parent} from '../authController/authController.js'; // Ensure file extension is added
>>>>>>> f52d277c6a5cefe4e45ca931faec25f772d61095

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
<<<<<<< HEAD
router.get('/check', protectRoute, checkAuth);
router.post("/logout", logout);
router.post("/send/:id",protectRoute ,SendMessage);
router.get("/admin/users", protectRoute, getUsers);
=======
>>>>>>> f52d277c6a5cefe4e45ca931faec25f772d61095

export default router;
