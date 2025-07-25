import express from 'express';
import { body, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';
import Testimonial from '../models/Testimonial.js';

const router = express.Router();

// Limit to 1 testimonial every 15 mins per IP
const testimonialLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1,
  message: '⏱️ You can only submit one testimonial every 15 minutes',
});

// GET all testimonials (no approval filtering)
router.get('/', async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (err) {
    console.error('Error fetching testimonials:', err);
    res.status(500).json({ message: 'Server error while fetching testimonials' });
  }
});

// POST new testimonial (auto-approved)
router.post(
  '/',
  testimonialLimiter,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('message').trim().notEmpty().withMessage('Message is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { name, message, emoji, date } = req.body;

    try {
      const newTestimonial = new Testimonial({
        name,
        message,
        emoji,
        date,
        approved: true, // auto-approved
      });

      const saved = await newTestimonial.save();
      res.status(201).json(saved);
    } catch (err) {
      console.error('Error submitting testimonial:', err);
      res.status(500).json({ message: 'Failed to submit testimonial' });
    }
  }
);

export default router;
