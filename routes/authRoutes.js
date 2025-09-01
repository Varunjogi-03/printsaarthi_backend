import express from 'express';
import { register, login, verifyToken, getProfile } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/verify-token', verifyToken);

// Protected routes
router.get('/profile', authenticateToken, getProfile);

export default router;
