import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
} from '../Controllers/authController.js';

import { getLoginStats, getLoginHistory } from '../Controllers/loginStatsController.js'; // <-- ADD THIS
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Auth routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/profile', protect, getUserProfile);

// Login stats routes (ADD THESE)
router.get('/login-stats', protect, getLoginStats);
router.get('/login-history', protect, getLoginHistory);

export default router;
