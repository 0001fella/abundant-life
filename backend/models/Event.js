// models/event.model.js
import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  date: { type: Date, required: true },
  location: String,
  image: {
    type: String, // e.g., '/uploads/event123.jpg'
    required: false
  },
  createdAt: { type: Date, default: Date.now },
  category: {
    type: String,
    required: true,
    enum: [
      'General Church Events',
      'Youths',
      'Teens',
      'Sunday School',
      'Women of Faith',
      'Visionaries'
    ],
    default: 'General Church Events'
  }
});

const Event = mongoose.model('Event', eventSchema);
export default Event;
