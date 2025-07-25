import express from 'express';
import { updateProfile } from '../Controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ Safer: use /me/profile to avoid sending userId from client
router.put('/me/profile', protect, updateProfile);

export default router;
