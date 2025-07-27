import express from 'express';
import {
  getAllPrayers,
  createPrayer,
} from '../Controllers/prayerController.js';

const router = express.Router();

// GET all prayers
router.get('/', getAllPrayers);

// POST new prayer
router.post('/', createPrayer);

export default router;
