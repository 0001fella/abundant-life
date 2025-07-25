import express from 'express';
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent
} from '../Controllers/eventController.js';
import upload from '../middleware/upload.js'; // Use centralized upload middleware

const router = express.Router();

// --- Routes ---
router.get('/', getEvents);

// Use centralized upload middleware
router.post('/', upload.single('image'), createEvent);
router.put('/:id', upload.single('image'), updateEvent);
router.delete('/:id', deleteEvent);

export default router;