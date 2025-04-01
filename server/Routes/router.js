import express from 'express';
const router = express.Router();
import cors from 'cors';
import { registerUser ,loginUser, student , teacher, admin, parent} from '../authController/authController.js'; // Ensure file extension is added

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

export default router;
