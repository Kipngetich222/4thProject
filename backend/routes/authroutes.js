// backend/routes/authRoutes.js
import express from 'express';
import * as authController from '../controllers/authController.js'; // Note the .js extension!

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

export default router; // Default export (recommended)