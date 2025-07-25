import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  emoji: {
    type: String,
    default: '✨',
  },
  date: {
    type: String,
    required: true,
  },
  approved: {
    type: Boolean,
    default: true, // ✅ auto-approved!
  },
}, { timestamps: true });

export default mongoose.model('Testimonial', testimonialSchema);
