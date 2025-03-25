import express from 'express';
const router = express.Router();
import cors from 'cors';
import { registerUser ,loginUser, student , teacher, admin, parent} from '../authController/authController.js'; // Ensure file extension is added
import courseRoutes from "./courseRoutes.js";

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
router.use("/api/course", courseRoutes);

export default router;
