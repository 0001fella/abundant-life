import express from 'express';
import {
  getAllPrayers,
  createPrayer,
} from '../controllers/prayerController.js'; // Make sure path and casing match

const router = express.Router();

// GET all prayers
router.get('/', getAllPrayers);

// POST new prayer
router.post('/', createPrayer);

export default router;
