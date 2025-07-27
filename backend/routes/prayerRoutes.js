import express from 'express';
import {
  getAllPrayers,
  createPrayer,
} from '../controllers/prayerController.js'; // ✅ Case-sensitive check: file must be named exactly 'prayerController.js'

const router = express.Router();

// GET all prayers
router.get('/', getAllPrayers);

// POST new prayer
router.post('/', createPrayer);

export default router;
