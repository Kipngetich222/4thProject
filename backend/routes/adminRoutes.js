// backend/routes/adminRoutes.js
import express from 'express';
import * as adminController from '../controllers/adminController.js'; // Important: .js extension!

const router = express.Router();

router.get('/users', adminController.getUsers);
router.delete('/users/:id', adminController.deleteUser);

export default router; // Default export