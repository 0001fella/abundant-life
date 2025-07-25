import Testimonial from '../models/Testimonial.js';

export const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.status(200).json(testimonials);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch testimonials' });
  }
};

export const createTestimonial = async (req, res) => {
  try {
    const { name, message, emoji, date } = req.body;

    if (!name || !message || !date) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const testimonial = new Testimonial({ name, message, emoji, date });
    await testimonial.save();
    res.status(201).json(testimonial);
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit testimonial' });
  }
};
